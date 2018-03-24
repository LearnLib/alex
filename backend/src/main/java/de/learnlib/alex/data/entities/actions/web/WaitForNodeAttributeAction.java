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
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to wait for a node attribute value.
 */
@Entity
@DiscriminatorValue("web_waitForNodeAttribute")
@JsonTypeName("web_waitForNodeAttribute")
public class WaitForNodeAttributeAction extends WebSymbolAction {

    private static final long serialVersionUID = 1759832996792561200L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** Enum to specify the wait criterion. */
    public enum WaitCriterion {

        /** If the title should be the value. */
        IS,

        /** If the title should contain the value. */
        CONTAINS;

        @JsonCreator
        public static WaitCriterion fromString(String name) throws IllegalArgumentException {
            return WaitCriterion.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }

    /** The value the attribute should match / contain. */
    @NotBlank
    private String value;

    /** The attribute to wait for. */
    @NotBlank
    private String attribute;

    /** Which criterion is used to wait for the title. */
    @NotNull
    private WaitCriterion waitCriterion;

    /** How many seconds should be waited before the action fails. */
    @NotNull
    private long maxWaitTime;

    /** The element. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
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

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        if (maxWaitTime < 0) {
            return getFailedOutput();
        }

        WebDriverWait wait = new WebDriverWait(connector.getDriver(), maxWaitTime);

        value = insertVariableValues(value);

        try {
            switch (waitCriterion) {
                case IS:
                    wait.until(wd -> connector.getElement(node).getAttribute(attribute).equals(value));
                    break;
                case CONTAINS:
                    wait.until(wd -> connector.getElement(node).getAttribute(attribute).contains(value));
                    break;
                default:
                    return getFailedOutput();
            }

            return getSuccessOutput();
        } catch (TimeoutException e) {
            LOGGER.info(LEARNER_MARKER, "Waiting on the attribute '{}' (criterion: '{}') timed out. ",
                        attribute, waitCriterion);
            return getFailedOutput();
        }
    }

}
