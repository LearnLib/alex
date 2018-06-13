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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Action to click a specific element by its visible text.
 */
@Entity
@DiscriminatorValue("web_clickElementByText")
@JsonTypeName("web_clickElementByText")
public class ClickElementByTextAction extends WebSymbolAction {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** Search link in a specific element. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /** The tag name of the node, e.g. "button". */
    private String tagName;

    /** The visible text of the element. */
    @NotBlank
    private String text;

    /** Constructor. */
    public ClickElementByTextAction() {
        this.node = new WebElementLocator("body", WebElementLocator.Type.CSS);
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        final WebElement root = connector.getElement(nodeWithVariables);
        final String textWithVariables = insertVariableValues(text);

        final List<WebElement> candidates;
        if (tagName == null || tagName.trim().equals("")) {
            candidates = root.findElements(By.xpath("//text()[normalize-space() = '" + textWithVariables + "']"));
        } else {
            candidates = root.findElements(By.tagName(tagName));
        }

        try {
            if (candidates.isEmpty()) {
                throw new NoSuchElementException("No candidate with text '" + textWithVariables + "' found.");
            }

            for (final WebElement candidate : candidates) {
                final boolean hasText = candidate.getText().trim().equals(textWithVariables);
                if (candidate.isDisplayed() && candidate.isEnabled() && hasText) {
                    candidate.click();

                    LOGGER.info(LEARNER_MARKER, "Click on element '{}' with text '{}' "
                                    + "(ignoreFailure: {}, negated: {}).", tagName, text, ignoreFailure, negated);
                    return getSuccessOutput();
                }
            }
            throw new NoSuchElementException("No clickable element found.");
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not click on element '{}' with text '{}' "
                            + "(ignoreFailure: {}, negated: {}).", tagName, text, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
