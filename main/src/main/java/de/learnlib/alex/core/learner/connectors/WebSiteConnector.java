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

package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.learner.BaseUrlManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.concurrent.TimeUnit;

/**
 * Connector to communicate with a WebSite.
 * This is a facade around Seleniums {@link WebDriver}.
 */
public class WebSiteConnector implements Connector {

    /** How long we should wait before doing the next step. Introduced by Selenium. */
    private static final int IMPLICITLY_WAIT_TIME = 1;

    /** Max. time to wait for a request before timing out. Introduced by Selenium. */
    private static final int PAGE_LOAD_TIMEOUT_TIME = 30;

    /** Max. time to wait for JavaScript to load before aborting */
    private static final int JAVASCRIPT_LOADING_THRESHOLD = 5000; // 5 seconds

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("leaner");

    /** The browser to use. */
    private WebBrowser browser;

    /** A managed base url to use. */
    private BaseUrlManager baseUrl;

    /** The driver used to send and receive data to a WebSite. */
    private WebDriver driver;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The new base url to use for further request. All request will be based on this!
     * @param browser
     *         The browser to use for further request.
     */
    public WebSiteConnector(String baseUrl, WebBrowser browser) {
        this.baseUrl = new BaseUrlManager(baseUrl);
        this.browser = browser;
    }

    /**
     * Try to clear all data from the browser, including Cookies, local storage & session storage.
     */
    @Override
    public void reset() {
        this.driver = browser.getWebDriver();
        this.driver.manage().timeouts().implicitlyWait(IMPLICITLY_WAIT_TIME, TimeUnit.SECONDS);
        this.driver.manage().timeouts().pageLoadTimeout(PAGE_LOAD_TIMEOUT_TIME, TimeUnit.SECONDS);
    }

    @Override
    public void dispose() {
        this.driver.close();
    }

    /**
     * Do a HTTP GET request.
     *
     * @param path
     *         The path to send the request to.
     */
    public void get(String path) {
        String url = getAbsoluteUrl(path);
        driver.get(url);

        // wait for page to have loaded everything
        // or cancel after a certain time has passed
        JavascriptExecutor js = (JavascriptExecutor) driver;
        String pageLoadStatus;
        long startTime = System.currentTimeMillis();
        long timePassed;
        do {
            pageLoadStatus = (String) js.executeScript("return document.readyState");
            timePassed = System.currentTimeMillis() - startTime;
        } while (!pageLoadStatus.equals("complete") && timePassed <= JAVASCRIPT_LOADING_THRESHOLD);
        LOGGER.debug("Page at {} loaded in {}ms (page load status: {}).", path, timePassed, pageLoadStatus);
    }

    /**
     * Get a {@link WebElement} from the site using a valid css query.
     *
     * @param query
     *         The query to search for the element.
     * @return A WebElement.
     * @throws NoSuchElementException
     *         If no Element was found.
     */
    public WebElement getElement(String query) throws NoSuchElementException {
        return driver.findElement(By.cssSelector(query));
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
     * @see BaseUrlManager#getBaseUrl()
     *
     * @return The base url for all the requests.
     */
    public String getBaseUrl() {
        return baseUrl.getBaseUrl();
    }

    /**
     * @param path
     *         The path to append on the base url.
     * @return An absolute URL as String
     * @see BaseUrlManager#getAbsoluteUrl(String)
     */
    private String getAbsoluteUrl(String path) {
        return baseUrl.getAbsoluteUrl(path);
    }

    /**
     * Get the currently used web driver.
     *
     * @return the current web driver
     */
    public WebDriver getDriver() {
        return driver;
    }
}
