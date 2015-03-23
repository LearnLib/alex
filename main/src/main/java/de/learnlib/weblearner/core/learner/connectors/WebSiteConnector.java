package de.learnlib.weblearner.core.learner.connectors;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import de.learnlib.weblearner.core.learner.BaseUrlManager;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import java.util.concurrent.TimeUnit;

/**
 * Connector to communicate with a WebSite.
 * This is a facade around Seleniums {@link WebDriver}.
 */
public class WebSiteConnector implements Connector {

    /** How long we should wait before doing the next step. Introduced by Selenium. */
    private static final int IMPLICITLY_WATI_TIME = 1;

    /** Max. time to wait for a request before timing out. Introduced by Selenium. */
    private static final int PAGE_LOAD_TIMEOUT_TIME = 30;

    /** The driver used to send and receive data to a WebSite. */
    private WebDriver driver;

    /** A managed base url to use. */
    private BaseUrlManager baseUrl;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The new base url to use for further request. All request will be based on this!
     */
    public WebSiteConnector(String baseUrl) {
        this.baseUrl = new BaseUrlManager(baseUrl);

        this.driver = new HtmlUnitDriver(BrowserVersion.FIREFOX_24);
        this.driver.manage().timeouts().implicitlyWait(IMPLICITLY_WATI_TIME, TimeUnit.SECONDS);
        this.driver.manage().timeouts().pageLoadTimeout(PAGE_LOAD_TIMEOUT_TIME, TimeUnit.SECONDS);
    }

    /**
     * Try to clear all data from the browser, including Cookies, local storage & session storage.
     */
    void clearBrowserData() {
        this.driver.manage().deleteAllCookies();

        try {
            JavascriptExecutor javascriptExecutor = (JavascriptExecutor) this.driver;
            javascriptExecutor.executeScript("localStorage.clear();");
            javascriptExecutor.executeScript("sessionStorage.clear();");
        } catch (UnsupportedOperationException e) {
            // JavaScript is not enabled in the Driver
            // -> assume that localStorage and sessionStorage are not available and therefor must not be cleared.
        }
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

}
