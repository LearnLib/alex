/*
 * Copyright 2016 TU Dortmund
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
import de.learnlib.alex.config.entities.BrowserConfig;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Basic class to control and monitor a learn process.
 * This class is a high level abstraction of the LearnLib.
 */
@Service
@Scope("singleton")
public class Learner {

    /** How many concurrent threads the system can handle. */
    private static final int MAX_CONCURRENT_THREADS = 2;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

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

    /** Factory to create a new ContextHandler. */
    @Inject
    private ConnectorContextHandlerFactory contextHandlerFactory;

    /** The last thread of an user, if one exists. */
    private final Map<User, AbstractLearnerThread> userThreads;

    /** The executor service will take care of creating and scheduling the actual OS threads. */
    private ExecutorService executorService;

    /**
     * This constructor creates a new Learner
     * The SymbolDAO and LearnerResultDAO must be externally injected.
     */
    public Learner() {
        this.userThreads = new HashMap<>();
        this.executorService = Executors.newFixedThreadPool(MAX_CONCURRENT_THREADS);
    }

    /**
     * Constructor that sets all fields by the given parameter.
     *
     * @param symbolDAO             The SymbolDAO to use.
     * @param learnerResultDAO      The LearnerResultDAO to use.
     * @param contextHandlerFactory The factory that will be used to create new context handler.
     */
    public Learner(SymbolDAO symbolDAO, LearnerResultDAO learnerResultDAO,
                   ConnectorContextHandlerFactory contextHandlerFactory) {
        this();
        this.symbolDAO = symbolDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.contextHandlerFactory = contextHandlerFactory;
    }

    /**
     * Method should be called before the Learner is 'destroyed'.
     * It will shutdown the executor service gracefully.
     */
    @PreDestroy
    public void destroy() {
        executorService.shutdown();
    }

    /**
     * Start a learning process by activating a LearningThread.
     *
     * @param user          The user that wants to start the learning process.
     * @param project       The project the learning process runs in.
     * @param configuration The configuration to use for the learning process.
     *
     * @throws IllegalArgumentException If the configuration was invalid or the user tried to start a second active
     *                                  learning thread.
     * @throws IllegalStateException    If a learning process is already active.
     * @throws NotFoundException        If the symbols specified in the configuration could not be found.
     */
    public void start(User user, Project project, LearnerStartConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        if (isActive(user)) {
            throw new IllegalStateException("You can not start more than one experiment at the same time.");
        }

        final LearnerResult result = createLearnerResult(user, project, configuration);

        final ConnectorContextHandler contextHandler = contextHandlerFactory.createContext(user, project,
                configuration.getBrowser());
        contextHandler.setResetSymbol(result.getResetSymbol());

        final AbstractLearnerThread learnThread = new StartingLearnerThread(learnerResultDAO, contextHandler, result, configuration);
        startThread(user, learnThread);
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param user          The user that wants to restart his latest thread.
     * @param project       The project that is learned.
     * @param result        The result of a previous process.
     * @param configuration The configuration to use for the next learning steps.
     *
     * @throws IllegalArgumentException If the new configuration has errors.
     * @throws IllegalStateException    If a learning process is already active or if now process to resume was found.
     * @throws NotFoundException        If the symbols specified in the configuration could not be found.
     */
    public void resume(User user, Project project, LearnerResult result, LearnerResumeConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        if (isActive(user)) {
            throw new IllegalStateException("You have to wait until the running experiment is finished.");
        }

        configuration.checkConfiguration();
        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            validateCounterexample(user, configuration);
        }

        final Symbol resetSymbol = symbolDAO.get(user, project.getId(), result.getResetSymbolAsId());
        result.setResetSymbol(resetSymbol);

        List<Symbol> symbols = symbolDAO.getByIds(user, project.getId(),
                new LinkedList<>(result.getSymbolsAsIds()));
        result.setSymbols(symbols);

        final ConnectorContextHandler contextHandler = contextHandlerFactory.createContext(user, project, result.getBrowser());
        contextHandler.setResetSymbol(result.getResetSymbol());

        final AbstractLearnerThread learnThread = new ResumingLearnerThread(learnerResultDAO, contextHandler, result, configuration);
        startThread(user, learnThread);
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
        learnerResult.setUser(user);
        learnerResult.setProject(project);

        try {
            final Symbol reset = symbolDAO.get(user, project.getId(), configuration.getResetSymbolAsId());
            learnerResult.setResetSymbol(reset);
        } catch (NotFoundException e) {
            throw new NotFoundException("Could not find the reset symbol", e);
        }

        final List<Symbol> alphabet = symbolDAO.getByIds(user, project.getId(), configuration.getSymbolsAsIds());
        learnerResult.setSymbols(alphabet);
        learnerResult.setBrowser(configuration.getBrowser());
        learnerResult.setAlgorithm(configuration.getAlgorithm());
        learnerResult.setComment(configuration.getComment());
        learnerResult.setUseMQCache(configuration.isUseMQCache());

        return learnerResult;
    }

