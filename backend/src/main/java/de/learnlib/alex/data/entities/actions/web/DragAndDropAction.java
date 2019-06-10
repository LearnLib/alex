/*
 * Copyright 2015 - 2019 TU Dortmund
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

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Entity
@DiscriminatorValue("web_dragAndDrop")
@JsonTypeName("web_dragAndDrop")
public class DragAndDropAction extends WebSymbolAction {

    private static final long serialVersionUID = 8417345026318123297L;

    private static final Logger LOGGER = LogManager.getLogger();

    @NotNull
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "selector", column = @Column(name = "DND_SOURCE_NODE_SELECTOR")),
            @AttributeOverride(name = "type", column = @Column(name = "DND_SOURCE_NODE_TYPE"))
    })
    private WebElementLocator sourceNode;

    @NotNull
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "selector", column = @Column(name = "DND_TARGET_NODE_SELECTOR")),
            @AttributeOverride(name = "type", column = @Column(name = "DND_TARGET_NODE_TYPE"))
    })
    private WebElementLocator targetNode;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator sourceNodeWithVariables =
                new WebElementLocator(insertVariableValues(sourceNode.getSelector()), sourceNode.getType());

        final WebElementLocator targetNodeWithVariables =
                new WebElementLocator(insertVariableValues(targetNode.getSelector()), targetNode.getType());

        try {
            final WebElement source = connector.getElement(sourceNodeWithVariables);
            final WebElement target = connector.getElement(targetNodeWithVariables);
            new Actions(connector.getDriver()).dragAndDrop(source, target).build().perform();
            LOGGER.info(LoggerMarkers.LEARNER, "Drag element '({})' to element '({})'.", source, target);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not perform drag and drop");
            return getFailedOutput();
        }
    }

    public WebElementLocator getSourceNode() {
        return sourceNode;
    }

    public void setSourceNode(WebElementLocator sourceNode) {
        this.sourceNode = sourceNode;
    }

    public WebElementLocator getTargetNode() {
        return targetNode;
    }

    public void setTargetNode(WebElementLocator targetNode) {
        this.targetNode = targetNode;
    }
}
