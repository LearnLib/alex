/*
 * Copyright 2015 - 2021 TU Dortmund
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

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.LearningProcessStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.util.automata.conformance.WpMethodTestsIterator;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Basic class to control and monitor a learn process. This class is a high level abstraction of the LearnLib.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerService {

    private static final Logger logger = LogManager.getLogger();

    /** Indicator for in which phase the learner currently is. */
    public enum LearnerPhase {

        /** If the learner is active. */
        LEARNING,

        /** If the equivalence oracle is active. */
        EQUIVALENCE_TESTING
    }

    private final LearnerSetupDAO learnerSetupDAO;
    private final LearnerResultDAO learnerResultDAO;
    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;
    private final ProjectDAO projectDAO;
    private final ApplicationContext applicationContext;

    /** The learner threads for users (userId -> thread). */
    private final Map<Long, LearnerThread> learnerThreads;

    @Autowired
    public LearnerService(LearnerSetupDAO learnerSetupDAO,
                          LearnerResultDAO learnerResultDAO,
                          ApplicationContext applicationContext,
                          PreparedConnectorContextHandlerFactory contextHandlerFactory,
                          ProjectDAO projectDAO) {
        this.learnerSetupDAO = learnerSetupDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.contextHandlerFactory = contextHandlerFactory;
        this.projectDAO = projectDAO;
        this.applicationContext = applicationContext;

        this.learnerThreads = new HashMap<>();
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
        final var setup = startConfiguration.getSetup();
        final var createdSetup = setup.getId() != null ? setup : learnerSetupDAO.create(user, project.getId(), setup);

        final var options = startConfiguration.getOptions();
        if (options.getComment() == null || options.getComment().trim().equals("")) {
            options.setComment(createdSetup.getName());
        }

        final var result = new LearnerResult();
        result.setSetup(createdSetup);
        result.setComment(startConfiguration.getOptions().getComment());

        final var createdResult = learnerResultDAO.create(user, project.getId(), result);

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
    public LearnerResult resume(User user, Long projectId, Long testNo, LearnerResumeConfiguration configuration) {
        configuration.checkConfiguration();
        var result = learnerResultDAO.getByTestNo(user, projectId, testNo);

        if (configuration.getStepNo() > result.getSteps().size()) {
            throw new IllegalArgumentException("The step number is not valid.");
        }

        if (result.getSteps().get(configuration.getStepNo() - 1).isError()) {
            throw new IllegalStateException("You cannot resume from a failed step.");
        }

        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            validateCounterexample(user, result, configuration);
        }

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

    private void validateCounterexample(User user, LearnerResult result, LearnerResumeConfiguration configuration)
            throws IllegalArgumentException {

        final SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
        for (List<SampleEQOracleProxy.InputOutputPair> counterexample : oracle.getCounterExamples()) {
            List<ParameterizedSymbol> symbolsFromCounterexample = new ArrayList<>();
            List<String> outputs = new ArrayList<>();

            // search symbols in configuration where symbol.name == counterexample.input
            for (SampleEQOracleProxy.InputOutputPair io : counterexample) {
                Optional<ParameterizedSymbol> symbol = result.getSetup().getSymbols().stream()
                        .filter(s -> s.getAliasOrComputedName().equals(io.getInput()))
                        .findFirst();

                // collect all outputs in order to compare it with the result of learner.readOutputs()
                if (symbol.isPresent()) {
                    symbolsFromCounterexample.add(symbol.get());
                    outputs.add(io.getOutput());
                } else {
                    throw new IllegalArgumentException("The symbol with the name '" + io.getInput() + "'"
                            + " is not used in this test setup.");
                }
            }

            // check if the given sample matches the behavior of the SUL
            final List<String> results = readOutputs(
                    user,
                    result.getProject(),
                    result.getSetup().getEnvironments().get(0),
                    result.getSetup().getPreSymbol(),
                    symbolsFromCounterexample,
                    result.getSetup().getPostSymbol(),
                    result.getSetup().getWebDriver()
            ).stream()
                    .map(ExecuteResult::getOutput)
                    .collect(Collectors.toList());

            if (!results.equals(outputs)) {
                throw new IllegalArgumentException("At least one of the given samples for counterexamples"
                        + " is not matching the behavior of the SUL.");
            }
        }
    }

    /**
     * Ends the learning process after the current step.
     *
     * @param projectId
     *         The id of the project that is learned.
     */
    public void abort(User user, Long projectId, Long testNo) {
        final var project = projectDAO.getByID(user, projectId); // access check
        final var result = learnerResultDAO.getByTestNo(user, projectId, testNo);

        final var userIsOwner = project.getOwners().stream()
                .map(User::getId)
                .anyMatch(ownerId -> ownerId.equals(user.getId()));

        if (!userIsOwner && (result.getExecutedBy() != null && !result.getExecutedBy().equals(user))) {
            throw new UnauthorizedException("You are not allowed to abort this learning process.");
        }

        if (isActive(projectId)) {
            learnerThreads.get(projectId).abort(result.getId());
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

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param projectId
     *         The id of the project.
     * @return A snapshot of the Learner status.
     */
    public LearnerStatus getStatus(User user, Long projectId) {
        if (isActive(projectId)) {
            final var thread = learnerThreads.get(projectId);
            final var process = thread.getCurrentProcess();

            final var processStatus = new LearningProcessStatus();
            processStatus.setCurrentQueries(process.getCurrentQueries());
            processStatus.setPhase(process.getLearnerPhase());
            processStatus.setResult(process.getResult());

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
     * Determine the output of the SUL by testing a sequence of input symbols.
     *
     * @param user
     *         The user in which context the test should happen.
     * @param project
     *         The project in which context the test should happen.
     * @param resetSymbol
     *         The reset symbol to use.
     * @param symbols
     *         The symbol sequence to process in order to generate the output sequence.
     * @param driverConfig
     *         The configuration to use for the web browser.
     * @param postSymbol
     *         The symbol to execute after each membership query.
     * @return The following output sequence.
     * @throws LearnerException
     *         If something went wrong while testing the symbols.
     */
    public List<ExecuteResult> readOutputs(User user, Project project, ProjectEnvironment environment, ParameterizedSymbol resetSymbol,
                                           List<ParameterizedSymbol> symbols, ParameterizedSymbol postSymbol, WebDriverConfig driverConfig)
            throws LearnerException {
        logger.traceEntry();
        logger.info(LoggerMarkers.LEARNER, "Learner.readOutputs({}, {}, {}, {}, {})", user, project, resetSymbol, symbols, driverConfig);

        final ReadOutputConfig config = new ReadOutputConfig(
                resetSymbol,
                symbols,
                postSymbol,
                driverConfig
        );

        logger.traceExit();
        return readOutputs(user, project, environment, config);
    }

    /**
     * Determine the output of the SUL by testing a sequence of input symbols.
     *
     * @param user
     *         The current user.
     * @param project
     *         The project.
     * @param readOutputConfig
     *         The config to use.
     * @return The outputs of the SUL.
     */
    public List<ExecuteResult> readOutputs(User user, Project project, ProjectEnvironment environment, ReadOutputConfig readOutputConfig) {
        PreparedContextHandler ctxHandler = contextHandlerFactory.createPreparedContextHandler(user, project, readOutputConfig.getDriverConfig(), readOutputConfig.getPreSymbol(), readOutputConfig.getPostSymbol());
        ConnectorManager connectors = ctxHandler.create(environment).createContext();

        try {
            List<ExecuteResult> outputs = readOutputConfig.getSymbols().stream()
                    .map(s -> s.execute(connectors))
                    .collect(Collectors.toList());
            connectors.dispose();
            connectors.post();
            return outputs;
        } catch (Exception e) {
            connectors.dispose();
            connectors.post();

            throw new LearnerException("Could not read the outputs", e);
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
        final Alphabet<String> alphabetProxy1 = mealy1.createAlphabet();
        final Alphabet<String> alphabetProxy2 = mealy1.createAlphabet();
        if (alphabetProxy1.size() != alphabetProxy2.size() || !alphabetProxy1.containsAll(alphabetProxy2)) {
            throw new IllegalArgumentException("The alphabets of the hypotheses are not identical!");
        }

        final CompactMealy<String, String> mealyMachine1 = mealy1.createMealyMachine(alphabetProxy1);
        final CompactMealy<String, String> mealyMachine2 = mealy2.createMealyMachine(alphabetProxy2);

        final Word<String> separatingWord = Automata.findSeparatingWord(mealyMachine1, mealyMachine2, alphabetProxy1);

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

    /**
     * Find differences between two models.
     *
     * @param mealyProxy1
     *         The one model.
     * @param mealyProxy2
     *         The other model.
     * @return The differences found as a minimized, incomplete mealy machine
     */
    public CompactMealy<String, String> differenceTree(
            final CompactMealyMachineProxy mealyProxy1,
            final CompactMealyMachineProxy mealyProxy2) {

        final Alphabet<String> alphabet = mealyProxy1.createAlphabet();
        final Alphabet<String> alph2 = mealyProxy2.createAlphabet();
        if (alphabet.size() != alph2.size() || !alphabet.containsAll(alph2)) {
            throw new IllegalArgumentException("The alphabets of the hypotheses are not identical!");
        }

        final CompactMealy<String, String> hyp1 = mealyProxy1.createMealyMachine(alphabet);
        final CompactMealy<String, String> hyp2 = mealyProxy2.createMealyMachine(alphabet);

        // the words where the output differs
        final Set<SeparatingWord> diffs = new HashSet<>();
        findDifferences(hyp1, hyp2, alphabet, diffs);
        findDifferences(hyp2, hyp1, alphabet, diffs);

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
            final Set<SeparatingWord> diffs) {

        final WpMethodTestsIterator<String> testsIterator = new WpMethodTestsIterator<>(hyp2, alphabet, 0);
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
}
