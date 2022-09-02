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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WindowType;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/** Action for doing something with the browser window. */
@Entity
@DiscriminatorValue("web_browser")
@JsonTypeName("web_browser")
public class BrowserAction extends WebSymbolAction {

    /** What to do with the open browser window. */
    public enum Action {

        /** If the browser should be restarted. */
        RESTART,

        /** If the browser window should be refreshed. */
        REFRESH,

        /** Create a new tab in the browser. */
        CREATE_TAB,

        /** Create a new browser window. */
        CREATE_WINDOW,

        /** Close the active tab. */
        CLOSE_TAB,

        /** Close the active window. */
        CLOSE_WINDOW
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
            final var wd = connector.getDriver();
            switch (action) {
                case RESTART -> {
                    logger.info(LoggerMarkers.LEARNER, "Restart browser.");
                    connector.restart();
                }
                case REFRESH -> {
                    logger.info(LoggerMarkers.LEARNER, "Refresh browser.");
                    connector.refresh();
                }
                case CREATE_TAB -> {
                    logger.info(LoggerMarkers.LEARNER, "Create a new tab.");
                    wd.switchTo().newWindow(WindowType.TAB);
                }
                case CREATE_WINDOW -> {
                    logger.info(LoggerMarkers.LEARNER, "Create a new window.");
                    wd.switchTo().newWindow(WindowType.WINDOW);
                }
                case CLOSE_TAB -> {
                    logger.info(LoggerMarkers.LEARNER, "Close the active tab.");
                    switchToMainWindow(wd);
                }
                case CLOSE_WINDOW -> {
                    logger.info(LoggerMarkers.LEARNER, "Close the active window.");
                    switchToMainWindow(wd);
                }
                default -> throw new Exception("Invalid browser action.");
            }
            return getSuccessOutput();
        } catch (Exception e) {
            logger.info(LoggerMarkers.LEARNER, "Browser action could not be performed.", e);
            return getFailedOutput();
        }
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    private void switchToMainWindow(WebDriver wd) {
        wd.close();
        final var mainHandle = wd.getWindowHandles().iterator().next();
        wd.switchTo().window(mainHandle);
    }
}
