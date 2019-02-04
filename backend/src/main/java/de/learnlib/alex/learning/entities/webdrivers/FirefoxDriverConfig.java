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

package de.learnlib.alex.learning.entities.webdrivers;

import com.fasterxml.jackson.annotation.JsonTypeName;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.GeckoDriverService;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * The configuration for the firefox driver.
 */
@Entity
@DiscriminatorValue(WebDrivers.FIREFOX)
@JsonTypeName(WebDrivers.FIREFOX)
public class FirefoxDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = -1487299662080444595L;

    /** If firefox should run in headless mode. */
    private boolean headless;

    /**
     * Constructor.
     */
    public FirefoxDriverConfig() {
        super();
        this.headless = false;
    }

    @Override
    public WebDriver createDriver() throws Exception {
        final FirefoxBinary binary = new FirefoxBinary();
        if (headless) {
            binary.addCommandLineOptions("-headless");
        }

        final Map<String, String> environmentVariables = new HashMap<>();
        final WebDriver driver = new FirefoxDriver(
                new GeckoDriverService.Builder()
                        .usingFirefoxBinary(binary)
                        .withEnvironment(environmentVariables)
                        .build()
        );
        manage(driver);

        return driver;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }

}
