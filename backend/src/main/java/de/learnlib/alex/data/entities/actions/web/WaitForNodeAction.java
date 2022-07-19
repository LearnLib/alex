/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Action to wait for the state of an element to change.
 */
@Entity
@DiscriminatorValue("web_waitForNode")
@JsonTypeName("web_waitForNode")
public class WaitForNodeAction extends WebSymbolAction {

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
    @Min(0)
    private long maxWaitTime;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        if (maxWaitTime < 0) {
            return getFailedOutput();
        }

        final WebDriverWait wait = new WebDriverWait(connector.getDriver(), maxWaitTime);
        final WebElementLocator nodeWithVariables = new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            logger.info(LoggerMarkers.LEARNER, "Wait for element '{}' (criterion: '{}').",
                    nodeWithVariables, waitCriterion);
            switch (waitCriterion) {
                case VISIBLE:
                    wait.until(wd -> {
                        try {
                            return connector.getElement(nodeWithVariables).isDisplayed();
                        } catch (Exception e) {
                            return false;
                        }
                    });
                    break;
                case INVISIBLE:
                    wait.until(wd -> {
                        try {
                            return !connector.getElement(nodeWithVariables).isDisplayed();
                        } catch (Exception e) {
                            return false;
                        }
                    });
                    break;
                case ADDED:
                    wait.until(wd -> {
                        try {
                            connector.getElement(nodeWithVariables);
                            return true;
                        } catch (Exception e) {
                            return false;
                        }
                    });
                    break;
                case REMOVED:
                    wait.until(wd -> {
                        try {
                            connector.getElement(nodeWithVariables);
                            return false;
                        } catch (Exception e) {
                            return true;
                        }
                    });
                    break;
                case CLICKABLE:
                    wait.until(wd -> {
                        try {
                            final WebElement element = connector.getElement(nodeWithVariables);
                            return element.isDisplayed() && element.isEnabled();
                        } catch (Exception e) {
                            return false;
                        }
                    });
                    break;
                default:
                    return getFailedOutput();
            }
            return getSuccessOutput();
        } catch (TimeoutException e) {
            logger.info(LoggerMarkers.LEARNER, "Waiting on the node '{}' (criterion: '{}') timed out.",
                    nodeWithVariables, waitCriterion);
            return getFailedOutput();
        } catch (NoSuchElementException e) {
            logger.info(LoggerMarkers.LEARNER, "The node with the selector {} (criterion: '{}') could not be found.",
                    nodeWithVariables, waitCriterion);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public WaitCriterion getWaitCriterion() {
        return waitCriterion;
    }

    public void setWaitCriterion(WaitCriterion waitCriterion) {
        this.waitCriterion = waitCriterion;
    }

    public long getMaxWaitTime() {
        return maxWaitTime;
    }

    public void setMaxWaitTime(long maxWaitTime) {
        this.maxWaitTime = maxWaitTime;
    }
}
