package de.learnlib.alex.core.learner.connectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import de.learnlib.alex.core.learner.BaseUrlManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.TimeUnit;

/**
 * Connector to communicate with a WebSite.
 * This is a facade around Seleniums {@link WebDriver}.
 */
public class WebSiteConnector implements Connector {

    /**
     * Enum to select the browser used by Selenium.
     */
    public enum WebBrowser {
        /** Use Mozilla Firefox. */
        FIREFOX(FirefoxDriver.class),

        /** Use Google Chrome. */
        CHROME(ChromeDriver.class),

        /** Use the Internet Explorer by Microsoft. */
        IE(InternetExplorerDriver.class),

        /** Simple & headless browser. This is the default driver. */
        HTMLUNITDRIVER(HtmlUnitDriver.class);

        /** The connected WebDriver class. */
        private Class webDriverClass;

        WebBrowser(Class webDriverClass) {
            this.webDriverClass = webDriverClass;
        }

        @JsonCreator
        public static WebBrowser fromString(String name) throws IllegalArgumentException {
            return WebBrowser.valueOf(name.toUpperCase());
        }

        @Override
        @JsonValue
        public String toString() {
            return name().toLowerCase();
        }

        public WebDriver getWebDriver() {
            try {
                if (this == HTMLUNITDRIVER) {
                    HtmlUnitDriver driver = (HtmlUnitDriver) webDriverClass.getConstructor(BrowserVersion.class)
                                                                           .newInstance(BrowserVersion.FIREFOX_38);
                    enableJavaScript(driver);
                    return driver;
                } else {
                    return (WebDriver) webDriverClass.getConstructor().newInstance();
                }
            // todo: logging and error handling
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            }

            return null;
        }

        /**
         * Solves issues with "wrong" or non strict JavaScript that is executed on the page (e.g. jQuery).
         * Uses reflections to get the private 'webClient' property from the UnitDriver and set the flag
         * to ignore js errors.
         */
        private void enableJavaScript(HtmlUnitDriver htmlUnitDriver) {
            try {
                LOGGER.debug("Try enabling JavaScript for the HTMLUnitDriver");
                htmlUnitDriver.setJavascriptEnabled(true);
                Field f = htmlUnitDriver.getClass().getDeclaredField("webClient");
                f.setAccessible(true);
                WebClient client = (WebClient) f.get(htmlUnitDriver);
                client.getOptions().setThrowExceptionOnScriptError(false);
            } catch (NoSuchFieldException e) {
                LOGGER.warn("Enabling JavaScript for the HTMLUnitDriver failed. "
                            + "Private Property 'webClient' does not exist", e);
            } catch (IllegalAccessException e) {
                LOGGER.warn("Enabling JavaScript for the HTMLUnitDriver failed. "
                            + "Problem accessing private 'webClient'", e);
            }
        }
    }

    /** How long we should wait before doing the next step. Introduced by Selenium. */
    private static final int IMPLICITLY_WAIT_TIME = 1;

    /** Max. time to wait for a request before timing out. Introduced by Selenium. */
    private static final int PAGE_LOAD_TIMEOUT_TIME = 30;

    /** Max. time to wait for JavaScript to load before aborting */
    private static final int JAVASCRIPT_LOADING_THRESHOLD = 5000; // 5 seconds

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("leaner");

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
