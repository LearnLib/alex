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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebElement;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Action to enter a text into a specific element.
 */
@Entity
@DiscriminatorValue("web_fill")
@JsonTypeName("web_fill")
public class FillAction extends WebSymbolAction {

    private static final long serialVersionUID = 8595076806577663223L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The node to look for.
     */
    @NotNull
    @Embedded
    protected WebElementLocator node;

    /**
     * The Value to insert.
     */
    @NotBlank
    @Column(name = "\"value\"")
    protected String value;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        final String valueWithVariables = insertVariableValues(value);
        try {
            WebElement element = connector.getElement(nodeWithVariables);
            element.sendKeys(valueWithVariables);

            LOGGER.info("Filled the element '{}' with '{}'.", nodeWithVariables, value);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not find the element '{}' to fill it with '{}'",
                    nodeWithVariables, valueWithVariables, e);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
