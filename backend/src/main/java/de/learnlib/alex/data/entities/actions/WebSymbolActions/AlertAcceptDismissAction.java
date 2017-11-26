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
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Accepts or dismisses the current window alert.
 */
@Entity
@DiscriminatorValue("web_alertAcceptDismiss")
@JsonTypeName("web_alertAcceptDismiss")
public class AlertAcceptDismissAction extends WebSymbolAction {

    private static final long serialVersionUID = 194831141591117765L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The actions for an alert. */
    public enum Action {
        ACCEPT, DISMISS
    }

    /** The action to take with the alert. */
    private Action action;

    @Override
    protected ExecuteResult execute(final WebSiteConnector connector) {
        try {
            final Alert alert = connector.getDriver().switchTo().alert();

            if (this.action == Action.ACCEPT) {
                alert.accept();

                LOGGER.info(LEARNER_MARKER, "Accept alert window (ignoreFailure: {}, negated: {}).",
                            ignoreFailure, negated);
            } else {
                alert.dismiss();

                LOGGER.info(LEARNER_MARKER, "Dismiss alert window (ignoreFailure: {}, negated: {}).",
                            ignoreFailure, negated);
            }

            return getSuccessOutput();
        } catch (NoAlertPresentException e) {
            LOGGER.info(LEARNER_MARKER, "Failed accept or dismiss alert window (ignoreFailure: {}, negated: {}).",
                        ignoreFailure, negated);

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
