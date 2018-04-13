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
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Saves the displayed text of a window.alert, window.confirm and window.prompt alert in a variable.
 */
@Entity
@DiscriminatorValue("web_alertGetText")
@JsonTypeName("web_alertGetText")
public class AlertGetTextAction extends SymbolAction {

    private static final long serialVersionUID = 3133661009325694262L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the variable to store the displayed text of the alert in. */
    @NotBlank
    private String variableName;

    @Override
    public ExecuteResult execute(final ConnectorManager connector) {
        final VariableStoreConnector variableStore = connector.getConnector(VariableStoreConnector.class);
        final WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            final Alert alert = webSiteConnector.getDriver().switchTo().alert();
            final String text = alert.getText();
            variableStore.set(variableName, text);

            LOGGER.info(LEARNER_MARKER, "Save text '{}' from alert to variable '{}' (ignoreFailure: {}, negated: {}).",
                        text, variableName, ignoreFailure, negated);

            return getSuccessOutput();
        } catch (NoAlertPresentException e) {
            LOGGER.info(LEARNER_MARKER, "Failed to get text from alert (ignoreFailure: {}, negated: {}).",
                        ignoreFailure, negated);

            return getFailedOutput();
        }
    }

    public String getVariableName() {
        return variableName;
    }

    public void setVariableName(String variableName) {
        this.variableName = variableName;
    }
}
