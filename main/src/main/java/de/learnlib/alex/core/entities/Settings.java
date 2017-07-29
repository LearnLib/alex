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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.connectors.WebBrowser;

import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.ValidationException;
import java.io.File;
import java.io.Serializable;

/**
 * The settings entity.
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class Settings implements Serializable {

    /** To be serialized. */
    private static final long serialVersionUID = -4417681626093036478L;

    /** The id of the settings object in the database. */
    @Id
    private Long id = 1L;

    /** The settings regarding available web drivers. */
    @Embedded
    private DriverSettings driverSettings;

    /**
     * The entity for web driver settings.
     * Each browser property should match the lowercase version
     * of {@link de.learnlib.alex.core.learner.connectors.WebBrowser}
     */
    @Embeddable
    @JsonPropertyOrder(alphabetic = true)
    public static class DriverSettings implements Serializable {

        /** To be serialized. */
        private static final long serialVersionUID = -4199641230344018378L;

        /** The path to the chrome driver executable. */
        private String chrome;

        /** The path to the gecko driver executable. */
        private String firefox;

        /** The path to the edge driver executable. */
        private String edge;

        /** The default driver to use. */
        private WebBrowser defaultDriver;

        /** Constructor. */
        public DriverSettings() {
            this.defaultDriver = WebBrowser.HTMLUNITDRIVER;
        }

        /**
         * Constructor.
         *
         * @param chrome {@link DriverSettings#chrome}
         * @param firefox {@link DriverSettings#firefox}
         * @param edge {@link DriverSettings#edge}
         */
        public DriverSettings(String chrome, String firefox, String edge) {
            this();
            this.chrome = chrome;
            this.firefox = firefox;
            this.edge = edge;
        }

        /**
         * Get the chrome driver executable path.
         *
         * @return The executable path.
         */
        public String getChrome() {
            return chrome;
        }

        /**
         * Set the chromdriver executable path.
         *
         * @param chrome {@link DriverSettings#chrome}
         */
        public void setChrome(String chrome) {
            this.chrome = chrome;
        }

        /**
         * Get geckodriver executable path.
         *
         * @return The executable path.
         */
        public String getFirefox() {
            return firefox;
        }

        /**
         * Set the geckodriver executable path.
         *
         * @param firefox {@link DriverSettings#firefox}
         */
        public void setFirefox(String firefox) {
            this.firefox = firefox;
        }

        /**
         * Get the edge driver executable path.
         *
         * @return The executable path.
         */
        public String getEdge() {
            return edge;
        }

        /**
         * Set the edge driver executable path.
         *
         * @param edge {@link DriverSettings#edge}
         */
        public void setEdge(String edge) {
            this.edge = edge;
        }

        public WebBrowser getDefaultDriver() {
            return defaultDriver;
        }

        public void setDefaultDriver(WebBrowser defaultDriver) {
            this.defaultDriver = defaultDriver;
        }

        /**
         * Checks the validity of the settings object.
         *
         * @throws ValidationException
         *          If the executable cannot be found or is not executable.
         */
        public void checkValidity() throws ValidationException {
            checkDriver(firefox, "geckodriver", WebBrowser.FIREFOX);
            checkDriver(chrome, "chromedriver", WebBrowser.CHROME);
            checkDriver(edge, "edgedriver", WebBrowser.EDGE);
        }

        private void checkDriver(String executable, String name, WebBrowser webBrowser) throws ValidationException {
            if (!executable.trim().equals("")) {
                File driverExecutable = new File(executable);
                if (!driverExecutable.exists()) {
                    throw new ValidationException("The " + name  + " cannot be found.");
                } else if (!driverExecutable.canExecute()) {
                    throw new ValidationException("The " + name + " is not executable.");
                }
            } else if (webBrowser.equals(defaultDriver)) {
                throw new ValidationException("The default web browser cannot be " + webBrowser + " because the driver "
                                                      + "is not specified.");
            }
        }

        //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces - auto generated by IntelliJ IDEA
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            DriverSettings that = (DriverSettings) o;

            if (chrome != null ? !chrome.equals(that.chrome) : that.chrome != null) return false;
            return firefox != null ? firefox.equals(that.firefox) : that.firefox == null;

        }

        @Override
        public int hashCode() {
            int result = chrome != null ? chrome.hashCode() : 0;
            result = 31 * result + (firefox != null ? firefox.hashCode() : 0);
            return result;
        }
        // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces
    }

    /** Constructor. */
    public Settings() {
        this.driverSettings = new DriverSettings("", "", "");
    }

    /**
     * Get the driver settings.
     *
     * @return {@link DriverSettings}
     */
    @JsonProperty("driver")
    public DriverSettings getDriverSettings() {
        return driverSettings;
    }

    /**
     * Set the id.
     *
     * @param id {@link Settings#id}
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the id.
     *
     * @return {@link Settings#id}
     */
    public Long getId() {
        return id;
    }

    /**
     * Set the driver settings.
     *
     * @param driverSettings {@link DriverSettings}
     */
    @JsonProperty("driver")
    public void setDriverSettings(DriverSettings driverSettings) {
        this.driverSettings = driverSettings;
    }

    /**
     * Checks the validity of the setting object.
     *
     * @throws ValidationException
     *          If some settings are not valid.
     */
    public void checkValidity() throws ValidationException {
        this.driverSettings.checkValidity();
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Settings settings = (Settings) o;

        if (id != null ? !id.equals(settings.id) : settings.id != null) return false;
        return driverSettings != null ? driverSettings.equals(settings.driverSettings) : settings.driverSettings == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (driverSettings != null ? driverSettings.hashCode() : 0);
        return result;
    }
    // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|LineLength|NeedBraces
}
