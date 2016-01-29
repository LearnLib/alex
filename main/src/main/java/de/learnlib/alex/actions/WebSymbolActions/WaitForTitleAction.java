package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to wait for the title of a page to change.
 */
@Entity
@DiscriminatorValue("web_waitForTitle")
@JsonTypeName("web_waitForTitle")
public class WaitForTitleAction extends WebSymbolAction {

    /**
     * to be serializable.
     */
    private static final long serialVersionUID = -7416267361597106520L;

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /**
     * Enumeration to specify the wait criterion.
     */
    public enum WaitCriterion {
        /**
         * If the title should be the value.
         */
        IS,

        /**
         * If the title should contain the value.
         */
        CONTAINS;


        /**
         * Parser function to handle the enum names case insensitive.
         *
         * @param name
         *         The enum name.
         * @return The corresponding WaitCriterion.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        @JsonCreator
        public static WaitCriterion fromString(String name) throws IllegalArgumentException {
            return WaitCriterion.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }

    /**
     * The value the title should match / contain.
     */
    @NotBlank
    private String value;

    /**
     * Which criterion is used to wait for the title.
     */
    @NotNull
    private WaitCriterion waitCriterion;

    /**
     * How many seconds should be waited before the action fails.
     */
    @NotNull
    private long maxWaitTime;

    /**
     * Get the value for the title.
     *
     * @return The value for the title
     */
    public String getValue() {
        return value;
    }

    /**
     * Set the expected value of the title.
     *
     * @param value The expected value of the title
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Get the wait criterion.
     *
     * @return The wait criterion
     */
    public WaitCriterion getWaitCriterion() {
        return waitCriterion;
    }

    /**
     * Set the wait criterion.
     *
     * @param waitCriterion The wait criterion
     */
    public void setWaitCriterion(WaitCriterion waitCriterion) {
        this.waitCriterion = waitCriterion;
    }

    /**
     * Get the max amount of time in seconds to wait before the action fails.
     *
     * @return The max amount of time
     */
    public long getMaxWaitTime() {
        return maxWaitTime;
    }

    /**
     * Set the max amount of time in seconds to wait before the action fails.
     *
     * @param maxWaitTime The max amount of time in seconds
     */
    public void setMaxWaitTime(long maxWaitTime) {
        this.maxWaitTime = maxWaitTime;
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        if (maxWaitTime < 0) {
            return getFailedOutput();
        }

        WebDriverWait wait = new WebDriverWait(connector.getDriver(), maxWaitTime);

        try {
            switch (waitCriterion) {
                case IS:
                    wait.until(ExpectedConditions.titleIs(value));
                    break;
                case CONTAINS:
                    wait.until(ExpectedConditions.titleContains(value));
                    break;
                default:
                    return getFailedOutput();
            }

            return getSuccessOutput();
        } catch (TimeoutException e) {
            LOGGER.info("Waiting on the title '" + value + "' (criterion: '" + waitCriterion + "') timed out. "
                                + "Last known title was '" + connector.getDriver().getTitle() + "'.");
            return getFailedOutput();
        }
    }

}
