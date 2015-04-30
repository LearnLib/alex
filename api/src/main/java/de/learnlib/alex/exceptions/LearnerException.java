package de.learnlib.alex.exceptions;

/**
 * Exception to indicate error during the learn process.
 */
public class LearnerException extends RuntimeException {

    /**
     * Default constructor.
     */
    public LearnerException() {
    }

    /**
     * Calls the constructor of the super Exception class.
     *
     * @param message
     *         More details of the error as good, old string.
     */
    public LearnerException(String message) {
        super(message);
    }

    /**
     * Calls the constructor of the super Exception class.
     *
     * @param message
     *         More details of the error as good, old string.
     * @param cause
     *         A throwable that caused the learner to stop.
     */
    public LearnerException(String message, Throwable cause) {
        super(message, cause);
    }
}
