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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.gargoylesoftware.htmlunit.ElementNotFoundException;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to check for a specific element/ a specific text.
 */
@Entity
@DiscriminatorValue("web_checkForText")
@JsonTypeName("web_checkForText")
public class CheckTextWebAction extends WebSymbolAction {

    private static final long serialVersionUID = -1212555673698070996L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The value the site is checked for. */
    @NotBlank
    private String value;

    /**
     * Field to determine if the search string is a regular expression. Only works while searching for text.
     */
    @NotNull
    private boolean regexp;

    /**
     * Search for text in a specific element.
     */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /**
     * Constructor.
     */
    public CheckTextWebAction() {
        this.regexp = false;
        this.node = new WebElementLocator("document", WebElementLocator.Type.CSS);
    }

    /**
     * Get the value to check.
     *
     * @return The value to check.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the value to check. All variables and counters will be replaced with their values.
     *
     * @return The value to check.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the value to check for.
     *
     * @param value
     *         The new value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Should the value be treated as regular expression while searching for a text?
     *
     * @return true, if value should be a regular expression: false otherwise.
     */
    public boolean isRegexp() {
        return regexp;
    }

    /**
     * Set the flag if the value is a regular expression for the text search.
     *
     * @param regexp
     *         true if value is a regular expression.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final String source;
            if (nodeWithVariables.getSelector().equals("document")) {
                source = connector.getPageSource();
            } else {
                source = connector.getElement(nodeWithVariables).getAttribute("innerHTML");
            }

            final boolean found = SearchHelper.search(getValueWithVariableValues(), source, regexp);

            LOGGER.info(LEARNER_MARKER, "Check if the current pages contains '{}' => {} "
                            + "(regExp: {}, ignoreFailure: {}, negated: {}).",
                    value, found, regexp, ignoreFailure, negated);

            return found ? getSuccessOutput() : getFailedOutput();
        } catch (ElementNotFoundException e) {
            LOGGER.error(LEARNER_MARKER, "Could not find text \"{}\" in element \"{}\""
                            + "(regExp: {}, ignoreFailure: {}, negated: {}).",
                    value, node.getSelector(), regexp, ignoreFailure, negated);

            return getFailedOutput();
        }
    }

}
