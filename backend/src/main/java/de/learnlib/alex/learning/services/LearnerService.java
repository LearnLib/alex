/*
 * Copyright 2015 - 2022 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.exceptions.ResourcesExhaustedException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.DifferenceTreeInput;
import de.learnlib.alex.learning.entities.DifferenceTreeStrategy;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResult.Status;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.LearningProcessStatus;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.testing.services.TestService;
import de.learnlib.alex.webhooks.dao.WebhookDAO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import de.learnlib.algorithms.ttt.base.BaseTTTDiscriminationTree;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealyBuilder;
import de.learnlib.oracle.equivalence.WpMethodEQOracle;
import de.learnlib.oracle.membership.SULOracle;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.serialization.dot.GraphDOT;
import net.automatalib.util.automata.Automata;
import net.automatalib.util.automata.conformance.WMethodTestsIterator;
import net.automatalib.util.automata.conformance.WpMethodTestsIterator;
import net.automatalib.util.automata.transducers.MealyFilter;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Basic class to control and monitor a learn process. This class is a high level abstraction of the LearnLib.
 */
@Service
public class LearnerService {

    /** Indicator for in which phase the learner currently is. */
    public enum LearnerPhase {

        /** If the learner is active. */
        LEARNING,

        /** If the equivalence oracle is active. */
        EQUIVALENCE_TESTING
    }

    private final LearnerSetupDAO learnerSetupDAO;
    private final LearnerResultDAO learnerResultDAO;
    private final ProjectDAO projectDAO;
    private final ApplicationContext applicationContext;
    private final TestService testService;
    private final UserDAO userDAO;
    private final TransactionTemplate transactionTemplate;
    private final WebhookDAO webhookDAO;

    /** The learner threads for users (userId -> thread). */
    private final Map<Long, LearnerThread> learnerThreads;

    @Autowired
    public LearnerService(LearnerSetupDAO learnerSetupDAO,
                          LearnerResultDAO learnerResultDAO,
                          ApplicationContext applicationContext,
                          ProjectDAO projectDAO,
                          @Lazy TestService testService,
                          UserDAO userDAO,
                          TransactionTemplate transactionTemplate,
                          WebhookDAO webhookDAO) {
        this.learnerSetupDAO = learnerSetupDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.projectDAO = projectDAO;
        this.applicationContext = applicationContext;
        this.testService = testService;
        this.userDAO = userDAO;
        this.transactionTemplate = transactionTemplate;
        this.webhookDAO = webhookDAO;
        this.learnerThreads = new ConcurrentHashMap<>();
    }

