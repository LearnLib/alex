package de.learnlib.alex.core.learner;

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
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.oracles.ResetCounterSUL;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Basic class to control and monitor a learn process.
 * This class is a high level abstraction of the LearnLib.
 */
public class Learner {

    /** How many concurrent threads the system can handle. */
    private static final int MAX_CONCURRENT_THREADS = 1;

    /**
     * Factory to create a new ContextHandler.
     */
    private ConnectorContextHandlerFactory contextHandlerFactory;

    /**
     * The current ContextHandler.
     */
    private ConnectorContextHandler contextHandler;

    /**
     * Factory to create the {@link LearnerThread LearnerThreads}.
     */
    private LearnerThreadFactory learnThreadFactory;

    /**
     * The last thread of an user, if one exists.
     */
    private final Map<User, LearnerThread> userThreads;

    /**
     * The current learning activeThreads. Could be empty.
     */
    private final Map<User, LearnerThread> activeThreads;

    /**
     * Constructor which only set the thread factory.
     * This constructor creates a new ConnectorContextHandlerFactory for internal use.
     *
     * @param threadFactory The thread factory to use.
     */
    public Learner(LearnerThreadFactory threadFactory) {
        this(threadFactory, new ConnectorContextHandlerFactory());
    }

    /**
     * Constructor that initialises only the LearnerThreadFactory.
     *
     * @param learnThreadFactory    The thread factory to use.
     * @param contextHandlerFactory The factory that will be used to create new context handler.
     */
    public Learner(LearnerThreadFactory learnThreadFactory, ConnectorContextHandlerFactory contextHandlerFactory) {
        this.learnThreadFactory = learnThreadFactory;
        this.contextHandlerFactory = contextHandlerFactory;
        this.activeThreads = new HashMap<>();
        this.userThreads   = new HashMap<>();
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
     *         If the configuration was invalid.
     * @throws IllegalStateException
     *         If a learning process is already active.
     */
    public void start(User user, Project project, LearnerConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException {
        if (isActive(user)) {
            throw new IllegalStateException("You can only start the learning if no other learning is active");
        }

        if (activeThreads.size() >= MAX_CONCURRENT_THREADS) {
            throw new IllegalStateException("Maximum amount of parallel threads reached.");
        }

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

        WebSiteConnector.WebBrowser browser = configuration.getBrowser();
        contextHandler = contextHandlerFactory.createContext(project, browser);
        LearnerThread learnThread = learnThreadFactory.createThread(contextHandler, user, project, configuration);
        startThread(user, learnThread);

        // get the sul here once so that the timer doesn't get '0' for .getStatisticalData.getCount() after continuing
        // a learning process
        learnThread.getResetCounterSUL();
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param user
     *         The user thats wants to restart his latest thread.
     * @param newConfiguration
     *         The configuration to use for the next learning steps.
     * @throws IllegalArgumentException
     *         If the new configuration has errors.
     * @throws IllegalStateException
     *         If a learning process is already active.
     */
    public void resume(User user, LearnerResumeConfiguration newConfiguration)
            throws IllegalArgumentException, IllegalStateException {
        if (isActive(user)) {
            throw new IllegalStateException("You can only restart the learning if no other learning is active");
        }

        newConfiguration.checkConfiguration(); // throws IllegalArgumentException if something is wrong
        validateCounterExample(user, newConfiguration);

        LearnerThread previousThread = userThreads.get(user);
        LearnerThread learnThread = learnThreadFactory.updateThread(previousThread, newConfiguration);
        startThread(user, learnThread);
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

                    Optional<Symbol> symbol = lastResult.getConfiguration().getSymbols().stream()
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
                                                   lastResult.getConfiguration().getResetSymbol(),
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
            return  false;
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
     * @param project     The project in which context the test should happen.
     * @param resetSymbol The reset symbol to use.
     * @param symbols     The symbol sequence to execute in order to generate the output sequence.
     * @return The following output sequence.
     */
    public List<String> readOutputs(User user, Project project, Symbol resetSymbol, List<Symbol> symbols)
            throws LearnerException {
        if (contextHandler == null) {
            // todo: remove hardcoded browser
            contextHandler = contextHandlerFactory.createContext(project, WebSiteConnector.WebBrowser.HTMLUNITDRIVER);
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
