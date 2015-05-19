package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.exceptions.LearnerException;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * Basic class to control and monitor a learn process.
 * This class is a high level abstraction of the LearnLib.
 */
public class Learner {

    /** Factory to create a new ContextHandler. */
    private ConnectorContextHandlerFactory contextHandlerFactory;

    /** The current ContextHandler. */
    private ConnectorContextHandler contextHandler;

    /** Factory to create the {@link LearnerThread LearnerThreads}. */
    private LearnerThreadFactory learnThreadFactory;

    /** The current learning thread. Could be null. */
    private LearnerThread learnThread;

    /**
     * Constructor which only set the thread factory.
     * This constructor creates a new ConnectorContextHandlerFactory for internal use.
     *
     * @param threadFactory
     *         The thread factory to use.
     */
    public Learner(LearnerThreadFactory threadFactory) {
        this(threadFactory, new ConnectorContextHandlerFactory());
    }

    /**
     * Constructor that initialises only the LearnerThreadFactory.
     *
     * @param learnThreadFactory
     *         The thread factory to use.
     * @param contextHandlerFactory
     *         The factory that will be used to create new context handler.
     */
    public Learner(LearnerThreadFactory learnThreadFactory, ConnectorContextHandlerFactory contextHandlerFactory) {
        this.learnThreadFactory = learnThreadFactory;
        this.contextHandlerFactory = contextHandlerFactory;
    }

    /**
     * Start a learning process by activating a LearningThread.
     *
     * @param project
     *         The project the learning process runs in.
     * @param configuration
     *         The configuration to use for the learning process.
     * @throws IllegalArgumentException
     *         If the configuration was invalid.
     * @throws IllegalStateException
     *         If a learning process is already active.
     */
    public void start(Project project, LearnerConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException {
        if (isActive()) {
            throw new IllegalStateException("You can only start the learning if no other learning is active");
        }

        configuration.checkConfiguration(); // throws IllegalArgumentException if something is wrong

        contextHandler = contextHandlerFactory.createContext(project);
        learnThread = learnThreadFactory.createThread(contextHandler, project, configuration);
        Thread thread = Executors.defaultThreadFactory().newThread(learnThread);
        thread.start();
    }

    /**
     * Resuming a learning process by activating a LearningThread.
     *
     * @param newConfiguration
     *         The configuration to use for the next learning steps.
     * @throws IllegalStateException
     *         If a learning process is already active.
     */
    public void resume(LearnerResumeConfiguration newConfiguration) throws  IllegalStateException {
        if (isActive()) {
            throw new IllegalStateException("You can only restart the learning if no other learning is active");
        }

        newConfiguration.checkConfiguration(); // throws IllegalArgumentException if something is wrong

        learnThread = learnThreadFactory.updateThread(learnThread, newConfiguration);
        Thread thread = Executors.defaultThreadFactory().newThread(learnThread);
        thread.start();
    }

    /**
     * Ends the learning process after the current step.
     */
    public void stop() {
        learnThread.interrupt();
    }

    /**
     * Method to check if a learning process is still active or if it has finished.
     *
     * @return true if the learning process is active, false otherwise.
     */
    public boolean isActive() {
        return learnThread != null && learnThread.isActive();
    }

    /**
     * Get the current result of the learning process.
     * This must not be a valid step of a test run!
     *
     * @return The current result of the LearnerThread.
     */
    public LearnerResult getResult() {
        if (learnThread != null) {
            return learnThread.getResult();
        } else {
            return null;
        }
    }

    /**
     * Determine the output of the SUL by testing a sequence of input symbols.
     *
     * @param project
     *         The project in which context the test should happen.
     * @param resetSymbol
     *         The reset symbol to use.
     * @param symbols
     *         The symbol sequence to execute in order to generate the output sequence.
     * @return The following output sequence.
     */
    public List<String> readOutputs(Project project, Symbol resetSymbol, List<Symbol> symbols) throws LearnerException {
        if (contextHandler == null) {
            contextHandler = contextHandlerFactory.createContext(project);
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
