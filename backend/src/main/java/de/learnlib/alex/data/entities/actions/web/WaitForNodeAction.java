/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to wait for the state of an element to change.
 */
@Entity
@DiscriminatorValue("web_waitForNode")
@JsonTypeName("web_waitForNode")
public class WaitForNodeAction extends WebSymbolAction {

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
        REMOVED,

        /**
         * If an element is clickable.
         */
        CLICKABLE;

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
    @NotNull
    @Embedded
    private WebElementLocator node;

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
    public WebElementLocator getNode() {
        return node;
    }

    /**
     * Set the selector of the element.
     *
     * @param node The selector of the element
     */
    public void setNode(WebElementLocator node) {
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
        node.setSelector(insertVariableValues(node.getSelector()));

        try {
            switch (waitCriterion) {
                case VISIBLE:
                    wait.until(wd -> connector.getElement(node).isDisplayed());
                    break;
                case INVISIBLE:
                    wait.until(wd -> !connector.getElement(node).isDisplayed());
                    break;
                case ADDED:
                    wait.until(ExpectedConditions.presenceOfElementLocated(node.getBy()));
                    wait.until(wd -> {
                       try {
                           connector.getElement(node);
                           return true;
                       } catch (Exception e) {
                           return false;
                       }
                    });
                    break;
                case REMOVED:
                    wait.until(wd -> {
                        try {
                            connector.getElement(node);
                            return false;
                        } catch (Exception e) {
                            return true;
                        }
                    });
                    break;
                case CLICKABLE:
                    wait.until(wd -> {
                        final WebElement element = connector.getElement(node);
                        return element.isDisplayed() && element.isEnabled();
                    });
                    break;
                default:
                    return getFailedOutput();
            }
            return getSuccessOutput();
        } catch (TimeoutException e) {
            LOGGER.info(LEARNER_MARKER, "Waiting on the node '{}' (criterion: '{}') timed out.",
                        node, waitCriterion);
            return getFailedOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "The node with the selector {} (criterion: '{}') could not be found.",
                    node, waitCriterion);
            return getFailedOutput();
        }
    }
}
