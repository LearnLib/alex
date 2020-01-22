/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Action to click on a link by its visible link.
 */
@Entity
@DiscriminatorValue("web_clickLinkByText")
@JsonTypeName("web_clickLinkByText")
public class ClickLinkAction extends WebSymbolAction {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The value the site is checked for. */
    @NotBlank
    @Column(name = "\"value\"")
    private String value;

    /**
     * Search link in a specific element.
     */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /**
     * Constructor.
     */
    public ClickLinkAction() {
        this.node = new WebElementLocator("body", WebElementLocator.Type.CSS);
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final String linkText = getValueWithVariableValues();

            final WebElement element = connector.getElement(nodeWithVariables)
                    .findElement(By.linkText(linkText));

            element.click();

            LOGGER.info(LoggerMarkers.LEARNER, "Clicked on link '{}'.", value);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not click on link '{}'.", value, e);
            return getFailedOutput();
        }
    }

    public String getValue() {
        return value;
    }

    /**
     * Get the value to check. All variables and counters will be replaced with their values.
     *
     * @return The value to check.
     */
    @Transient
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    public void setValue(String value) {
        this.value = value;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }
}
