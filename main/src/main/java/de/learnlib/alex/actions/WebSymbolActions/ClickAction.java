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

package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.CSSUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to click on a specific element.
 */
@Entity
@DiscriminatorValue("web_click")
@JsonTypeName("web_click")
public class ClickAction extends WebSymbolAction {

    /**
     * to be serializable.
     */
    private static final long serialVersionUID = -9158530821188611940L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The information to identify the element.
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String node;

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
    public String getNode() {
        return node;
    }

    /**
     * Get the node to look for.
     * All variables and counters will be replaced with their values.
     *
     * @return The node to look for.
     */
    @JsonIgnore
    public String getNodeWithVariableValues() {
        return insertVariableValues(node);
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
    public void setNode(String node) {
        this.node = node;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            WebElement element = connector.getElement(CSSUtils.escapeSelector(getNodeWithVariableValues()));
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
