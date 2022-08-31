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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.net.URL;
import java.time.Duration;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.opera.OperaOptions;
import org.openqa.selenium.remote.AbstractDriverOptions;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariOptions;

/**
 * The abstract web driver configuration class.
 */
@Entity
public class WebDriverConfig implements Serializable {

    private static final long serialVersionUID = -2663686839180427383L;

    /** The selenium implicit wait time. */
    private static final int DEFAULT_IMPLICITLY_WAIT = 0;

    /** How long should be waited for the page to load before a timeout. */
    private static final int DEFAULT_PAGE_LOAD_TIMEOUT = 10;

    /** How long should be waited for JavaScript to execute before a timeout. */
    private static final int DEFAULT_SCRIPT_TIMEOUT = 10;

    /** The id of the config in the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    /** The width of the browser window. */
    @Min(value = 0)
    private int width;

    /** The height of the browser window. */
    @Min(value = 0)
    private int height;

    /** The implicit wait time for selenium. */
    private int implicitlyWait;

    /** The page load timeout time for selenium. */
    private int pageLoadTimeout;

    /** The script timeout time for selenium. */
    private int scriptTimeout;

    /** The target platform. */
    @NotNull
    private Platform platform;

    /** The browser to run the tests in. */
    @NotBlank
    private String browser;

    /** The browser version. */
    @NotNull
    private String version;

    /** If the browser should be executed in headless mode. */
    @NotNull
    private boolean headless;

    /**
     * Constructor.
     */
    public WebDriverConfig() {
        this.width = 0;
        this.height = 0;
        this.implicitlyWait = DEFAULT_IMPLICITLY_WAIT;
        this.pageLoadTimeout = DEFAULT_PAGE_LOAD_TIMEOUT;
        this.scriptTimeout = DEFAULT_SCRIPT_TIMEOUT;
        this.version = "";
        this.platform = Platform.ANY;
        this.headless = false;
    }

    /**
     * Creates a new instance of a web driver.
     *
     * @return The new web driver.
     * @throws Exception
     *         If the instantiation of the web driver fails.
     */
    public WebDriver createWebDriver() throws Exception {
        final URL remoteURL = new URL(System.getProperty("webdriver.remote.url"));

        final AbstractDriverOptions<?> options;

        switch (browser) {
            case "chrome" -> {
                final var chromeOptions = new ChromeOptions();
                chromeOptions.setHeadless(headless);
                options = chromeOptions;
            }
            case "firefox" -> {
                final FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.setHeadless(headless);
                options = firefoxOptions;
            }
            case "msedge" -> options = new EdgeOptions();
            case "opera" -> options = new OperaOptions();
            case "safari" -> options = new SafariOptions();
            default -> throw new IllegalArgumentException("Invalid browser specified");
        }

        options.setPlatformName(platform.toString());
        options.setAcceptInsecureCerts(true);

        if (!version.trim().equals("")) {
            options.setBrowserVersion(version);
        }

        final var driver = new RemoteWebDriver(remoteURL, options);
        driver.setFileDetector(new LocalFileDetector());
        manage(driver);
        return driver;
    }

    /**
     * Handle timeouts and browser dimensions.
     *
     * @param driver
     *         The web driver.
     */
    protected void manage(final WebDriver driver) {
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(pageLoadTimeout));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(scriptTimeout));

        if (implicitlyWait > 0) {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitlyWait));
        }

        if (height > 0 && width > 0) {
            driver.manage().window().setSize(new Dimension(width, height));
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = Math.max(width, 0);
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = Math.max(height, 0);
    }

    public int getImplicitlyWait() {
        return implicitlyWait;
    }

    public void setImplicitlyWait(int implicitlyWait) {
        this.implicitlyWait = Math.max(implicitlyWait, 0);
    }

    public int getPageLoadTimeout() {
        return pageLoadTimeout;
    }

    public void setPageLoadTimeout(int pageLoadTimeout) {
        this.pageLoadTimeout = Math.max(pageLoadTimeout, 0);
    }

    public int getScriptTimeout() {
        return scriptTimeout;
    }

    public void setScriptTimeout(int scriptTimeout) {
        this.scriptTimeout = Math.max(scriptTimeout, 0);
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
