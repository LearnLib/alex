package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.CSSUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to wait for the state of an element to change.
 */
@Entity
@DiscriminatorValue("web_waitForNode")
@JsonTypeName("web_waitForNode")
public class WaitForNodeAction extends WebSymbolAction {

    /**
     * to be serializable.
     */
    private static final long serialVersionUID = 4029222122474954117L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * Enumeration to specify the wait criterion.
     */
    public enum WaitCriterion {

        /**
         * If an element is attached to the DOM and visible.
         */
        VISIBLE,

        /**
         * If an element is attached to the DOM but not visible.
         */
        INVISIBLE,

        /**
         * If an element is added to the DOM tree.
         */
        ADDED,

        /**
         * If an element is removed from the DOM tree.
         */
        REMOVED;

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
     * The css selector of the element.
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String node;

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
     * Get the selector of the element.
     *
     * @return The selector of the element
     */
    public String getNode() {
        return node;
    }

    /**
     * Set the selector of the element.
     *
     * @param node The selector of the element
     */
    public void setNode(String node) {
        this.node = node;
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
        String selector = CSSUtils.escapeSelector(insertVariableValues(node));

        try {
            switch (waitCriterion) {
                case VISIBLE:
                    wait.until(ExpectedConditions.visibilityOf(connector.getElement(selector)));
                    break;
                case INVISIBLE:
                    wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(selector)));
                    break;
                case ADDED:
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(selector)));
                    break;
                case REMOVED:
                    wait.until(ExpectedConditions.stalenessOf(connector.getElement(selector)));
                    break;
                default:
                    return getFailedOutput();
            }
            return getSuccessOutput();
        } catch (TimeoutException e) {
            LOGGER.info(LEARNER_MARKER, "Waiting on the node '{}' (criterion: '{}') timed out.",
                        selector, waitCriterion);
            return getFailedOutput();
        }

    }


}
