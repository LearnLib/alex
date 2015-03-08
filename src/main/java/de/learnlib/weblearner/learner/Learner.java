package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.LearnerResumeConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;

import java.util.concurrent.Executors;

/**
 * Basic class to control and monitor a learn process.
 * This class is a high level abstraction of the LearnLib.
 */
public class Learner {

    /** Factory to create the {@link LearnerThread LearnerThreads}. */
    private LearnerThreadFactory learnThreadFactory;

    /** The current learning thread. Could be null. */
    private LearnerThread<?> learnThread;

    /**
     * Constructor that initialises only the LearnerThreadFactory.
     *
     * @param learnThreadFactory
     *         The factory to use.
     */
    public Learner(LearnerThreadFactory learnThreadFactory) {
        this.learnThreadFactory = learnThreadFactory;
    }

    /**
     * Start a learning process by activating a LearningThread.
     *
     * @param project
     *         The project the learning process runs in.
     * @param configuration
     *         The configuration to use for the learning process.
     * @throws IllegalStateException
     *         If a learning process is already active.
     */
    public void start(Project project, LearnerConfiguration configuration)
            throws IllegalArgumentException, IllegalStateException {
        if (isActive()) {
            throw new IllegalStateException("You can only start the learning if no other learning is active");
        }

        configuration.checkConfiguration(); // throws IllegalArgumentException if something is wrong

        learnThread = learnThreadFactory.createThread(project, configuration);
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

}
