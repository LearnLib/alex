/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.utils.ExecuteScriptUtils;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.WebDriverWait;

@Entity
@DiscriminatorValue("web_waitForScript")
@JsonTypeName("web_waitForScript")
public class WaitForScriptAction extends SymbolAction {

    private static final long serialVersionUID = 5692261035639937573L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final int DEFAULT_SCRIPT_TIMEOUT = 10;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String script;

    /** When the script should be timed out in s. */
    @NotNull
    @Min(value = 0)
    private int timeout = DEFAULT_SCRIPT_TIMEOUT;

    /** The time to wait before a timeout. */
    @NotNull
    @Min(0)
    private long maxWaitTime;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        final WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        if (webSiteConnector.getDriver() instanceof JavascriptExecutor) {
            final WebDriverWait wait = new WebDriverWait(webSiteConnector.getDriver(), maxWaitTime);

            try {
                webSiteConnector.getDriver().manage().timeouts().setScriptTimeout(timeout, TimeUnit.SECONDS);

                final Map<String, Map<String, ? extends Object>> store = ExecuteScriptUtils.createScriptStore(connector);
                final Object returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeScript(script, store);
                if (!(returnValue instanceof Boolean)) {
                    LOGGER.info(LoggerMarkers.LEARNER, "Script does not return boolean result.");
                    return getFailedOutput();
                }

                wait.until(wd -> {
                    final Object val = ((JavascriptExecutor) webSiteConnector.getDriver()).executeScript(script, store);
                    return (boolean) val;
                });

                LOGGER.info(LoggerMarkers.LEARNER, "Waiting for JavaScript success");
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

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public long getMaxWaitTime() {
        return maxWaitTime;
    }

    public void setMaxWaitTime(long maxWaitTime) {
        this.maxWaitTime = maxWaitTime;
    }
}
