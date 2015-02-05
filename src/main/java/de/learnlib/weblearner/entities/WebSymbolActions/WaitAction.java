package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to wait for a specifiy amount of time.
 */
@Entity
@DiscriminatorValue("web_wait")
@JsonTypeName("wait")
public class WaitAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 7122950041811279742L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The duration to wait in ms. */
    private int duration;

    /**
     * Get the duration of the wait.
     *
     * @return The duration in milliseconds.
     */
    public int getDuration() {
        return duration;
    }

    /**
     * Set the duration to wait.
     *
     * @param duration
     *            The new duration in milliseconds.
     */
    public void setDuration(int duration) {
        this.duration = duration;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            Thread.sleep(duration);
            return ExecuteResult.OK;
        } catch (InterruptedException e) {
            LOGGER.error("WaitAction failed to wait.", e);
            return ExecuteResult.FAILED;
        }
    }

}
