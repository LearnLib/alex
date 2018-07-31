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
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Action to execute JavaScript on the opened browser.
 */
@Entity
@DiscriminatorValue("web_executeScript")
@JsonTypeName("web_executeScript")
public class ExecuteScriptAction extends SymbolAction {

    private static final long serialVersionUID = 6118333853615934954L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** How long in seconds should be waited before the script times out. */
    private static final int DEFAULT_SCRIPT_TIMEOUT = 10;

    /** The JavaScript to execute. */
    @NotBlank
    @Column(columnDefinition = "MEDIUMTEXT")
    private String script;

    /** If the script should be executed asynchronously. */
    @NotNull
    private boolean async = false;

    /** When the script should be timed out in s. */
    @NotNull
    @Min(value = 0)
    private int timeout = DEFAULT_SCRIPT_TIMEOUT;

    /** The name of the variable to store the result into. */
    private String name;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);
        VariableStoreConnector variableStoreConnector = connector.getConnector(VariableStoreConnector.class);

        if (webSiteConnector.getDriver() instanceof JavascriptExecutor) {
            try {
                webSiteConnector.getDriver().manage().timeouts().setScriptTimeout(timeout, TimeUnit.SECONDS);

                final Object returnValue;
                if (async) {
                    returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeAsyncScript(script);
                } else {
                    returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeScript(script);
                }

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

                LOGGER.info(LoggerMarkers.LEARNER, "JavaScript {} successfully executed.");
                return getSuccessOutput();
            } catch (Exception e) {
                LOGGER.info(LoggerMarkers.LEARNER, "Could not execute JavaScript", e);
                return getFailedOutput();
            }
        } else {
            LOGGER.info(LoggerMarkers.LEARNER, "This driver does not support JavaScript!");
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

    public boolean isAsync() {
        return async;
    }

    public void setAsync(boolean async) {
        this.async = async;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
}
