package de.learnlib.alex.actions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to wait for a specific amount of time.
 */
@Entity
@DiscriminatorValue("wait")
@JsonTypeName("wait")
public class WaitAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 7122950041811279742L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /**
     * The duration to wait in ms.
     * @requiredField
     */
    private Long duration;

    /**
     * Get the duration of the wait.
     *
     * @return The duration in milliseconds.
     */
    public Long getDuration() {
        return duration;
    }

    /**
     * Set the duration to wait.
     *
     * @param duration
     *         The new duration in milliseconds.
     */
    public void setDuration(Long duration) {
        this.duration = duration;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            Thread.sleep(duration);
            return getSuccessOutput();
        } catch (InterruptedException e) {
            LOGGER.error("WaitAction failed to wait.", e);
            return getFailedOutput();
        }
    }

}
