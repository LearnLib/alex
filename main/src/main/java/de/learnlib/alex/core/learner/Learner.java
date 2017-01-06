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

package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ReadOutputConfig;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.services.LearnAlgorithmService;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
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
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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

    /** The SymbolDAO to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /** The LearnerResultDAO to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

    /** The {@link LearnAlgorithmService} to use. */
    @Inject
    private LearnAlgorithmService algorithmService;

    /**
     * Factory to create a new ContextHandler.
     */
    @Inject
    private ConnectorContextHandlerFactory contextHandlerFactory;

    /**
     * The current ContextHandler.
     */
    private ConnectorContextHandler contextHandler;

    /** The factory to create the learner threads. */
    @Inject
    private LearnerThreadFactory learnerThreadFactory;

    /**
     * The last thread of an user, if one exists.
     */
    private final Map<User, LearnerThread> userThreads;

    /** The executer service will take care of creating and scheduling the actual OS threads. */
    private ExecutorService executorService;

    /**
     * This constructor creates a new Learner
     * The SymbolDAO and LearnerResultDAO must be externally injected.
     */
    public Learner() {
        this.userThreads      = new HashMap<>();
        this.executorService = Executors.newFixedThreadPool(MAX_CONCURRENT_THREADS);
    }

    /**
     * Constructor that sets all fields by the given parameter.
     *
     * @param symbolDAO
     *         The SymbolDAO to use.
     * @param learnerResultDAO
     *         The LearnerResultDAO to use.
     * @param algorithmService
     *         The AlgorithmService to use.
     * @param contextHandlerFactory
     *         The factory that will be used to create new context handler.
     * @param learnerThreadFactory
     *         The factory to create the learner threads.
     */
    Learner(SymbolDAO symbolDAO, LearnerResultDAO learnerResultDAO, LearnAlgorithmService algorithmService,
            ConnectorContextHandlerFactory contextHandlerFactory, LearnerThreadFactory learnerThreadFactory) {
        this();
        this.symbolDAO             = symbolDAO;
        this.learnerResultDAO      = learnerResultDAO;
        this.algorithmService      = algorithmService;
        this.contextHandlerFactory = contextHandlerFactory;
        this.learnerThreadFactory  = learnerThreadFactory;
    }

    /**
     * Used only for testing.
     *
     * @param contextHandler
     *         The new context handler to use.
     */
    void setContextHandler(ConnectorContextHandler contextHandler) {
        this.contextHandler = contextHandler;
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
    public void start(User user, Project project, LearnerConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        preStartCheck(user);

        LearnerResult learnerResult = createLearnerResult(user, project, configuration);

        contextHandler = contextHandlerFactory.createContext(project, configuration.getBrowser());
        contextHandler.setResetSymbol(learnerResult.getResetSymbol());
        LearnerThread learnThread = learnerThreadFactory.createThread(learnerResult, contextHandler);
        startThread(user, learnThread);
    }

    private LearnerResult createLearnerResult(User user, Project project, LearnerConfiguration configuration)
            throws NotFoundException {
        // learner started and not resumed
        if (configuration.getEqOracle() instanceof SampleEQOracleProxy) {
            SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
            if (!oracle.getCounterExamples().isEmpty()) {
                throw new IllegalArgumentException("You cannot start with predefined counterexamples");
            }
        } else {
            configuration.checkConfiguration(); // throws IllegalArgumentException if something is wrong
        }

        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setUser(user);
        learnerResult.setProject(project);

        try {
            Symbol resetSymbol = symbolDAO.get(user, project.getId(), configuration.getResetSymbolAsId());
            learnerResult.setResetSymbol(resetSymbol);
        } catch (NotFoundException e) { // Extra exception to emphasize that this is the reset symbol.
            throw new NotFoundException("Could not find the reset symbol!", e);
        }

        List<Symbol> symbolsAsList = symbolDAO.getByIds(user, project.getId(),
                                                        new LinkedList<>(configuration.getSymbolsAsIds()));
        Set<Symbol> symbols = new HashSet<>(symbolsAsList);
        learnerResult.setSymbols(symbols);

        learnerResult.setBrowser(configuration.getBrowser());
        learnerResult.setAlgorithm(configuration.getAlgorithm());
        learnerResult.setAlgorithmFactory(algorithmService.getLearnAlgorithm(configuration.getAlgorithm()));
        learnerResult.setComment(configuration.getComment());
        learnerResult.setUseMQCache(configuration.isUseMQCache());
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.createStep(learnerResult, configuration);

        return learnerResult;
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param user
     *         The user that wants to restart his latest thread.
     * @param newConfiguration
     *         The configuration to use for the next learning steps.
     * @throws IllegalArgumentException
     *         If the new configuration has errors.
     * @throws IllegalStateException
     *         If a learning process is already active or if now process to resume was found.
     * @throws NotFoundException
     *         If the symbols specified in the configuration could not be found.
     */
    public void resume(User user, LearnerResumeConfiguration newConfiguration)
            throws IllegalArgumentException, IllegalStateException, NotFoundException {
        preStartCheck(user);

        newConfiguration.checkConfiguration(); // throws IllegalArgumentException if something is wrong
        validateCounterExample(user, newConfiguration);

        // get the previousThread and the LearnResult
        LearnerThread previousThread = userThreads.get(user);
        if (previousThread == null) {
            throw new IllegalStateException("No previous learn process to resume was found!");
        }

        LearnerResult learnerResult = previousThread.getResult();

        // create the new step
        learnerResultDAO.createStep(learnerResult, newConfiguration);

        LearnerThread learnThread = learnerThreadFactory.createThread(previousThread, learnerResult);
        startThread(user, learnThread);
    }

    /**
     * Check if a thread for the user can possibly started.
     * This means that the user has no other active learning thread
     * and the overall learning thread capacity is not reached.
     *
     * @param user
     *         The user to check for.
     * @throws IllegalStateException
     *         If a new thread could not start.
     */
    private void preStartCheck(User user) {
        if (isActive(user)) {
            throw new IllegalStateException("Only one active learning is allowed per user, "
                                            + "even for user" + user + "!");
        }
    }

    /**
     * Starts the thread and updates the thread maps.
     *
     * @param user
     *         The user that starts the thread.
     * @param learnThread
     *         The thread to start.
     */
    private void startThread(User user, LearnerThread learnThread) {
        executorService.submit(learnThread);
        userThreads.put(user, learnThread);
    }

    /**
     * If the new configuration is base on manual counterexamples, these samples must be checked.
     *
     * @param user
     *         The user to validate the counterexample for.
     * @param newConfiguration
     *         The new configuration.
     * @throws IllegalArgumentException
     *         If the new configuration is based on manual counterexamples and at least one of them is wrong.
     */
    private void validateCounterExample(User user, LearnerResumeConfiguration newConfiguration)
            throws IllegalArgumentException {
        if (newConfiguration.getEqOracle() instanceof SampleEQOracleProxy) {
            SampleEQOracleProxy oracle = (SampleEQOracleProxy) newConfiguration.getEqOracle();
            LearnerResult lastResult = getResult(user);

            for (List<SampleEQOracleProxy.InputOutputPair> counterexample : oracle.getCounterExamples()) {
                List<Symbol> symbolsFromCounterexample = new ArrayList<>();
                List<String> outputs = new ArrayList<>();

                // search symbols in configuration where symbol.abbreviation == counterexample.input
                for (SampleEQOracleProxy.InputOutputPair io : counterexample) {

                    Optional<Symbol> symbol = lastResult.getSymbols().stream()
                                                        .filter(s -> s.getAbbreviation().equals(io.getInput()))
                                                        .findFirst();

                    // collect all outputs in order to compare it with the result of learner.readOutputs()
                    if (symbol.isPresent()) {
                        symbolsFromCounterexample.add(symbol.get());
                        outputs.add(io.getOutput());
                    } else {
                        throw new IllegalArgumentException("The symbol with the abbreviation '" + io.getInput() + "'"
                                + " is not used in this test setup.");
                    }
                }

                // finally check if the given sample matches the behavior of the SUL
                List<String> results = readOutputs(lastResult.getUser(),
                                                   lastResult.getProject(),
                                                   lastResult.getResetSymbol(),
                                                   symbolsFromCounterexample);
                if (!results.equals(outputs)) {
                    throw new IllegalArgumentException("At least one of the given samples for counterexamples"
                            + " is not matching the behavior of the SUL.");
                }
            }
        }
    }

    /**
     * Ends the learning process after the current step.
     *
     * @param user
     *         The user that wants to stop his active thread.
     */
    public void stop(User user) {
        LearnerThread learnerThread = userThreads.get(user);

        if (learnerThread != null) {
            learnerThread.interrupt();
        }
    }

    /**
     * Method to check if a learning process is still active or if it has finished.
     *
     * @param user
     *         The user to check for active threads.
     * @return true if the learning process is active, false otherwise.
     */
    public boolean isActive(User user) {
        LearnerThread learnerThread = userThreads.get(user);

        // if no thread for the user exists -> return false
        if (learnerThread == null) {
            return false;
        }

        return !learnerThread.isFinished();
    }

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param user
     *         The user that wants a LearnerStatus object for his (active) thread.
     * @return A snapshot of the Learner status.
     */
    public LearnerStatus getStatus(User user) {
        LearnerStatus status;

        boolean active = isActive(user);
        if (!active) {
            status = new LearnerStatus(); // not active
        } else {
            status = new LearnerStatus(getResult(user)); // active
        }

        return status;
    }

    /**
     * Get the current result of the learning process.
     * This must not be a valid step of a test run!
     *
     * @param user
     *         The user that wants to see his result.
     * @return The current result of the LearnerThread.
     */
    public LearnerResult getResult(User user) {
        LearnerThread learnerThread = userThreads.get(user);

        if (learnerThread != null) {
            return learnerThread.getResult();
        } else {
            return null;
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
     *         The symbol sequence to execute in order to generate the output sequence.
     * @return The following output sequence.
     * @throws LearnerException
     *         If something went wrong while testing the symbols.
     */
    public List<String> readOutputs(User user, Project project, Symbol resetSymbol, List<Symbol> symbols)
            throws LearnerException {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        ThreadContext.put("testNo", "readOutputs");
        ThreadContext.put("indent", "");
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Learner.readOutputs({}, {}, {}, {})", user, project, resetSymbol, symbols);

        contextHandler.setResetSymbol(resetSymbol);
        ConnectorManager connectors = contextHandler.createContext();

        return readOutputs(symbols, connectors);
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
     *         The symbol sequence to execute in order to generate the output sequence.
     * @param readOutputConfig
     *         The config for reading the outputs.
     * @return The following output sequence.
     * @throws LearnerException
     *         If something went wrong while testing the symbols.
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
                project, readOutputConfig.getBrowser());
        ctxHandler.setResetSymbol(resetSymbol);
        ConnectorManager connectors = ctxHandler.createContext();

        return readOutputs(symbols, connectors);
    }

    private List<String> readOutputs(List<Symbol> symbols, ConnectorManager connectors) {
        LOGGER.traceEntry();
        try {
            List<String> output = symbols.stream().map(s ->
                    s.execute(connectors).toString()).collect(Collectors.toList());
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
     * @param mealy1
     *         The first Mealy to compare.
     * @param mealy2
     *         The second Mealy to compare.
     * @return If the machines are different: The corresponding separating word; otherwise: ""
     */
    public String compare(CompactMealyMachineProxy mealy1, CompactMealyMachineProxy mealy2) {
        Alphabet alphabetProxy1 = mealy1.createAlphabet();
        Alphabet alphabetProxy2 = mealy1.createAlphabet();

        CompactMealy mealyMachine1 = mealy1.createMealyMachine(alphabetProxy1);
        CompactMealy mealyMachine2 = mealy2.createMealyMachine(alphabetProxy2);

        Word separatingWord = Automata.findSeparatingWord(mealyMachine1, mealyMachine2, alphabetProxy1);

        String result = "";
        if (separatingWord != null) {
            result = separatingWord.toString();
        }

        return result;
    }
}
