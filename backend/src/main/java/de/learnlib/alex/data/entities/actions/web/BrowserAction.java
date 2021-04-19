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
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/** Action for doing something with the browser window. */
@Entity
@DiscriminatorValue("web_browser")
@JsonTypeName("web_browser")
public class BrowserAction extends WebSymbolAction {

    /** What to to with the open browser window. */
    public enum Action {

        /** If the browser should be restarted. */
        RESTART,

        /** If the browser window should be refreshed. */
        REFRESH
    }

    /** The action to execute on the browser window. */
    @Column(name = "browser_action")
    @NotNull
    private Action action;

    /** Constructor. */
    public BrowserAction() {
        this.action = Action.RESTART;
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        try {
            switch (action) {
                case RESTART:
                    connector.restart();
                    logger.info(LoggerMarkers.LEARNER, "Restart browser.");
                    break;
                case REFRESH:
                    connector.refresh();
                    logger.info(LoggerMarkers.LEARNER, "Refresh browser.");
                    break;
                default:
                    throw new Exception("Invalid browser action.");
            }
            return getSuccessOutput();
        } catch (Exception e) {
            logger.info(LoggerMarkers.LEARNER, "Browser could not be refreshed or restarted.", e);
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
