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

package de.learnlib.alex.data.entities.actions.misc;

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
import org.openqa.selenium.JavascriptExecutor;

@Entity
@DiscriminatorValue("jumpToLabel")
@JsonTypeName("jumpToLabel")
public class JumpToLabelAction extends SymbolAction {

    @NotBlank
    private String label;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String script;

    @NotNull
    private boolean async = false;

    @NotNull
    @Min(value = 0)
    private int timeout = 10;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        final WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        if (webSiteConnector.getDriver() instanceof JavascriptExecutor) {

            final Map<String, Map<String, ? extends Object>> store = ExecuteScriptUtils.createScriptStore(connector);

            try {
                webSiteConnector.getDriver().manage().timeouts().setScriptTimeout(timeout, TimeUnit.SECONDS);

                final Object returnValue;
                if (async) {
                    returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeAsyncScript(script, store);
                } else {
                    returnValue = ((JavascriptExecutor) webSiteConnector.getDriver()).executeScript(script, store);
                }

                if (!(returnValue instanceof Boolean)) {
                    logger.info(LoggerMarkers.LEARNER, "Result of jump condition is not a boolean value.");
                    return getFailedOutput();
                } else {
                    final boolean canJump = (Boolean) returnValue;
                    if (canJump) {
                        logger.info(LoggerMarkers.LEARNER, "Jump to label '{}'.", label);
                        return getSuccessOutput();
                    } else {
                        logger.info(LoggerMarkers.LEARNER, "Jump condition for label '" + label + "' not satisfied.");
                        return getFailedOutput();
                    }
                }
            } catch (Exception e) {
                logger.info(LoggerMarkers.LEARNER, "Could not execute JavaScript", e);
                return getFailedOutput();
            }
        } else {
            logger.info(LoggerMarkers.LEARNER, "This driver does not support JavaScript!");
            return getFailedOutput();
        }
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
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