    /**
     * Start a learning process by activating a LearningThread.
     *
     * @param user
     *         The user that wants to start the learning process.
     * @param project
     *         The project the learning process runs in.
     * @param startConfiguration
     *         The configuration to use for the learning process.
     * @throws IllegalArgumentException
     *         If the configuration was invalid or the user tried to start a second active learning thread.
     * @throws IllegalStateException
     *         If a learning process is already active.
     * @throws NotFoundException
     *         If the symbols specified in the configuration could not be found.
     */
    public LearnerResult start(User user, Project project, LearnerStartConfiguration startConfiguration) {
        final var userInDb = this.userDAO.getByID(user.getId());
        checkRunningProcesses(userInDb, project.getId());

        final var createdResult = transactionTemplate.execute(t -> {
            final var setup = startConfiguration.getSetup();
            final var createdSetup = setup.getId() != null ? setup : learnerSetupDAO.create(user, project.getId(), setup);

            final var options = startConfiguration.getOptions();
            if (options.getComment() == null || options.getComment().trim().equals("")) {
                options.setComment(createdSetup.getName());
            }

            // create onetime webhook
            if (options.getWebhook() != null) {
                final var webhook = options.getWebhook();
                webhook.setOnce(true);
                this.webhookDAO.create(user, webhook);
            }

            final var result = new LearnerResult();
            result.setSetup(createdSetup);
            result.setComment(startConfiguration.getOptions().getComment());

            final var r = learnerResultDAO.create(user, project.getId(), result);
            t.flush();

            return r;
        });

        enqueueLearningProcess(
                project.getId(),
                new StartingLearnerProcessQueueItem(user.getId(), project.getId(), createdResult.getId())
        );

        return createdResult;
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param user
     *         The user that wants to restart his latest thread.
     * @param projectId
     *         The project that is learned.
     * @param testNo
     *         The result of a previous process.
     * @param configuration
     *         The configuration to use for the next learning steps.
     */
    @Transactional(rollbackFor = Exception.class)
    public LearnerResult resume(User user, Long projectId, Long testNo, LearnerResumeConfiguration configuration) {
        final var userInDb = this.userDAO.getByID(user.getId());
        checkRunningProcesses(userInDb, projectId);

        configuration.checkConfiguration();
        var result = learnerResultDAO.getByTestNo(user, projectId, testNo);

        if (configuration.getStepNo() > result.getSteps().size()) {
            throw new IllegalArgumentException("The step number is not valid.");
        }

        if (result.getSteps().get(configuration.getStepNo() - 1).isError()) {
            throw new IllegalStateException("You cannot resume from a failed step.");
        }

        // reset the status in case it has been aborted before
        result = learnerResultDAO.updateStatus(result.getId(), Status.PENDING);

        enqueueLearningProcess(
                result.getProjectId(),
                new ResumingLearnerProcessQueueItem(user.getId(), result.getProjectId(), result.getId(), configuration)
        );

        return result;
    }

    /**
     * Starts the thread and updates the thread maps.
     *
     * @param projectId
     *         The id of the project.
     * @param item
     *         The thread to start.
     */
    private void enqueueLearningProcess(Long projectId, AbstractLearnerProcessQueueItem item) {
        if (learnerThreads.containsKey(projectId)) {
            learnerThreads.get(projectId).enqueue(item);
        } else {
            final var thread = applicationContext.getBean(LearnerThread.class);
            thread.onFinished(() -> learnerThreads.remove(projectId));

            learnerThreads.put(projectId, thread);
            thread.enqueue(item);
            thread.start();
        }
    }

    /**
     * Ends the learning process after the current step.
     *
     * @param projectId
     *         The id of the project that is learned.
     */
    @Transactional(rollbackFor = Exception.class)
    public void abort(User user, Long projectId, Long resultId) {
        final var project = projectDAO.getByID(user, projectId); // access check

        try {
            final var result = learnerResultDAO.getByID(user, projectId, resultId);

            final var userIsOwner = project.getOwners().stream()
                    .map(User::getId)
                    .anyMatch(ownerId -> ownerId.equals(user.getId()));

            if (!userIsOwner && (result.getExecutedBy() != null && !result.getExecutedBy().equals(user))) {
                throw new UnauthorizedException("You are not allowed to abort this learning process.");
            }

            if (isActive(projectId)) {
                learnerThreads.get(projectId).abort(result.getId());
            }
        } catch (NotFoundException e) {
            learnerThreads.get(projectId).removeFromProcessQueue(resultId);
        }
    }

    /**
     * Method to check if a learning process is still active or if it has finished.
     *
     * @param projectId
     *         The id of the project.
     * @return true if the learning process is active, false otherwise.
     */
    public boolean isActive(Long projectId) {
        return learnerThreads.containsKey(projectId);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean hasRunningOrPendingTasks(User user, Long projectId) {
        if (!isActive(projectId)) {
            return false;
        }

        LearnerStatus learnerStatus = this.getStatus(user, projectId);

        List<LearnerResult> currentProcessSingletonList = Optional.ofNullable(learnerStatus.getCurrentProcess())
                .map(LearningProcessStatus::getResult)
                .map(List::of)
                .orElse(Collections.emptyList());

        return Stream.of(currentProcessSingletonList, learnerStatus.getQueue())
                .flatMap(List::stream)
                .map(LearnerResult::getStatus)
                .anyMatch(status -> status.equals(LearnerResult.Status.IN_PROGRESS)
                        || status.equals(LearnerResult.Status.PENDING));
    }

    public long getNumberOfUserOwnedLearnProcesses(User user) {
        return user.getProjectsOwner().stream()
                .map(Project::getId)
                .filter(projectId -> hasRunningOrPendingTasks(user, projectId))
                .count();
    }

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param projectId
     *         The id of the project.
     * @return A snapshot of the Learner status.
     */
    @Transactional(rollbackFor = Exception.class)
    public LearnerStatus getStatus(User user, Long projectId) {
        if (isActive(projectId)) {
            final var thread = learnerThreads.get(projectId);
            final var process = thread.getCurrentProcess();

            // Make sure that a result has been persisted
            if (process.getResult() == null) return new LearnerStatus();

            final var processStatus = new LearningProcessStatus();
            processStatus.setCurrentQueries(process.getCurrentQueries());
            processStatus.setPhase(process.getLearnerPhase());
            processStatus.setResult(process.getResult());

            final var counterOracle = process.getCounterOracle();
            if (counterOracle != null) {
                processStatus.setCurrentQueryCount(counterOracle.getQueryCount());
                processStatus.setCurrentSymbolCount(counterOracle.getSymbolCount());
            }

            final var status = new LearnerStatus();
            status.setCurrentProcess(processStatus);

            final var results = learnerResultDAO.getByIDs(user, projectId, thread.getProcessQueue().stream()
                    .map(c -> c.resultId)
                    .collect(Collectors.toList())
            );

            status.setQueue(results);
            return status;
        } else {
            return new LearnerStatus();
        }
    }

    /**
     * Compare two MealyMachines and calculate their separating word.
     *
     * @param mealy1
     *         The first Mealy to compare.
     * @param mealy2
     *         The second Mealy to compare.
     * @return If the machines are different: The corresponding separating word; otherwise: ""
     */
    public SeparatingWord separatingWord(CompactMealyMachineProxy mealy1, CompactMealyMachineProxy mealy2) {
        final Alphabet<String> alphabet1 = mealy1.createAlphabet();
        final Alphabet<String> alphabet2 = mealy2.createAlphabet();
        checkAlphabetsAreIdentical(alphabet1, alphabet2);

        final CompactMealy<String, String> mealyMachine1 = mealy1.createMealyMachine(alphabet1);
        final CompactMealy<String, String> mealyMachine2 = mealy2.createMealyMachine(alphabet2);

        final Word<String> separatingWord = Automata.findSeparatingWord(mealyMachine1, mealyMachine2, alphabet1);

        if (separatingWord != null) {
            return new SeparatingWord(
                    separatingWord,
                    mealyMachine1.computeOutput(separatingWord),
                    mealyMachine2.computeOutput(separatingWord)
            );
        } else {
            return new SeparatingWord();
        }
    }

    public CompactMealy<String, String> differenceAutomaton(
            final CompactMealyMachineProxy mealyProxy1,
            final CompactMealyMachineProxy mealyProxy2
    ) {
        final var alphabet1 = mealyProxy1.createAlphabet();
        final var alphabet2 = mealyProxy2.createAlphabet();
        checkAlphabetsAreIdentical(alphabet1, alphabet2);

        final var undefinedOutput = "__";
        final var diffSul = new DifferenceSimulatorSUL(
                mealyProxy1.createMealyMachine(alphabet1),
                mealyProxy2.createMealyMachine(alphabet2),
                undefinedOutput
        );

        final var membershipOracle = new SULOracle<>(diffSul);

        final var learner = new TTTLearnerMealyBuilder<String, String>()
                .withAlphabet(alphabet1)
                .withOracle(membershipOracle)
                .create();

        final var equivalenceOracle = new WpMethodEQOracle<>(membershipOracle, 2);

        learner.startLearning();

        while (true) {
            final var hyp = learner.getHypothesisModel();
            final var counterexample = equivalenceOracle.findCounterExample(hyp, alphabet1);

            if (counterexample == null) {
                break;
            } else {
                learner.refineHypothesis(counterexample);
            }
        }

        final var hyp = learner.getHypothesisModel();
        final var prunedHyp = MealyFilter.pruneTransitionsWithOutput(
                hyp,
                alphabet1,
                undefinedOutput
        );

        return CompactMealyMachineProxy
                .createFrom(prunedHyp, alphabet1)
                .createMealyMachine(alphabet1);
    }

    public CompactMealy<String, String> differenceTree(User user, Long projectId, DifferenceTreeInput input) {

        final CompactMealy<String, String> differenceTree;
        if (input instanceof DifferenceTreeInput.AutomataInput) {
            differenceTree = differenceTree(
                    ((DifferenceTreeInput.AutomataInput) input).automaton1,
                    ((DifferenceTreeInput.AutomataInput) input).automaton2,
                    input.strategy
            );
        } else if (input instanceof DifferenceTreeInput.LearnerResultInput) {

            final var result1 = learnerResultDAO.getByTestNo(user, projectId, ((DifferenceTreeInput.LearnerResultInput) input).result1);
            final var step1 = result1.getSteps().get(((DifferenceTreeInput.LearnerResultInput) input).step1);
            final var result2 = learnerResultDAO.getByTestNo(user, projectId, ((DifferenceTreeInput.LearnerResultInput) input).result2);
            final var step2 = result2.getSteps().get(((DifferenceTreeInput.LearnerResultInput) input).step2);

            differenceTree = differenceTree(
                    result1,
                    result2,
                    step1,
                    step2,
                    input.strategy
            );
        } else {
            throw new IllegalArgumentException("Invalid input!");
        }

        return differenceTree;
    }

    public CompactMealy<String, String> differenceTree(
            final LearnerResult result1,
            final LearnerResult result2,
            final LearnerResultStep step1,
            final LearnerResultStep step2,
            final DifferenceTreeStrategy strategy
    ) {
        try {
            switch (strategy) {
                case DISCRIMINATION_TREE:
                    final var learner1 = result1.getSetup().getAlgorithm().createLearner(step1.getHypothesis().createAlphabet(), null);
                    result1.getSetup().getAlgorithm().resume(learner1, step1.getState());

                    final var learner2 = result2.getSetup().getAlgorithm().createLearner(step2.getHypothesis().createAlphabet(), null);
                    result2.getSetup().getAlgorithm().resume(learner2, step2.getState());

                    final var tttLearner1 = (TTTLearnerMealy<String, String>) learner1;
                    final var tttLearner2 = (TTTLearnerMealy<String, String>) learner2;

                    final BaseTTTDiscriminationTree<String, Word<String>> dt1 = tttLearner1.getDiscriminationTree();
                    final BaseTTTDiscriminationTree<String, Word<String>> dt2 = tttLearner2.getDiscriminationTree();

                    final var tests = new ArrayList<Word<String>>();
                    generateTestsDt(dt1, tests);
                    generateTestsDt(dt2, tests);

                    final var mealy1 = step1.getHypothesis().createMealyMachine(step1.getHypothesis().createAlphabet());
                    final var mealy2 = step2.getHypothesis().createMealyMachine(step2.getHypothesis().createAlphabet());

                    final Set<SeparatingWord> diffs = new HashSet<>();
                    tests.forEach(test -> {
                        final var o1 = mealy1.computeOutput(test);
                        final var o2 = mealy2.computeOutput(test);
                        if (!o1.equals(o2)) {
                            diffs.add(new SeparatingWord(test, o1, o2));
                        }
                    });

                    return buildDifferenceTree(diffs, step1.getHypothesis().createAlphabet());
                default:
                    return differenceTree(
                            step1.getHypothesis(),
                            step2.getHypothesis(),
                            strategy
                    );
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getCause());
        }
    }

    private void generateTestsDt(BaseTTTDiscriminationTree<String, Word<String>> dt1, ArrayList<Word<String>> tests) {
        for (var e : dt1) {
            if (e.isLeaf()) {
                Word<String> accessSequence = e.getData().getAccessSequence();
                List<String> testCaseSymbols = new ArrayList<>();

                var nodeP = e;
                while (!(nodeP.isRoot())) {
                    nodeP = nodeP.getParent();
                    var discriminator = nodeP.getDiscriminator();
                    testCaseSymbols.addAll(accessSequence.asList());
                    testCaseSymbols.addAll(discriminator.asList());
                    tests.add(Word.fromList(testCaseSymbols));
                    testCaseSymbols.clear();
                }
            } else if (e.isRoot() && e.getData() != null) {
                tests.add(e.getData().getAccessSequence());
            }
        }
    }

    /**
     * Find differences between two models.
     *
     * @param mealyProxy1
     *         The one model.
     * @param mealyProxy2
     *         The other model.
     * @param strategy
     *         The strategy
     * @return The differences found as a minimized, incomplete mealy machine
     */
    public CompactMealy<String, String> differenceTree(
            final CompactMealyMachineProxy mealyProxy1,
            final CompactMealyMachineProxy mealyProxy2,
            final DifferenceTreeStrategy strategy
    ) {
        final Alphabet<String> alphabet1 = mealyProxy1.createAlphabet();
        final Alphabet<String> alphabet2 = mealyProxy2.createAlphabet();
        checkAlphabetsAreIdentical(alphabet1, alphabet2);

        final CompactMealy<String, String> hyp1 = mealyProxy1.createMealyMachine(alphabet1);
        final CompactMealy<String, String> hyp2 = mealyProxy2.createMealyMachine(alphabet1);

        // the words where the output differs
        final Set<SeparatingWord> diffs = new HashSet<>();
        findDifferences(hyp1, hyp2, alphabet1, diffs, strategy);
        findDifferences(hyp2, hyp1, alphabet1, diffs, strategy);

        return buildDifferenceTree(diffs, alphabet1);
    }

    private CompactMealy<String, String> buildDifferenceTree(Set<SeparatingWord> diffs, Alphabet<String> alphabet) {
        // build tree
        // the tree is organized as an incomplete mealy machine
        final CompactMealy<String, String> diffTree = new CompactMealy<>(alphabet);
        diffTree.addInitialState();

        for (final SeparatingWord diff : diffs) {
            int currentState = diffTree.getInitialState();

            for (int k = 0; k < diff.getInput().length(); k++) {
                final String sym = diff.getInput().getSymbol(k);

                if (diffTree.getTransition(currentState, sym) == null) {
                    // if the transition does not yet exist in the tree
                    // create a new state in the tree and add the same transition
                    final int newState = diffTree.addState();

                    String out = diff.getOutput2().getSymbol(k);
                    if (k == diff.getInput().length() - 1) {
                        out += " <-> " + diff.getOutput1().getSymbol(k);
                    }

                    diffTree.addTransition(currentState, sym, newState, out);

                    // update the current state of the tree to the newly created one
                    currentState = newState;
                } else {
                    // update the current state of the tree accordingly
                    currentState = diffTree.getTransition(currentState, sym).getSuccId();
                }
            }
        }

        // minimize the tree
        final CompactMealy<String, String> target = new CompactMealy<>(alphabet);
        Automata.minimize(diffTree, alphabet, target);

        return target;
    }

    /**
     * Tests all words from the w method from <code>mealyProxy1</code> on <code>mealyProxy2</code>. Words with a
     * different output are added to the difference.
     *
     * @param hyp1
     *         The hypothesis to test the tests on.
     * @param hyp2
     *         The hypothesis to generate the w-method tests from.
     * @param alphabet
     *         The alphabet.
     * @param diffs
     *         The set of words that have a different output.
     */
    private void findDifferences(
            final CompactMealy<String, String> hyp1,
            final CompactMealy<String, String> hyp2,
            final Alphabet<String> alphabet,
            final Set<SeparatingWord> diffs,
            final DifferenceTreeStrategy strategy
    ) {
        final Iterator<Word<String>> testsIterator;
        if (Objects.requireNonNull(strategy) == DifferenceTreeStrategy.W_METHOD) {
            testsIterator = new WMethodTestsIterator<>(hyp2, alphabet, 0);
        } else {
            testsIterator = new WpMethodTestsIterator<>(hyp2, alphabet, 0);
        }

        while (testsIterator.hasNext()) {
            final Word<String> word = testsIterator.next();

            final Word<String> out1 = hyp1.computeOutput(word);
            final Word<String> out2 = hyp2.computeOutput(word);

            if (!out1.equals(out2)) {
                for (int i = 0; i < word.length(); i++) {
                    if (!out1.getSymbol(i).equals(out2.getSymbol(i))) {
                        diffs.add(new SeparatingWord(word.subWord(0, i + 1), out1, out2));
                        break;
                    }
                }
            }
        }
    }

    private void checkRunningProcesses(User user, Long projectId) {
        final var numberOfCurrentProcesses = getNumberOfUserOwnedLearnProcesses(user)
                + testService.getNumberOfUserOwnedTestProcesses(user);

        if (numberOfCurrentProcesses >= user.getMaxAllowedProcesses()) {
            // check if there are already running/pending tests in this project
            if (!this.hasRunningOrPendingTasks(user, projectId)) {
                throw new ResourcesExhaustedException("You are not allowed to have more than "
                        + user.getMaxAllowedProcesses()
                        + " concurrent test/learn processes.");
            }
        }
    }

    private void checkAlphabetsAreIdentical(Alphabet<String> a1, Alphabet<String> a2) {
        if (a1.size() != a2.size() || !a1.containsAll(a2)) {
            throw new IllegalArgumentException("The alphabets of the hypotheses are not identical.");
        }
    }
}
