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
import org.openqa.selenium.NoAlertPresentException;

/**
 * Accepts or dismisses the current window alert.
 */
@Entity
@DiscriminatorValue("web_alertAcceptDismiss")
@JsonTypeName("web_alertAcceptDismiss")
public class AlertAcceptDismissAction extends WebSymbolAction {

    /** The actions for an alert. */
    public enum Action {

        /** If the alert should be accepted. */
        ACCEPT,

        /** If the alert should be dismissed. */
        DISMISS
    }

    /** The action to take with the alert. */
    @NotNull
    private Action action;

    /** Constructor. */
    public AlertAcceptDismissAction() {
        this.action = Action.DISMISS;
    }

    @Override
    protected ExecuteResult execute(final WebSiteConnector connector) {
        try {
            final Alert alert = connector.getDriver().switchTo().alert();

            if (this.action == Action.ACCEPT) {
                alert.accept();
                logger.info(LoggerMarkers.LEARNER, "Accept alert window.");
            } else {
                alert.dismiss();
                logger.info(LoggerMarkers.LEARNER, "Dismiss alert window.");
            }

            return getSuccessOutput();
        } catch (NoAlertPresentException e) {
            logger.info(LoggerMarkers.LEARNER, "Failed accept or dismiss alert window.");
            return getFailedOutput();
        }
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }
}
