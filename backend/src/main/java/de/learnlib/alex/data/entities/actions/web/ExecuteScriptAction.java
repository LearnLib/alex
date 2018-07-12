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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.List;

/**
 * Action to execute JavaScript on the opened browser.
 */
@Entity
@DiscriminatorValue("web_executeScript")
@JsonTypeName("web_executeScript")
public class ExecuteScriptAction extends SymbolAction {

    private static final long serialVersionUID = 6118333853615934954L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The javascript to execute.
     */
    @NotBlank
    @Column(columnDefinition = "MEDIUMTEXT")
    private String script;

    /**
     * The name of the variable to store the result into.
     */
    private String name;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);
        VariableStoreConnector variableStoreConnector = connector.getConnector(VariableStoreConnector.class);

        if (webSiteConnector.getDriver() instanceof JavascriptExecutor) {
            Object returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeScript(script);

            if (name != null) {
                if (returnValue == null) {
                    variableStoreConnector.set(name, "null");
                } else if (returnValue instanceof Double || returnValue instanceof Long
                        || returnValue instanceof Boolean) {
                    variableStoreConnector.set(name, String.valueOf(returnValue));
                } else if (returnValue instanceof WebElement || returnValue instanceof List) {
                    LOGGER.info(LoggerMarkers.LEARNER, "WebElements and lists as return values are not supported.");
                    return getFailedOutput();
                } else {
                    variableStoreConnector.set(name, (String) returnValue);
                }
            }

            LOGGER.info(LoggerMarkers.LEARNER, "JavaScript {} successfully executed (ignoreFailure: {}, negated: {}).",
                    ignoreFailure, negated);
            return getSuccessOutput();
        } else {
            LOGGER.info(LoggerMarkers.LEARNER, "This driver does not support JavaScript (ignoreFailure: {}, negated: {})!",
                    ignoreFailure, negated);
            return getFailedOutput();
        }
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
