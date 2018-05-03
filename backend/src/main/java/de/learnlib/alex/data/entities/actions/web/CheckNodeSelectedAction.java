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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to assert that an input[type="radio"] or input[type="checkbox"] is selected.
 */
@Entity
@DiscriminatorValue("web_checkNodeSelected")
@JsonTypeName("web_checkNodeSelected")
public class CheckNodeSelectedAction extends WebSymbolAction {

    private static final long serialVersionUID = -536234264110313110L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The input element. */
    @NotNull
    private WebElementLocator node;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        node.setSelector(insertVariableValues(node.getSelector()));

        try {
            final WebElement element = connector.getElement(node);
            if (element.isSelected()) {
                LOGGER.info(LEARNER_MARKER, "Element '{}' is selected (ignoreFailure: {}, negated: {}).",
                        node, ignoreFailure, negated);
                return getSuccessOutput();
            } else {
                LOGGER.info(LEARNER_MARKER, "Element '{}' is not selected (ignoreFailure: {}, negated: {}).",
                        node, ignoreFailure, negated);
                return getFailedOutput();
            }
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not assert if element '{}' is selected "
                    + "(ignoreFailure: {}, negated: {}).", node, ignoreFailure, negated);
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
