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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to submit a specific element.
 */
@Entity
@DiscriminatorValue("web_switchToFrame")
@JsonTypeName("web_switchToFrame")
public class SwitchToFrameAction extends WebSymbolAction {

    private static final long serialVersionUID = -6501583266031427394L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The element to switch to.
     */
    @NotNull
    @Embedded
    private WebElementLocator node;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final WebElement element = connector.getElement(nodeWithVariables);
            connector.getDriver().switchTo().frame(element);
            connector.setLastFrame(element);
            LOGGER.info(LoggerMarkers.LEARNER, "Switch to frame with selector '{}'", nodeWithVariables);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not switch to frame with selector '{}'", nodeWithVariables);
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
