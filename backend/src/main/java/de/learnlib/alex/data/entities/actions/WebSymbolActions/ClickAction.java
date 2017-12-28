/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.data.entities.actions.WebSymbolActions;

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

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

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

    /**
     * Get the information to identify the element.
     *
     * @return The element identifier.
     */
    public WebElementLocator getNode() {
        return node;
    }

    /**
     * If a double click should be executed.
     *
     * @return The flag.
     */
    public boolean isDoubleClick() {
        return doubleClick;
    }

    /**
     * Set if a double click should be executed.
     *
     * @param doubleClick The flag.
     */
    public void setDoubleClick(boolean doubleClick) {
        this.doubleClick = doubleClick;
    }

    /**
     * Set the information to identify the element.
     *
     * @param node The new element identifier.
     */
    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            node.setSelector(insertVariableValues(node.getSelector()));
            WebElement element = connector.getElement(node);

            if (doubleClick) {
                new Actions(connector.getDriver()).doubleClick(element).build().perform();
            } else {
                element.click();
            }

            LOGGER.info(LEARNER_MARKER, "Clicked on the element '{}' "
                                            + "(doubleClick: {}, ignoreFailure: {}, negated: {}).",
                        node, doubleClick, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not click on the element '{}' "
                                            + "(doubleClick: {}, ignoreFailure: {}, negated: {}).",
                        node, doubleClick, ignoreFailure, negated);
            return getFailedOutput();
        }
    }
}
