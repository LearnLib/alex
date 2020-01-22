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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.regex.Pattern;

/**
 * Action to wait for a text to be present on the page.
 */
@Entity
@DiscriminatorValue("web_waitForText")
@JsonTypeName("web_waitForText")
public class WaitForTextAction extends WebSymbolAction {

    private static final long serialVersionUID = -7420326002014507646L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The string or pattern to look for.
     */
    @NotBlank
    @Column(name = "\"value\"", columnDefinition = "MEDIUMTEXT")
    private String value;

    /**
     * If the text is interpreted as a regular expression.
     */
    @NotNull
    @Column(name = "\"regexp\"")
    private boolean regexp;

    /**
     * The element to look for the text. The whole document is used by default.
     */
    @NotNull
    private WebElementLocator node;

    /**
     * The time to wait before a timeout.
     */
    @NotNull
    @Min(0)
    private long maxWaitTime;

    /**
     * Constructor.
     */
    public WaitForTextAction() {
        this.regexp = false;
        this.node = new WebElementLocator();
        this.node.setSelector("body");
        this.node.setType(WebElementLocator.Type.CSS);
        this.maxWaitTime = 1;
    }

    @Override
    protected ExecuteResult execute(final WebSiteConnector connector) {
        final WebDriverWait wait = new WebDriverWait(connector.getDriver(), maxWaitTime);

        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());
        final String valueWithVariables = insertVariableValues(value);

        try {
            if (regexp) {
                LOGGER.info(LoggerMarkers.LEARNER, "Waiting for pattern '{}' to be present in node '{}' for a maximum of "
                        + "{}ms.", valueWithVariables, nodeWithVariables, maxWaitTime);
                wait.until(wd -> {
                    final String text = connector.getElement(nodeWithVariables).getText();
                    return Pattern.compile(value).matcher(text).find();
                });
            } else {
                LOGGER.info(LoggerMarkers.LEARNER, "Waiting for text '{}' to be present in node '{}' for a maximum of {}ms.",
                        valueWithVariables, nodeWithVariables, maxWaitTime);
                wait.until(wd -> connector.getElement(nodeWithVariables).getText().contains(valueWithVariables));
            }

            return getSuccessOutput();
        } catch (NoSuchElementException | TimeoutException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Waiting for text/patter '{}' to be present in node '{}' failed.",
                    valueWithVariables, nodeWithVariables);
            return getFailedOutput();
        }
    }

    public String getValue() {
        return value;
    }

    public void setValue(String text) {
        this.value = text;
    }

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regex) {
        this.regexp = regex;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    public long getMaxWaitTime() {
        return maxWaitTime;
    }

    public void setMaxWaitTime(long maxWaitTime) {
        this.maxWaitTime = maxWaitTime;
    }
}
