package de.learnlib.alex.core.learner.connectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import de.learnlib.alex.core.entities.BrowserConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.lang.reflect.Field;
import java.util.concurrent.TimeUnit;

/**
 * Enum to select the browser used by Selenium.
 */
public enum WebBrowser {

    /** Use Google Chrome. */
    CHROME(ChromeDriver.class),

    /** Use Mozilla Firefox. */
    FIREFOX(FirefoxDriver.class),

    /** Simple & headless browser. This is the default driver. */
    HTMLUNITDRIVER(HtmlUnitDriver.class),

    /** Use Microsoft Edge. */
    EDGE(EdgeDriver.class);

    private static final Logger LOGGER = LogManager.getLogger();

    /** How often the browser should be restarted on error. */
    private static final int MAX_RETRIES = 5;

    /** Selenium page load timeout. */
    private static final int PAGE_LOAD_TIMEOUT = 10;

    /** Selenium script timeout. */
    private static final int SCRIPT_TIMEOUT = 10;

    /** How long the current Thread should sleep if the browser has to be restarted. */
    private static final int SLEEP_TIME = 1;

    /** The connected WebDriver class. */
    private Class webDriverClass;

    /**
     * Constructor.
     *
     * @param webDriverClass The class of the webDriver to instantiate.
     */
    WebBrowser(Class webDriverClass) {
        this.webDriverClass = webDriverClass;
    }

    /**
     * Get the enum type of a web browser from a string.
     *
     * @param name The name of the web browser.
     * @return The corresponding WebBrowser enum type.
     * @throws IllegalArgumentException
     *          If an unsupported WebDriver string has been used.
     */
    @JsonCreator
    public static WebBrowser fromString(String name) throws IllegalArgumentException {
        return WebBrowser.valueOf(name.toUpperCase());
    }

    @Override
    @JsonValue
    public String toString() {
        return name().toLowerCase();
    }

    /**
     * Create an instance of a web driver given by the given class.
     *
     * @param config The browser config.
     * @return An instance of a web driver.
     * @throws Exception
     *          If the instantiation of the driver failed.
     */
    public WebDriver getWebDriver(BrowserConfig config) throws Exception {
        int retries = 0;
        while (retries < MAX_RETRIES) {
            WebDriver driver = null;

            try {
                switch (this) {
                    case HTMLUNITDRIVER:
                        driver = new HtmlUnitDriver(BrowserVersion.BEST_SUPPORTED);
                        enableJavaScript((HtmlUnitDriver) driver);
                        break;
                    case CHROME:
                        ChromeOptions chromeOptions = new ChromeOptions();
                        chromeOptions.addArguments("--no-sandbox");

                        DesiredCapabilities chromeCapabilities = DesiredCapabilities.chrome();
                        chromeCapabilities.setCapability("recreateChromeDriverSessions", true);
                        chromeCapabilities.setCapability("chromeOptions", chromeOptions);

                        driver = new ChromeDriver(chromeCapabilities);
                        break;
                    case FIREFOX:
                        DesiredCapabilities firefoxCapabilities = DesiredCapabilities.firefox();
                        driver = new FirefoxDriver(firefoxCapabilities);
                        break;
                    case EDGE:
                        DesiredCapabilities edgeCapabilities = DesiredCapabilities.edge();
                        driver = new EdgeDriver(edgeCapabilities);
                        break;
                    default:
                        throw new Exception("Unsupported Webdriver");
                }

                if (retries > 0) {
                    TimeUnit.SECONDS.sleep(SLEEP_TIME);
                }

                driver.manage().timeouts().pageLoadTimeout(PAGE_LOAD_TIMEOUT, TimeUnit.SECONDS);
                driver.manage().timeouts().setScriptTimeout(SCRIPT_TIMEOUT, TimeUnit.SECONDS);

                if (config.getHeight() != 0 && config.getWidth() != 0) {
                    driver.manage().window().setSize(new Dimension(config.getWidth(), config.getHeight()));
                }

                return driver;
            } catch (Exception e) {
                LOGGER.warn("Could not create a WebDriver.", e);
                if (driver != null) {
                    driver.quit();
                }
            }

            retries++;
        }

        throw new Exception("Could not create a WebDriver");
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
