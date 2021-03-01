/*
 * Copyright 2015 - 2021 TU Dortmund
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
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

/**
 * Action to assert that an input[type="radio"] or input[type="checkbox"] is selected.
 */
@Entity
@DiscriminatorValue("web_checkNodeSelected")
@JsonTypeName("web_checkNodeSelected")
public class CheckNodeSelectedAction extends WebSymbolAction {

    private static final long serialVersionUID = -536234264110313110L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The input element. */
    @NotNull
    private WebElementLocator node;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final WebElement element = connector.getElement(nodeWithVariables);
            if (element.isSelected()) {
                LOGGER.info(LoggerMarkers.LEARNER, "Element '{}' is selected.", nodeWithVariables);
                return getSuccessOutput();
            } else {
                LOGGER.info(LoggerMarkers.LEARNER, "Element '{}' is not selected.", nodeWithVariables);
                return getFailedOutput();
            }
        } catch (NoSuchElementException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not assert if element '{}' is selected ", nodeWithVariables);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }
}
