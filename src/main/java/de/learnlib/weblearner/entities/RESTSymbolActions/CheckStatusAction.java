package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebServiceConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the last call returned a specific status code.
 */
@Entity
@DiscriminatorValue("checkStatus")
@JsonTypeName("rest_checkStatus")
public class CheckStatusAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -4444604521120530087L;

    /** The status code to check. */
    private int status;

    /**
     * Get the status code the last request should return.
     *
     * @return The status code to check.
     */
    public int getStatus() {
        return status;
    }

    /**
     * Set the status code the last request should return.
     *
     * @param status
     *         The status code to check.
     */
    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        if (status == target.getStatus()) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }
}
