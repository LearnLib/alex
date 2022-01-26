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
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.Alert;
import org.openqa.selenium.ElementNotSelectableException;
import org.openqa.selenium.NoAlertPresentException;

/**
 * Sends text to a prompt alert from window.prompt("...").
 */
@Entity
@DiscriminatorValue("web_alertSendKeys")
@JsonTypeName("web_alertSendKeys")
public class AlertSendKeysAction extends WebSymbolAction {

    /** The text to send to the prompt alert. */
    @NotNull
    private String text;

    @Override
    protected ExecuteResult execute(final WebSiteConnector connector) {
        try {
            final Alert alert = connector.getDriver().switchTo().alert();
            alert.sendKeys(insertVariableValues(text));
            alert.accept();

            logger.info(LoggerMarkers.LEARNER, "Send text '{}' to prompt window.", text);
            return getSuccessOutput();
        } catch (NoAlertPresentException | ElementNotSelectableException e) {
            logger.info(LoggerMarkers.LEARNER, "Failed to send text '{}' to prompt window.", text);
            return getFailedOutput();
        }
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