    /**
     * Starts the thread and updates the thread maps.
     *
     * @param user        The user that starts the thread.
     * @param learnThread The thread to start.
     */
    private void startThread(User user, AbstractLearnerThread learnThread) {
        executorService.submit(learnThread);
        userThreads.put(user, learnThread);
    }

    /**
     * If the new configuration is base on manual counterexamples, these samples must be checked.
     *
     * @param user          The user to validate the counterexample for.
     * @param configuration The new configuration.
     *
     * @throws IllegalArgumentException If the new configuration is based on manual counterexamples and at least one of
     *                                  them is wrong.
     */
    private void validateCounterexample(User user, LearnerResumeConfiguration configuration)
            throws IllegalArgumentException {

        SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
        LearnerResult lastResult = getResult(user);

        for (List<SampleEQOracleProxy.InputOutputPair> counterexample : oracle.getCounterExamples()) {
            List<Symbol> symbolsFromCounterexample = new ArrayList<>();
            List<String> outputs = new ArrayList<>();

            // search symbols in configuration where symbol.name == counterexample.input
            for (SampleEQOracleProxy.InputOutputPair io : counterexample) {
                Optional<Symbol> symbol = lastResult.getSymbols().stream()
                        .filter(s -> s.getName().equals(io.getInput()))
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
            List<String> results = readOutputs(lastResult.getUser(),
                    lastResult.getProject(),
                    lastResult.getResetSymbol(),
                    symbolsFromCounterexample,
                    lastResult.getBrowser());

            if (!results.equals(outputs)) {
                throw new IllegalArgumentException("At least one of the given samples for counterexamples"
                        + " is not matching the behavior of the SUL.");
            }
        }
    }

    /**
     * Ends the learning process after the current step.
     *
     * @param user The user that wants to stop his active thread.
     */
    public void stop(User user) {
        final AbstractLearnerThread learnerThread = userThreads.get(user);
        if (learnerThread != null) {
            learnerThread.stopLearning();
        }
    }

    /**
     * Method to check if a learning process is still active or if it has finished.
     *
     * @param user The user to check for active threads.
     *
     * @return true if the learning process is active, false otherwise.
     */
    public boolean isActive(User user) {
        AbstractLearnerThread learnerThread = userThreads.get(user);
        return learnerThread != null && !learnerThread.isFinished();
    }

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param user The user that wants a LearnerStatus object for his (active) thread.
     *
     * @return A snapshot of the Learner status.
     */
    public LearnerStatus getStatus(User user) {
        LearnerStatus status;

        boolean active = isActive(user);
        if (!active) {
            status = new LearnerStatus(); // not active
        } else {
            AbstractLearnerThread thread = userThreads.get(user);
            LearnerPhase phase = thread != null ? thread.getLearnerPhase() : null;
            List<DefaultQueryProxy> queries = thread != null ? thread.getCurrentQueries() : null;

            status = new LearnerStatus(getResult(user), phase, queries); // active
        }

        return status;
    }

    /**
     * Get the current result of the learning process.
     * This must not be a valid step of a test run!
     *
     * @param user The user that wants to see his result.
     *
     * @return The current result of the AbstractLearnerThread.
     */
    public LearnerResult getResult(User user) {
        final AbstractLearnerThread learnerThread = userThreads.get(user);
        return learnerThread != null ? learnerThread.getResult() : null;
    }

    /**
     * Determine the output of the SUL by testing a sequence of input symbols.
     *
     * @param user          The user in which context the test should happen.
     * @param project       The project in which context the test should happen.
     * @param resetSymbol   The reset symbol to use.
     * @param symbols       The symbol sequence to process in order to generate the output sequence.
     * @param browserConfig The configuration to use for the web browser.
     *
     * @return The following output sequence.
     *
     * @throws LearnerException If something went wrong while testing the symbols.
     */
    public List<String> readOutputs(User user, Project project, Symbol resetSymbol, List<Symbol> symbols,
                                    BrowserConfig browserConfig)
            throws LearnerException {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        ThreadContext.put("testNo", "readOutputs");
        ThreadContext.put("indent", "");
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Learner.readOutputs({}, {}, {}, {})", user, project, resetSymbol, symbols);

        ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(
                user, project, browserConfig);
        ctxHandler.setResetSymbol(resetSymbol);
        ConnectorManager connectors = ctxHandler.createContext();

        return readOutputs(symbols, connectors);
    }

    /**
     * Determine the output of the SUL by testing a sequence of input symbols.
     *
     * @param user             The user in which context the test should happen.
     * @param project          The project in which context the test should happen.
     * @param resetSymbol      The reset symbol to use.
     * @param symbols          The symbol sequence to process in order to generate the output sequence.
     * @param readOutputConfig The config for reading the outputs.
     *
     * @return The following output sequence.
     *
     * @throws LearnerException If something went wrong while testing the symbols.
     */
    public List<String> readOutputs(User user, Project project, Symbol resetSymbol, List<Symbol> symbols,
                                    ReadOutputConfig readOutputConfig)
            throws LearnerException {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        ThreadContext.put("testNo", "readOutputs");
        ThreadContext.put("indent", "");
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Learner.readOutputs({}, {}, {}, {})", user, project, resetSymbol, symbols);

        ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(
                user, project, readOutputConfig.getBrowser());
        ctxHandler.setResetSymbol(resetSymbol);
        ConnectorManager connectors = ctxHandler.createContext();

        return readOutputs(symbols, connectors);
    }

    private List<String> readOutputs(List<Symbol> symbols, ConnectorManager connectors) {
        LOGGER.traceEntry();
        try {
            List<String> output = symbols.stream()
                    .map(s -> s.execute(connectors).toString())
                    .collect(Collectors.toList());
            connectors.dispose();

            LOGGER.traceExit(output);
            return output;
        } catch (Exception e) {
            connectors.dispose();

            LOGGER.traceExit(e);
            throw new LearnerException("Could not read the outputs", e);
        }
    }

    /**
     * Compare two MealyMachines and calculate their separating word.
     *
     * @param mealy1 The first Mealy to compare.
     * @param mealy2 The second Mealy to compare.
     *
     * @return If the machines are different: The corresponding separating word; otherwise: ""
     */
    public String compare(CompactMealyMachineProxy mealy1, CompactMealyMachineProxy mealy2) {
        Alphabet<String> alphabetProxy1 = mealy1.createAlphabet();
        Alphabet<String> alphabetProxy2 = mealy1.createAlphabet();

        CompactMealy<String, String> mealyMachine1 = mealy1.createMealyMachine(alphabetProxy1);
        CompactMealy<String, String> mealyMachine2 = mealy2.createMealyMachine(alphabetProxy2);

        Word separatingWord = Automata.findSeparatingWord(mealyMachine1, mealyMachine2, alphabetProxy1);

        if (separatingWord != null) {
            return separatingWord.toString();
        } else {
            return "";
        }
    }
}
