/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.SymbolSet;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Basic class to control and monitor a learn process. This class is a high level abstraction of the LearnLib.
 */
@Service
@Scope("singleton")
public class Learner {

    /** How many concurrent threads the system can handle. */
    private static final int MAX_CONCURRENT_THREADS = 2;

    private static final Logger LOGGER = LogManager.getLogger();

    /** Indicator for in which phase the learner currently is. */
    public enum LearnerPhase {

        /** If the learner is active. */
        LEARNING,

        /** If the equivalence oracle is active. */
        EQUIVALENCE_TESTING
    }

    /** The SymbolDAO to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /** The LearnerResultDAO to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

    /** The {@link WebhookService} to use. */
    @Inject
    private WebhookService webhookService;

    /** Factory to create a new ContextHandler. */
    @Inject
    private PreparedConnectorContextHandlerFactory contextHandlerFactory;

    /** The injected test DAO. */
    @Inject
    private TestDAO testDAO;

    @Inject
    private ProjectEnvironmentRepository environmentRepository;

    @Inject
    private ProjectEnvironmentDAO projectEnvironmentDAO;

    /** The last thread of an user, if one exists. */
    private final Map<Long, AbstractLearnerThread> userThreads;

    /** The executor service will take care of creating and scheduling the actual OS threads. */
    private ExecutorService executorService;

    /**
     * This constructor creates a new Learner The SymbolDAO and LearnerResultDAO must be externally injected.
     */
    public Learner() {
        this.userThreads = new HashMap<>();
        this.executorService = Executors.newFixedThreadPool(MAX_CONCURRENT_THREADS);
    }

    /**
     * Constructor that sets all fields by the given parameter.
     *
     * @param symbolDAO
     *         The SymbolDAO to use.
     * @param learnerResultDAO
     *         The LearnerResultDAO to use.
     * @param contextHandlerFactory
     *         The factory that will be used to create new context handler.
     */
    public Learner(SymbolDAO symbolDAO, LearnerResultDAO learnerResultDAO,
                   PreparedConnectorContextHandlerFactory contextHandlerFactory) {
        this();
        this.symbolDAO = symbolDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.contextHandlerFactory = contextHandlerFactory;
    }

    /**
     * Method should be called before the Learner is 'destroyed'. It will shutdown the executor service gracefully.
     */
    @PreDestroy
    public void destroy() {
        executorService.shutdown();
    }

    /**
     * Start a learning process by activating a LearningThread.
     *
     * @param user
     *         The user that wants to start the learning process.
     * @param project
     *         The project the learning process runs in.
     * @param configuration
     *         The configuration to use for the learning process.
     * @throws IllegalArgumentException
     *         If the configuration was invalid or the user tried to start a second active learning thread.
     * @throws IllegalStateException
     *         If a learning process is already active.
     * @throws NotFoundException
     *         If the symbols specified in the configuration could not be found.
     */
    public void start(User user, Project project, LearnerStartConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        if (isActive(project.getId())) {
            throw new IllegalStateException("You can not start more than one experiment at the same time.");
        }

        configuration.setEnvironments(projectEnvironmentDAO.getByIds(user, project.getId(), configuration.getEnvironmentIds()));
        configuration.getEnvironments().forEach(ProjectEnvironmentDAO::loadLazyRelations);

        final LearnerResult result = createLearnerResult(user, project, configuration);

        final PreparedContextHandler contextHandler = contextHandlerFactory
                .createPreparedContextHandler(user, project, configuration.getDriverConfig(), result.getResetSymbol(), result.getPostSymbol());

        final AbstractLearnerThread learnThread = new StartingLearnerThread(user, learnerResultDAO, webhookService,
                testDAO, contextHandler, result, configuration);

        startThread(project.getId(), learnThread);
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
        if (isActive(project.getId())) {
            throw new IllegalStateException("You have to wait until the running experiment is finished.");
        }

        if (result.getSteps().get(configuration.getStepNo() - 1).isError()) {
            throw new IllegalStateException("You cannot resume from a failed step.");
        }

        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            validateCounterexample(user, configuration);
        }

