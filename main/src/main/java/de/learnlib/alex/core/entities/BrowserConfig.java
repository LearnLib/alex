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

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.connectors.WebBrowser;

import javax.persistence.Embeddable;

/** Helper class for the web driver. */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class BrowserConfig {

    /** The driver that is used. */
    private WebBrowser driver;

    /** The browser width. */
    private Integer width;

    /** The browser height. */
    private Integer height;

    /** The port for the virtual xvfb display. Only works with linux. */
    private Integer xvfbDisplayPort;

    /** Run the web driver in headless mode, if supported. */
    private boolean headless;

    /** Constructor. */
    public BrowserConfig() {
        this.driver = WebBrowser.HTMLUNITDRIVER;
        this.headless = false;
        this.width = 0;
        this.height = 0;
    }

    public WebBrowser getDriver() {
        return driver;
    }

    public void setDriver(WebBrowser driver) {
        this.driver = driver;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width < 0 ? 0 : width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height < 0 ? 0 : height;
    }

    public Integer getXvfbDisplayPort() {
        return xvfbDisplayPort;
    }

    public void setXvfbDisplayPort(Integer xvfbDisplayPort) {
        this.xvfbDisplayPort = xvfbDisplayPort;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }
}
