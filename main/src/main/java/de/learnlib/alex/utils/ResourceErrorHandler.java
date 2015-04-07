package de.learnlib.alex.utils;

import com.fasterxml.jackson.annotation.JsonGetter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * Helper class to deal with errors/ that accrue in the REST resources.
 * It makes a entry in the log and creates a response with the proper status and a nice JSON error message.
 */
public final class ResourceErrorHandler {

    /**
     * Entity class for the JSON error messages.
     */
    public static class RESTError {

        /**
         * Status of the error.
         * @exclude
         */
        private Status status;

        /**
         * The cause of the error.
         * @exclude
         */
        private Exception exception;

        /**
         * Constructor.
         * 
         * @param status
         *            The status of the error.
         * @param exception
         *            The exception that caused the error, could be null.
         */
        public RESTError(Status status, Exception exception) {
            this.status = status;
            this.exception = exception;
        }

        /**
         * Returns the proper status code for this error.
         * 
         * @return The HTTP status code.
         */
        @JsonGetter
        public int getStatusCode() {
            return status.getStatusCode();
        }

        /**
         * Returns a short description of the status (like the short HTTP error messages).
         * 
         * @return A short string to describe the status.
         */
        @JsonGetter
        public String getStatusText() {
            return status.getReasonPhrase();
        }

        /**
         * Get the message of the exception that cause this error.
         * 
         * @return The message of the error.
         */
        @JsonGetter
        public String getMessage() {
            if (exception != null) {
                return exception.getMessage();
            } else {
                return "";
            }
        }

    }

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /**
     * Deactivated constructor because this is a helper class.
     */
    private ResourceErrorHandler() {
        // nothing to do here
    }

    /**
     * Create a Response with the right status code and a nice JSON error message.
     * This method also logs the error in the 'info' space.
     * 
     * @param context
     *            The context this method was called in. Recommended: 'Class.method'.
     * @param status
     *            The HTTP status this error belong to.
     * @param e
     *            The exception that cause the error, could be null.
     * @return A Response object containing a JSON error message and the proper status code.
     */
    public static Response createRESTErrorMessage(String context, Status status, Exception e) {
        LOGGER.info(context + " send an error:", e);
        RESTError error = new RESTError(status, e);
        return Response.status(status).entity(error).build();
    }

}
