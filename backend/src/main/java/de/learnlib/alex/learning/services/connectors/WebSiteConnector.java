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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.common.utils.CSSUtils;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.data.entities.actions.Credentials;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.services.BaseUrlManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Connector to communicate with a WebSite. This is a facade around Seleniums {@link WebDriver}.
 */
public class WebSiteConnector implements Connector {

    private static final Logger LOGGER = LogManager.getLogger();

    /** How often it should be tried to navigate to a given URL. */
    private static final int MAX_RETRIES = 10;

    /** The browser to use. */
    private AbstractWebDriverConfig driverConfig;

    /** A managed base url to use. */
    private BaseUrlManager baseUrl;

    /** The driver used to send and receive data to a WebSite. */
    private WebDriver driver;

    /** The last visited frame. */
    private WebElement lastFrame = null;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The new base url to use for further request. All request will be based on this!
     * @param driverConfig
     *         The driver config to use for further request.
     */
    public WebSiteConnector(String baseUrl, AbstractWebDriverConfig driverConfig) {
        this.baseUrl = new BaseUrlManager(baseUrl);
        this.driverConfig = driverConfig;
    }

    @Override
    public void reset() throws Exception {
        if (this.driver == null) {
            this.driver = driverConfig.createDriver();
        }
    }

    @Override
    public void dispose() {
        if (driver != null) {
            driver.manage().deleteAllCookies();
            if (driver instanceof JavascriptExecutor) {
                final JavascriptExecutor js = (JavascriptExecutor) driver;
                js.executeScript("window.localStorage.clear();");
                js.executeScript("window.sessionStorage.clear();");
            }
        }
    }

    @Override
    public void post() {
        if (driver != null) {
            driver.quit();
        }
    }

    /** Refreshes the browser window. */
    public void refresh() {
        if (this.driver != null) {
            this.driver.navigate().refresh();
        }
    }

    /**
     * Restarts the browser.
     *
     * @throws Exception
     *         In case something during the instantiation of the browser goes wrong.
     */
    public void restart() throws Exception {
        if (this.driver != null) {
            this.driver.quit();
            this.driver = driverConfig.createDriver();
        }
    }

    /**
     * Do a HTTP GET request within the browser. Optionally credentials for HTTP Basic Auth can be provided.
     *
     * @param path
     *         The path to send the request to.
     * @param credentials
     *         The credential to use. Can be null.
     * @throws Exception
     *         If the application could not connect to the web driver.
     */
    public void get(String path, Credentials credentials) throws Exception {
        String url = getAbsoluteUrl(path, credentials);
        int numRetries = 0;
        while (numRetries < MAX_RETRIES) {
            try {
                driver.navigate().to(url);
                break;
            } catch (Exception e1) {
                LOGGER.warn(LoggerMarkers.LEARNER, "Failed to get URL", e1);

                numRetries++;
                try {
                    restart();
                    TimeUnit.SECONDS.sleep(1);
                } catch (Exception e2) {
                    LOGGER.warn(LoggerMarkers.LEARNER, "Failed to dispose", e2);
                }
            }
        }

        if (numRetries == MAX_RETRIES) {
            throw new Exception("Error connecting with the web driver.");
        }
    }

    /**
     * Get a {@link WebElement} from the site using a valid css query.
     *
     * @param locator
     *         The query to search for the element.
     * @return A WebElement.
     * @throws NoSuchElementException
     *         If no element was found.
     */
    public WebElement getElement(WebElementLocator locator) throws NoSuchElementException {
        switch (locator.getType()) {
            case XPATH:
                return driver.findElement(By.xpath(locator.getSelector()));
            case CSS:
                return driver.findElement(By.cssSelector(CSSUtils.escapeSelector(locator.getSelector())));
            case JS:
                if (driver instanceof JavascriptExecutor) {
                    try {
                        return (WebElement) ((JavascriptExecutor) driver).executeScript(locator.getSelector());
                    } catch (ClassCastException e) {
                        throw new NoSuchElementException("Return result is not a WebElement");
                    }
                }
            default:
                throw new NoSuchElementException("Invalid selector type");
        }
    }

    /**
     * Same as {@link #getElement(WebElementLocator)} but returns a list of web elements.
     *
     * @param locator
     *         The query to search for the element.
     * @return A list of elements.
     * @throws NoSuchElementException
     *         If no element was found.
     */
    public List<WebElement> getElements(WebElementLocator locator) throws NoSuchElementException {
        if (locator.getType().equals(WebElementLocator.Type.CSS)) {
            return driver.findElements(By.cssSelector(CSSUtils.escapeSelector(locator.getSelector())));
        } else {
            return driver.findElements(By.xpath(locator.getSelector()));
        }
    }

    /**
     * Get a Get a {@link WebElement} of a link by its visible text.
     *
     * @param text
     *         The visible text of the link to look for.
     * @return The link with the text.
     * @throws NoSuchElementException
     *         If no Element was found.
     */
    public WebElement getLinkByText(String text) throws NoSuchElementException {
        return driver.findElement(By.linkText(text));
    }

    /**
     * Get the source code of the current page.
     *
     * @return The code of the page.
     */
    public String getPageSource() {
        return driver.getPageSource();
    }

    /**
     * Get the base url of the API to call. All requests will be based on this!
     *
     * @return The base url for all the requests.
     * @see BaseUrlManager#getBaseUrl()
     */
    public String getBaseUrl() {
        return baseUrl.getBaseUrl();
    }

    /**
     * @param path
     *         The path to append on the base url.
     * @param credentials
     *         The credentials to use for HTTP Basic Auth. Can be null.
     * @return An absolute URL as String
     * @see BaseUrlManager#getAbsoluteUrl(String)
     */
    private String getAbsoluteUrl(String path, Credentials credentials) {
        return baseUrl.getAbsoluteUrl(path, credentials);
    }

    /** @return The browser config. */
    public AbstractWebDriverConfig getBrowser() {
        return driverConfig;
    }

    /**
     * Get the currently used web driver.
     *
     * @return the current web driver
     */
    public WebDriver getDriver() {
        return driver;
    }

    public WebElement getLastFrame() {
        return lastFrame;
    }

    public void setLastFrame(WebElement lastFrame) {
        this.lastFrame = lastFrame;
    }
}