        final Symbol resetSymbol = symbolDAO.get(user, project.getId(), result.getResetSymbol().getSymbol().getId());
        result.getResetSymbol().setSymbol(resetSymbol);

        final List<Long> symbolIds =
                result.getSymbols().stream().map(s -> s.getSymbol().getId()).collect(Collectors.toList());
        final List<Symbol> symbols = symbolDAO.getByIds(user, project.getId(), symbolIds);

        final Map<Long, Symbol> symbolMap = new HashMap<>();
        symbols.forEach(s -> symbolMap.put(s.getId(), s));
        result.getSymbols().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));

        final List<ProjectEnvironment> envs = environmentRepository.findAllById(configuration.getEnvironmentIds());
        result.setEnvironments(envs);
        configuration.setEnvironments(envs);

        if (result.getPostSymbol() != null) {
            final Symbol postSymbol = symbolDAO.get(user, project.getId(), result.getPostSymbol().getSymbol().getId());
            result.getPostSymbol().setSymbol(postSymbol);
        }

        final PreparedContextHandler contextHandler = contextHandlerFactory.createPreparedContextHandler(user, project,
                result.getDriverConfig(), result.getResetSymbol(), result.getPostSymbol());

        final AbstractLearnerThread learnThread = new ResumingLearnerThread(user, learnerResultDAO, webhookService,
                testDAO, contextHandler, result, configuration);
        startThread(project.getId(), learnThread);
    }

    private LearnerResult createLearnerResult(User user, Project project, LearnerStartConfiguration configuration)
            throws NotFoundException, IllegalArgumentException {

        // It is not allowed to start a learning process with predefined counterexamples.
        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
            if (!oracle.getCounterExamples().isEmpty()) {
                throw new IllegalArgumentException("You cannot start with predefined counterexamples");
            }
        } else {
            configuration.checkConfiguration();
        }

        final LearnerResult learnerResult = new LearnerResult();
        learnerResult.setProject(project);

        try {
            final ParameterizedSymbol pResetSymbol = configuration.getResetSymbol();
            final Symbol resetSymbol = symbolDAO.get(user, project.getId(), pResetSymbol.getSymbol().getId());
            pResetSymbol.setSymbol(resetSymbol);
            learnerResult.setResetSymbol(pResetSymbol);

            if (configuration.getPostSymbol() != null) {
                final ParameterizedSymbol pPostSymbol = configuration.getPostSymbol();
                final Symbol postSymbol = symbolDAO.get(user, project.getId(), pPostSymbol.getSymbol().getId());
                pPostSymbol.setSymbol(postSymbol);
                learnerResult.setPostSymbol(pPostSymbol);
            }
        } catch (NotFoundException e) {
            throw new NotFoundException("Could not find the reset symbol", e);
        }

        final List<Long> symbolIds = configuration.getSymbols().stream()
                .map(s -> s.getSymbol().getId())
                .collect(Collectors.toList());
        final List<Symbol> alphabet = symbolDAO.getByIds(user, project.getId(), symbolIds);

        final Map<Long, Symbol> symbolMap = new HashMap<>();
        alphabet.forEach(s -> symbolMap.put(s.getId(), s));

        configuration.getSymbols().forEach(s -> s.setSymbol(symbolMap.get(s.getSymbol().getId())));

        learnerResult.setSymbols(configuration.getSymbols());
        learnerResult.setDriverConfig(configuration.getDriverConfig());
        learnerResult.setAlgorithm(configuration.getAlgorithm());
        learnerResult.setComment(configuration.getComment());
        learnerResult.setUseMQCache(configuration.isUseMQCache());

        final List<ProjectEnvironment> environments = projectEnvironmentDAO.getByIds(user, project.getId(), configuration.getEnvironmentIds());
        learnerResult.setEnvironments(environments);

        return learnerResult;
    }

    /**
     * Starts the thread and updates the thread maps.
     *
     * @param projectId
     *         The id of the project.
     * @param learnThread
     *         The thread to start.
     */
    private void startThread(Long projectId, AbstractLearnerThread learnThread) {
        executorService.submit(learnThread);
        userThreads.put(projectId, learnThread);
    }

    /**
     * If the new configuration is base on manual counterexamples, these samples must be checked.
     *
     * @param user
     *         The user to validate the counterexample for.
     * @param configuration
     *         The new configuration.
     * @throws IllegalArgumentException
     *         If the new configuration is based on manual counterexamples and at least one of them is wrong.
     */
    private void validateCounterexample(User user, LearnerResumeConfiguration configuration)
            throws IllegalArgumentException {

        final SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
        final LearnerResult lastResult;

        try {
            lastResult = learnerResultDAO.get(user, configuration.getProjectId(), configuration.getTestNo(), false);
        } catch (NotFoundException e) {
            throw new IllegalArgumentException(e);
        }

        for (List<SampleEQOracleProxy.InputOutputPair> counterexample : oracle.getCounterExamples()) {
            List<ParameterizedSymbol> symbolsFromCounterexample = new ArrayList<>();
            List<String> outputs = new ArrayList<>();

            // search symbols in configuration where symbol.name == counterexample.input
            for (SampleEQOracleProxy.InputOutputPair io : counterexample) {
                Optional<ParameterizedSymbol> symbol = lastResult.getSymbols().stream()
                        .filter(s -> s.getComputedName().equals(io.getInput()))
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
                    lastResult.getProject(),
                    lastResult.getResetSymbol(),
                    symbolsFromCounterexample,
                    lastResult.getPostSymbol(),
                    lastResult.getDriverConfig())
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
    public void stop(Long projectId) {
        final AbstractLearnerThread learnerThread = userThreads.get(projectId);

        if (learnerThread != null) {
            learnerThread.stopLearning();
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
        AbstractLearnerThread learnerThread = userThreads.get(projectId);
        return learnerThread != null && !learnerThread.isFinished();
    }

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param projectId
     *         The id of the project.
     * @return A snapshot of the Learner status.
     */
    public LearnerStatus getStatus(Long projectId) {
        boolean active = isActive(projectId);
        if (!active) {
            return new LearnerStatus();
        } else {
            AbstractLearnerThread thread = userThreads.get(projectId);
            LearnerPhase phase = thread != null ? thread.getLearnerPhase() : null;
            List<DefaultQueryProxy> queries = thread != null ? thread.getCurrentQueries() : null;
            return new LearnerStatus(getResult(projectId), phase, queries);
        }
    }

    /**
     * Get the current result of the learning process. This must not be a valid step of a test run!
     *
     * @param projectId
     *         The id of the project.
     * @return The current result of the AbstractLearnerThread.
     */
    public LearnerResult getResult(Long projectId) {
        final AbstractLearnerThread learnerThread = userThreads.get(projectId);
        return learnerThread != null ? learnerThread.getResult() : null;
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
        LOGGER.traceEntry();
        LOGGER.info(LoggerMarkers.LEARNER, "Learner.readOutputs({}, {}, {}, {}, {})", user, project, resetSymbol, symbols, driverConfig);

        SymbolSet symbolSet = new SymbolSet(resetSymbol, symbols, postSymbol);
        ReadOutputConfig config = new ReadOutputConfig(symbolSet, driverConfig);

        LOGGER.traceExit();
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
            throw new IllegalArgumentException("The alphabets of the hypotheses are not "
                    + "identical!");
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
            throw new IllegalArgumentException("The alphabets of the hypotheses are not "
                    + "identical!");
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
                        out += " vs. " + diff.getOutput1().getSymbol(k);
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

        final List<Word<String>> transCover = Automata.transitionCover(hyp2, alphabet);
        final List<Word<String>> charSet = Automata.characterizingSet(hyp2, alphabet);

        // use the same coverage as for the w method
        for (final Word<String> prefix : transCover) {
            for (final Word<String> suffix : charSet) {
                final Word<String> word = prefix.concat(suffix);

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
}
