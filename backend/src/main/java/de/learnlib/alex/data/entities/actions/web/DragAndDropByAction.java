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
import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

@Entity
@DiscriminatorValue("web_dragAndDropBy")
@JsonTypeName("web_dragAndDropBy")
public class DragAndDropByAction extends WebSymbolAction {

    @NotNull
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "selector", column = @Column(name = "DND_SOURCE_NODE_SELECTOR")),
            @AttributeOverride(name = "type", column = @Column(name = "DND_SOURCE_NODE_TYPE"))
    })
    private WebElementLocator sourceNode;

    @NotNull
    private int offsetX;

    @NotNull
    private int offsetY;

    public DragAndDropByAction() {
        this.offsetX = 0;
        this.offsetY = 0;
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator sourceNodeWithVariables =
                new WebElementLocator(insertVariableValues(sourceNode.getSelector()), sourceNode.getType());

        try {
            final WebElement source = connector.getElement(sourceNodeWithVariables);
            new Actions(connector.getDriver()).dragAndDropBy(source, offsetX, offsetY).build().perform();
            logger.info(LoggerMarkers.LEARNER, "Drag element '({})' by ({}, {}).", source, offsetX, offsetY);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            logger.info(LoggerMarkers.LEARNER, "Could not perform drag and drop");
            return getFailedOutput();
        }
    }

    public WebElementLocator getSourceNode() {
        return sourceNode;
    }

    public void setSourceNode(WebElementLocator sourceNode) {
        this.sourceNode = sourceNode;
    }

    public int getOffsetX() {
        return offsetX;
    }

    public void setOffsetX(int offsetX) {
        this.offsetX = offsetX;
    }

    public int getOffsetY() {
        return offsetY;
    }

    public void setOffsetY(int offsetY) {
        this.offsetY = offsetY;
    }
}
