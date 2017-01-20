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

import com.gargoylesoftware.htmlunit.javascript.host.css.CSS;
import de.learnlib.alex.actions.Credentials;
import de.learnlib.alex.core.entities.BrowserConfig;
import de.learnlib.alex.core.entities.WebElementLocator;
import de.learnlib.alex.core.learner.BaseUrlManager;
import de.learnlib.alex.utils.CSSUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

/**
 * Connector to communicate with a WebSite.
 * This is a facade around Seleniums {@link WebDriver}.
 */
public class WebSiteConnector implements Connector {

    /** The browser to use. */
    private BrowserConfig browser;

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
    public WebSiteConnector(String baseUrl, BrowserConfig browser) {
        this.baseUrl = new BaseUrlManager(baseUrl);
        this.browser = browser;
    }

    /**
     * Try to clear all data from the browser, including Cookies, local storage & session storage.
     */
    @Override
    public void reset() throws Exception {
        this.driver = browser.getDriver().getWebDriver(browser);
    }

    @Override
    public void dispose() {
        this.driver.quit();
    }

    /**
     * Do a HTTP GET request within the browser.
     * Optionally credentials for HTTP Basic Auth can be provided.
     *
     * @param path
     *         The path to send the request to.
     * @param credentials
     *         The credential to use. Can be null.
     */
    public void get(String path, Credentials credentials) {
        String url = getAbsoluteUrl(path, credentials);
        driver.navigate().to(url);

        // wait until the browser is loaded
        if (driver instanceof JavascriptExecutor) {
            new WebDriverWait(driver, 10).until((ExpectedCondition<Boolean>) wd ->
                    ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete"));
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
        if (locator.getType().equals(WebElementLocator.Type.CSS)) {
            return driver.findElement(By.cssSelector(CSSUtils.escapeSelector(locator.getSelector())));
        } else {
            return driver.findElement(By.xpath(locator.getSelector()));
        }
    }

    /**
     * Same as {@link #getElement(WebElementLocator)} but returns a list of web elements.
     *
     * @param locator
     *          The query to search for the element.
     * @return  A list of elements.
     * @throws NoSuchElementException
     *          If no element was found.
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
     * @param credentials
     *         The credentials to use for HTTP Basic Auth. Can be null.
     *
     * @return An absolute URL as String
     * @see BaseUrlManager#getAbsoluteUrl(String)
     */
    private String getAbsoluteUrl(String path, Credentials credentials) {
        return baseUrl.getAbsoluteUrl(path, credentials);
    }

    /** @return The browser config. */
    public BrowserConfig getBrowser() {
        return browser;
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
