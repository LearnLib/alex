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
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration for the chrome driver.
 */
@JsonTypeName(WebDrivers.CHROME)
public class ChromeDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = 814490091354608163L;

    /** If chrome should run headless. */
    private boolean headless;

    /** The xvfb display port. */
    private Integer xvfbPort;

    /**
     * Constructor.
     */
    public ChromeDriverConfig() {
        super();
        this.headless = false;
        this.xvfbPort = null;
    }

    @Override
    public WebDriver createDriver() throws Exception {
        final ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--no-sandbox");
        if (headless) {
            chromeOptions.setHeadless(true);
        }

        final Map<String, String> environmentVariables = new HashMap<>();
        if (!headless && xvfbPort != null) {
            environmentVariables.put("DISPLAY", ":" + String.valueOf(xvfbPort));
        }

        final ChromeDriverService service = new ChromeDriverService.Builder()
                .usingAnyFreePort()
                .withEnvironment(environmentVariables)
                .build();

        final WebDriver driver = new ChromeDriver(service, chromeOptions);
        manage(driver);

        return driver;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }

    public Integer getXvfbPort() {
        return xvfbPort;
    }

    public void setXvfbPort(Integer xvfbPort) {
        this.xvfbPort = xvfbPort;
    }
}
