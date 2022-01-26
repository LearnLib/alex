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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Action to wait for a node attribute value.
 */
@Entity
@DiscriminatorValue("web_waitForNodeAttribute")
@JsonTypeName("web_waitForNodeAttribute")
public class WaitForNodeAttributeAction extends WebSymbolAction {

    /** Enum to specify the wait criterion. */
    public enum WaitCriterion {

        /** If the title should be the value. */
        IS,

        /** If the title should contain the value. */
        CONTAINS
    }

    /** The value the attribute should match / contain. */
    @NotBlank
    @Column(name = "\"value\"")
    private String value;

    /** The attribute to wait for. */
    @NotBlank
    private String attribute;

    /** Which criterion is used to wait for the title. */
    @NotNull
    private WaitCriterion waitCriterion;

    /** How many seconds should be waited before the action fails. */
    @NotNull
    @Min(0)
    private long maxWaitTime;

    /** The element. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        if (maxWaitTime < 0) {
            return getFailedOutput();
        }

        final WebDriverWait wait = new WebDriverWait(connector.getDriver(), maxWaitTime);
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        final String valueWithVariables = insertVariableValues(value);

        try {
            switch (waitCriterion) {
                case IS:
                    wait.until(wd -> connector.getElement(nodeWithVariables)
                            .getAttribute(attribute)
                            .equals(valueWithVariables));
                    break;
                case CONTAINS:
                    wait.until(wd -> connector.getElement(nodeWithVariables)
                            .getAttribute(attribute)
                            .contains(valueWithVariables));
                    break;
                default:
                    return getFailedOutput();
            }

            return getSuccessOutput();
        } catch (TimeoutException e) {
            logger.info(LoggerMarkers.LEARNER, "Waiting on the attribute '{}' (criterion: '{}') timed out. ",
                    attribute, waitCriterion);
            return getFailedOutput();
        }
    }

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

}
