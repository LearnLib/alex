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
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.WebBrowser;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.oracles.ResetCounterSUL;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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

    /** The SymbolDAO to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /** The LearnerResultDAO to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

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

    /**
     * The current learning activeThreads. Could be empty.
     */
    private final Map<User, LearnerThread> activeThreads;

    /**
     * This constructor creates a new Learner
     * The SymbolDAO and LearnerResultDAO must be externally injected.
     */
    public Learner() {
        this.activeThreads = new HashMap<>();
        this.userThreads   = new HashMap<>();
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
     * @param learnerThreadFactory
     *         The factory to create the learner threads.
     */
    Learner(SymbolDAO symbolDAO, LearnerResultDAO learnerResultDAO,
                   ConnectorContextHandlerFactory contextHandlerFactory, LearnerThreadFactory learnerThreadFactory) {
        this();
        this.symbolDAO = symbolDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.contextHandlerFactory = contextHandlerFactory;
        this.learnerThreadFactory = learnerThreadFactory;
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

        WebBrowser browser = configuration.getBrowser();
        contextHandler = contextHandlerFactory.createContext(project, browser);
        contextHandler.setResetSymbol(learnerResult.getResetSymbol());
        LearnerThread learnThread = learnerThreadFactory.createThread(learnerResult, contextHandler);
        startThread(user, learnThread);

        // get the sul here once so that the timer doesn't get '0' for .getStatisticalData.getCount() after continuing
        // a learning process
        learnThread.getResetCounterSUL();
    }

    private LearnerResult createLearnerResult(User user, Project project, LearnerConfiguration configuration)
            throws NotFoundException {
        // TODO: make it nicer than this instanceof stuff, because you have to somehow tell the eq oracle that the
        //       learner started and not resumed
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
            Symbol resetSymbol = symbolDAO.get(user, project.getId(), configuration.getResetSymbolAsIdRevisionPair());
            learnerResult.setResetSymbol(resetSymbol);
        } catch (NotFoundException e) { // Extra exception to emphasize that this is the reset symbol.
            throw new NotFoundException("Could not find the reset symbol!", e);
        }

        // TODO: remove new HashMap -> getAll should return a Set
        List<Symbol> symbolsAsList = symbolDAO.getAll(user, project.getId(),
                                                      new LinkedList<>(configuration.getSymbolsAsIdRevisionPairs()));
        Set<Symbol> symbols = new HashSet<>(symbolsAsList);
        learnerResult.setSymbols(symbols);

        learnerResult.setBrowser(configuration.getBrowser());
        learnerResult.setAlgorithm(configuration.getAlgorithm());
        learnerResult.setComment(configuration.getComment());
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

        // clean up active threads.
        List<User> finishedThreadsByUser = new LinkedList<>();
        activeThreads.entrySet().stream()
                                    .filter(e -> e.getValue().isFinished())
                                    .forEach(e -> finishedThreadsByUser.add(e.getKey()));
        finishedThreadsByUser.forEach(activeThreads::remove);

        if (activeThreads.size() >= MAX_CONCURRENT_THREADS) {
            throw new IllegalStateException("Maximum amount of parallel threads reached!");
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
        Thread thread = Executors.defaultThreadFactory().newThread(learnThread);
        userThreads.put(user, learnThread);
        activeThreads.put(user, learnThread);
        thread.start();
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
        LearnerThread learnerThread = activeThreads.get(user);

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
        LearnerThread learnerThread = activeThreads.get(user);

        // if no active thread for the user exists -> return false
        if (learnerThread == null) {
            return false;
        }

        // if an 'active' thread existed, but it is actually finished -> clean up activeThread map & return false
        if (learnerThread.isFinished()) {
            activeThreads.remove(user);
            return false;
        }

        // otherwise an active thread exists -> return true
        return true;
    }

    /**
     * Get the status of the Learner as immutable object.
     *
     * @param user
     *         The user that wants a LearnerStatus object for his (active) thread.
     * @return A snapshot of the Learner status.
     */
    public LearnerStatus getStatus(User user) {
        LearnerStatus status = new LearnerStatus(user, this);
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
     * Get the number of executed MQs in the current learn process.
     *
     * @param user
     *         The User that wants to his MQs used.
     * @return null if the learnThread has not been started or the number of executed MQs in the current learn process
     */
    public Long getMQsUsed(User user) {
        LearnerThread learnerThread = userThreads.get(user);

        if (learnerThread == null) {
            return null;
        } else {
            ResetCounterSUL resetCounterSUL = learnerThread.getResetCounterSUL();
            return resetCounterSUL.getStatisticalData().getCount();
        }
    }

    /**
     * Get the date and time when the learner started learning.
     *
     * @param user
     *         The user that wants to see his latest start date.
     * @return The date and time when the learner started learning.
     */
    public ZonedDateTime getStartDate(User user) {
        LearnerThread learnerThread = userThreads.get(user);

        if (learnerThread == null) {
            return null;
        } else {
            return getResult(user).getStatistics().getStartDate();
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
        if (contextHandler == null) {
            // todo: remove hardcoded browser
            contextHandler = contextHandlerFactory.createContext(project, WebBrowser.HTMLUNITDRIVER);
        }
        contextHandler.setResetSymbol(resetSymbol);

        ConnectorManager connectors = contextHandler.createContext();

        try {
            return symbols.stream().map(s -> s.execute(connectors).toString()).collect(Collectors.toList());
        } catch (Exception e) {
            throw new LearnerException("Could not read the outputs", e);
        }
    }

}
