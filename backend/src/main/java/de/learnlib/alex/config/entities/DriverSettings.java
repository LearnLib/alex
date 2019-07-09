/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.config.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.learning.entities.webdrivers.WebDrivers;

import javax.persistence.Embeddable;
import javax.validation.ValidationException;
import java.io.File;
import java.io.Serializable;
import java.util.Objects;

/**
 * The entity for web driver settings.
 */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class DriverSettings implements Serializable {

    /** To be serialized. */
    private static final long serialVersionUID = -4199641230344018378L;

    /** The path to the chrome driver executable. */
    private String chrome;

    /** The path to the gecko driver executable. */
    private String firefox;

    /** The path to the edge driver executable. */
    private String edge;

    /** The URL path to the Remote Selenium Server. */
    private String remote;

    /** The path to the internet explorer driver. */
    private String ie;

    /** The default driver to use. */
    private String defaultDriver;

    /** Constructor. */
    public DriverSettings() {
        this.defaultDriver = WebDrivers.HTML_UNIT;
    }

    /**
     * Constructor.
     *
     * @param chrome
     *         {@link DriverSettings#chrome}
     * @param firefox
     *         {@link DriverSettings#firefox}
     * @param edge
     *         {@link DriverSettings#edge}
     * @param remote
     *         {@link DriverSettings#remote}
     * @param ie
     * {@link DriverSettings#ie}
     */
    public DriverSettings(String chrome, String firefox, String edge, String remote, String ie) {
        this();
        this.chrome = chrome;
        this.firefox = firefox;
        this.edge = edge;
        this.remote = remote;
        this.ie = ie;
    }

    public String getChrome() {
        return chrome == null ? "" : chrome;
    }

    public void setChrome(String chrome) {
        this.chrome = chrome;
    }

    public String getFirefox() {
        return firefox == null ? "" : firefox;
    }

    public void setFirefox(String firefox) {
        this.firefox = firefox;
    }

    public String getEdge() {
        return edge == null ? "" : edge;
    }

    public void setEdge(String edge) {
        this.edge = edge;
    }

    public String getRemote() {
        return remote == null ? "" : remote;
    }

    public void setRemote(String remote) {
        this.remote = remote;
    }

    public String getIe() {
        return ie == null ? "" : ie;
    }

    public void setIe(String ie) {
        this.ie = ie;
    }

    public String getDefaultDriver() {
        return defaultDriver;
    }

    public void setDefaultDriver(String defaultDriver) {
        this.defaultDriver = defaultDriver;
    }

    /**
     * Checks the validity of the settings object.
     *
     * @throws ValidationException
     *         If the executable cannot be found or is not executable.
     */
    public void checkValidity() throws ValidationException {
        checkDriver(firefox, "geckodriver", WebDrivers.FIREFOX);
        checkDriver(chrome, "chromedriver", WebDrivers.CHROME);
        checkDriver(edge, "edgedriver", WebDrivers.EDGE);
        checkDriver(ie, "iedriver", WebDrivers.IE);

        if (!WebDrivers.asList().contains(defaultDriver)) {
            throw new ValidationException("You specified an invalid default driver.");
        }

        if (WebDrivers.REMOTE.equals(defaultDriver) && (remote == null || remote.trim().isEmpty())) {
            throw new ValidationException("The default Selenium Web Driver cannot be " + WebDrivers.REMOTE
                    + " because the Selenium Server URL is not specified.");
        }
    }

    private void checkDriver(String executable, String name, String webBrowser) throws ValidationException {
        if (executable != null && !executable.trim().isEmpty()) {
            File driverExecutable = new File(executable);
            if (!driverExecutable.exists()) {
                throw new ValidationException("The " + name + " cannot be found.");
            } else if (!driverExecutable.canExecute()) {
                throw new ValidationException("The " + name + " is not executable.");
            }
        } else if (webBrowser.equals(defaultDriver)) {
            throw new ValidationException("The default Selenium Web Driver cannot be " + webBrowser
                    + " because the driver executable is not specified.");
        }
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DriverSettings that = (DriverSettings) o;
        return Objects.equals(chrome, that.chrome) &&
                Objects.equals(firefox, that.firefox) &&
                Objects.equals(edge, that.edge) &&
                Objects.equals(remote, that.remote) &&
                Objects.equals(ie, that.ie) &&
                Objects.equals(defaultDriver, that.defaultDriver);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chrome, firefox, edge, remote, ie, defaultDriver);
    }
    // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces
}
