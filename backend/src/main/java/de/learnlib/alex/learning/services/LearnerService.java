/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.LearningProcessStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.SymbolSet;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.util.automata.conformance.WpMethodTestsIterator;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private final WebhookService webhookService;
    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;
    private final TestDAO testDAO;
    private final LearnerResultRepository learnerResultRepository;

    /** The learner threads for users (userId -> thread). */
    private final Map<Long, LearnerThread> learnerThreads;

    @Autowired
    public LearnerService(LearnerSetupDAO learnerSetupDAO,
                          LearnerResultDAO learnerResultDAO,
                          WebhookService webhookService,
                          PreparedConnectorContextHandlerFactory contextHandlerFactory,
                          TestDAO testDAO,
                          LearnerResultRepository learnerResultRepository) {
        this.learnerSetupDAO = learnerSetupDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.webhookService = webhookService;
        this.contextHandlerFactory = contextHandlerFactory;
        this.testDAO = testDAO;
        this.learnerResultRepository = learnerResultRepository;

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
    public LearnerResult start(User user, Project project, LearnerStartConfiguration startConfiguration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {

        final LearnerSetup setup = startConfiguration.getSetup();
        final LearnerSetup createdSetup = setup.getId() != null ? setup : learnerSetupDAO.create(user, project.getId(), setup);

        LearnerResult result = new LearnerResult();
        result.setSetup(createdSetup);
        result.setComment(startConfiguration.getOptions().getComment());
        result = learnerResultDAO.create(user, project, result);

        final PreparedContextHandler contextHandler = contextHandlerFactory
                .createPreparedContextHandler(user, project, createdSetup.getWebDriver(), createdSetup.getPreSymbol(), createdSetup.getPostSymbol());

        final AbstractLearnerProcess learnThread = new StartingLearnerProcess(user, learnerResultDAO, webhookService,
                testDAO, contextHandler, result, createdSetup);

        enqueueLearningProcess(project.getId(), learnThread);

        return result;
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param user
     *         The user that wants to restart his latest thread.
     * @param project
     *         The project that is learned.
     * @param result
     *         The result of a previous process.
     * @param configuration
     *         The configuration to use for the next learning steps.
     * @throws IllegalArgumentException
     *         If the new configuration has errors.
     * @throws IllegalStateException
     *         If a learning process is already active or if now process to resume was found.
     * @throws NotFoundException
     *         If the symbols specified in the configuration could not be found.
     */
    public void resume(User user, Project project, LearnerResult result, LearnerResumeConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        if (result.getSteps().get(configuration.getStepNo() - 1).isError()) {
            throw new IllegalStateException("You cannot resume from a failed step.");
        }

        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            validateCounterexample(user, result, configuration);
        }

        final LearnerSetup setup = result.getSetup();
        final PreparedContextHandler contextHandler = contextHandlerFactory.createPreparedContextHandler(
                user, project, setup.getWebDriver(), setup.getPreSymbol(), setup.getPostSymbol());

        final AbstractLearnerProcess learnThread = new ResumingLearnerProcess(user, learnerResultDAO, learnerSetupDAO,
                webhookService, testDAO, contextHandler, result, setup, configuration);

        enqueueLearningProcess(project.getId(), learnThread);
    }

    /**
     * Starts the thread and updates the thread maps.
     *
     * @param projectId
     *         The id of the project.
     * @param learnerProcess
     *         The thread to start.
     */
    private void enqueueLearningProcess(Long projectId, AbstractLearnerProcess learnerProcess) {
        if (learnerThreads.containsKey(projectId)) {
            learnerThreads.get(projectId).enqueue(learnerProcess);
        } else {
            final LearnerThread thread = new LearnerThread(
                    learnerResultRepository,
                    () -> learnerThreads.remove(projectId)
            );
            thread.enqueue(learnerProcess);
            learnerThreads.put(projectId, thread);
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

            // finally check if the given sample matches the behavior of the SUL
            List<String> results = readOutputs(user,
                    result.getProject(),
                    result.getSetup().getPreSymbol(),
                    symbolsFromCounterexample,
                    result.getSetup().getPostSymbol(),
                    result.getSetup().getWebDriver())
                    .stream()
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
    public void stop(Long projectId, Long testNo) {
        if (isActive(projectId)) {
            learnerThreads.get(projectId).abort(testNo);
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
    public LearnerStatus getStatus(Long projectId) {
        if (isActive(projectId)) {
            final LearnerThread thread = learnerThreads.get(projectId);
            final AbstractLearnerProcess process = thread.getCurrentProcess();

            final LearningProcessStatus processStatus = new LearningProcessStatus();
            processStatus.setCurrentQueries(process.getCurrentQueries());
            processStatus.setPhase(process.getLearnerPhase());
            processStatus.setResult(process.getResult());

            final LearnerStatus status = new LearnerStatus();
            status.setCurrentProcess(processStatus);
            status.setQueue(thread.getProcessQueue());
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
    public List<ExecuteResult> readOutputs(User user, Project project, ParameterizedSymbol resetSymbol,
                                           List<ParameterizedSymbol> symbols, ParameterizedSymbol postSymbol, AbstractWebDriverConfig driverConfig)
            throws LearnerException {
        logger.traceEntry();
        logger.info(LoggerMarkers.LEARNER, "Learner.readOutputs({}, {}, {}, {}, {})", user, project, resetSymbol, symbols, driverConfig);

        SymbolSet symbolSet = new SymbolSet(resetSymbol, symbols, postSymbol);
        ReadOutputConfig config = new ReadOutputConfig(symbolSet, driverConfig);

        logger.traceExit();
        return readOutputs(user, project, config);
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
    public List<ExecuteResult> readOutputs(User user, Project project, ReadOutputConfig readOutputConfig) {
        PreparedContextHandler ctxHandler = contextHandlerFactory.createPreparedContextHandler(user, project, readOutputConfig.getDriverConfig(), readOutputConfig.getSymbols().getResetSymbol(), readOutputConfig.getSymbols().getPostSymbol());
        ConnectorManager connectors = ctxHandler.create(project.getDefaultEnvironment()).createContext();

        try {
            List<ExecuteResult> outputs = readOutputConfig.getSymbols().getSymbols().stream()
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
