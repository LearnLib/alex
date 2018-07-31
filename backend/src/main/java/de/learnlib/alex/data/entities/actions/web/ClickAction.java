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
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to click on a specific element.
 */
@Entity
@DiscriminatorValue("web_click")
@JsonTypeName("web_click")
public class ClickAction extends WebSymbolAction {

    private static final long serialVersionUID = -9158530821188611940L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The information to identify the element.
     */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /**
     * If a double click is executed.
     */
    @NotNull
    private boolean doubleClick;

    /** Constructor. */
    public ClickAction() {
        doubleClick = false;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final WebElement element = connector.getElement(nodeWithVariables);

            if (doubleClick) {
                new Actions(connector.getDriver()).doubleClick(element).build().perform();
            } else {
                element.click();
            }

            LOGGER.info(LoggerMarkers.LEARNER, "Clicked on element '{}' (doubleClick: {}).",
                    nodeWithVariables, doubleClick);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not find element '{}' (doubleClick: {}).",
                    nodeWithVariables, doubleClick);
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Failed to click on element '{}' (doubleClick: {}).",
                    nodeWithVariables, doubleClick, e);
        }

        return getFailedOutput();
    }

    public WebElementLocator getNode() {
        return node;
    }

    public boolean isDoubleClick() {
        return doubleClick;
    }

    public void setDoubleClick(boolean doubleClick) {
        this.doubleClick = doubleClick;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }
}
