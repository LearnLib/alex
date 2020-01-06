/*
 * Copyright 2015 - 2020 TU Dortmund
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
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.net.URL;

/**
 * The configuration for the remote driver.
 */
@Entity
@DiscriminatorValue(WebDrivers.REMOTE)
@JsonTypeName(WebDrivers.REMOTE)
public class RemoteDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = 2167429360722715825L;

    /**
     * The target platform.
     */
    @NotNull
    private Platform platform;

    /**
     * The browser to run the tests in.
     */
    @NotBlank
    private String browser;

    /**
     * The browser version.
     */
    @NotNull
    private String version;

    /**
     * If the browser should be executed in headless mode.
     */
    @NotNull
    private boolean headless;

    /**
     * Constructor.
     */
    public RemoteDriverConfig() {
        super();
        this.version = "";
        this.platform = Platform.ANY;
        this.headless = false;
    }

    @Override
    public WebDriver createDriver() throws Exception {
        final URL remoteURL = new URL(System.getProperty("webdriver.remote.url"));

        final DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setPlatform(platform);
        capabilities.setBrowserName(browser);

        switch (browser) {
            case "chrome":
                final ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.setHeadless(headless);
                capabilities.merge(chromeOptions);
                break;
            case "firefox":
                final FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.setHeadless(headless);
                capabilities.merge(firefoxOptions);
                break;
            default:
                break;
        }

        if (!version.trim().equals("")) {
            capabilities.setVersion(version);
        }

        final WebDriver driver = new RemoteWebDriver(remoteURL, capabilities);
        manage(driver);
        return driver;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public boolean isHeadless() {
        return headless;
    }

    public void setHeadless(boolean headless) {
        this.headless = headless;
    }
}
