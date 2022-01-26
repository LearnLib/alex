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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.apache.commons.text.StringEscapeUtils;
import org.openqa.selenium.NoSuchElementException;

/**
 * Action to check for a specific element/ a specific text.
 */
@Entity
@DiscriminatorValue("web_checkForText")
@JsonTypeName("web_checkForText")
public class CheckTextWebAction extends WebSymbolAction {

    /** The value the site is checked for. */
    @NotBlank
    @Column(name = "\"value\"")
    private String value;

    /**
     * Field to determine if the search string is a regular expression. Only works while searching for text.
     */
    @NotNull
    @Column(name = "\"regexp\"")
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

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final String source;
            if (nodeWithVariables.getSelector().equals("document")) {
                source = connector.getDriver().getPageSource();
            } else {
                source = connector.getElement(nodeWithVariables).getAttribute("innerHTML");
            }

            final String htmlEscapedValue = StringEscapeUtils.escapeHtml4(getValueWithVariableValues());
            final boolean found = SearchHelper.search(htmlEscapedValue, source, regexp);

            logger.info(LoggerMarkers.LEARNER, "Check if the current pages contains '{}' => {} (regExp: {}).",
                    value, found, regexp);

            return found ? getSuccessOutput() : getFailedOutput();
        } catch (NoSuchElementException e) {
            logger.error(LoggerMarkers.LEARNER, "Could not find text '{}' in element '{}' (regExp: {}).",
                    value, node.getSelector(), regexp);
            return getFailedOutput();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Failed to search for text '{}' in element '{}' (regExp: {}).",
                    value, node.getSelector(), regexp, e);
            return getFailedOutput();
        }
    }

    public String getValue() {
        return value;
    }

    @JsonIgnore
    @Transient
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

}
