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
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

/**
 * Action to move the mouse to an element or a screen position, e.g. in order to make invisible elements visible or to
 * scroll on the page.
 */
@Entity
@DiscriminatorValue("web_moveMouse")
@JsonTypeName("web_moveMouse")
public class MoveMouseAction extends WebSymbolAction {

    /**
     * The selector of the element.
     */
    @Embedded
    private WebElementLocator node;

    /**
     * The amount in px to move the mouse in x direction from the current position.
     */
    @NotNull
    private int offsetX;

    /**
     * The amount in px to move the mouse in y direction from the current position.
     */
    @NotNull
    private int offsetY;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables = node == null ? null
                : new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final Actions actions = new Actions(connector.getDriver());

            if (nodeWithVariables == null || nodeWithVariables.getSelector().trim().equals("")) {
                actions.moveByOffset(offsetX, offsetY).build().perform();
                logger.info(LoggerMarkers.LEARNER, "Moved the mouse to the position ({}, {}) ", offsetX, offsetY);
            } else {
                final WebElement element = connector.getElement(nodeWithVariables);
                actions.moveToElement(element, offsetX, offsetY).build().perform();
                logger.info(LoggerMarkers.LEARNER, "Moved the mouse to the element '{}'", nodeWithVariables);
            }

            return getSuccessOutput();
        } catch (Exception e) {
            logger.info(LoggerMarkers.LEARNER, "Could not move the mouse to the element '{}' or the position ({}, {})",
                    nodeWithVariables, offsetX, offsetY);
            return getFailedOutput();
        }
    }

    public int getOffsetY() {
        return offsetY;
    }

    public void setOffsetY(int offsetY) {
        this.offsetY = offsetY;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public int getOffsetX() {
        return offsetX;
    }

    public void setOffsetX(int offsetX) {
        this.offsetX = offsetX;
    }
}
