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

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to enter a text into a specific element.
 */
@Entity
@DiscriminatorValue("web_fill")
@JsonTypeName("web_fill")
public class FillAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 8595076806577663223L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The node to look for.
     * @requiredField
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    protected String node;

    /**
     * The Value to insert.
     * @requiredField
     */
    @NotBlank
    protected String value;

    /**
     * Get the node to look for.
     *
     * @return The node to look for.
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
     * Set the node to check for.
     *
     * @param node
     *         The new node to check for.
     */
    public void setNode(String node) {
        this.node = node;
    }

    /**
     * Get the value used to fill the element.
     * 
     * @return The value.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the value used to fill the element.
     * All variables and counters will be replaced with their values.
     *
     * @return The value.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the value to be used when filling the element.
     * 
     * @param value
     *            The new value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        String nodeWithVariables = getNodeWithVariableValues();
        String valueWithVariables = getValueWithVariableValues();
        try {
            WebElement element = connector.getElement(CSSUtils.escapeSelector(nodeWithVariables));
            element.clear();
            element.sendKeys(valueWithVariables);

            LOGGER.info("Filled the element '{}' with {}'(ignoreFailure: {}, negated: {}).",
                        node, value, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not find the element '{}' to fill it with '{}' "
                                            + "(ignoreFailure: {}, negated: {}).",
                        nodeWithVariables, valueWithVariables, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

}
