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

package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.JavascriptExecutor;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to execute JavaScript on the opened browser.
 */
@Entity
@DiscriminatorValue("web_executeScript")
@JsonTypeName("web_executeScript")
public class ExecuteScriptAction extends WebSymbolAction {

    /**
     * to be serializable.
     */
    private static final long serialVersionUID = 6118333853615934954L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The javascript to execute.
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String script;

    /**
     * Get the script to execute.
     *
     * @return The script to execute.
     */
    public String getScript() {
        return script;
    }

    /**
     * Set the script to execute.
     *
     * @param script The script to execute.
     */
    public void setScript(String script) {
        this.script = script;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        if (connector.getDriver() instanceof JavascriptExecutor) {
            ((JavascriptExecutor) connector.getDriver()).executeScript(script);

            LOGGER.info(LEARNER_MARKER, "JavaScript {} successfully executed (ignoreFailure: {}, negated: {}).",
                        ignoreFailure, negated);
            return getSuccessOutput();
        } else {
            LOGGER.info(LEARNER_MARKER, "This driver does not support JavaScript (ignoreFailure: {}, negated: {})!",
                        ignoreFailure, negated);
            return getFailedOutput();
        }
    }
}
