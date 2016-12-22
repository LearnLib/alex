package de.learnlib.alex.core.learner.connectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import de.learnlib.alex.core.entities.BrowserConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.MarionetteDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.lang.reflect.Field;

/**
 * Enum to select the browser used by Selenium.
 */
public enum WebBrowser {

    /** Use Google Chrome. */
    CHROME(ChromeDriver.class),

    /** Use Mozilla Firefox. */
    FIREFOX(MarionetteDriver.class),

    /** Simple & headless browser. This is the default driver. */
    HTMLUNITDRIVER(HtmlUnitDriver.class),

    /** Use Microsoft Edge. */
    EDGE(EdgeDriver.class);


    private static final Logger LOGGER = LogManager.getLogger();

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
        try {
            WebDriver driver;
            switch (this) {
                case HTMLUNITDRIVER:
                    driver = new HtmlUnitDriver(BrowserVersion.BEST_SUPPORTED);
                    enableJavaScript((HtmlUnitDriver) driver);
                    break;
                case CHROME:
                    DesiredCapabilities chromeCapabilities = DesiredCapabilities.chrome();
                    driver = new ChromeDriver(chromeCapabilities);
                    break;
                case FIREFOX:
                    DesiredCapabilities firefoxCapabilities = DesiredCapabilities.firefox();
                    driver = new MarionetteDriver(firefoxCapabilities);
                    break;
                case EDGE:
                    DesiredCapabilities edgeCapabilities = DesiredCapabilities.edge();
                    driver = new EdgeDriver(edgeCapabilities);
                    break;
                default:
                    throw new Exception();
            }

            if (config.getHeight() != 0 && config.getWidth() != 0) {
                driver.manage().window().setSize(new Dimension(config.getWidth(), config.getHeight()));
            }

            // wait until the browser is loaded
            new WebDriverWait(driver, 10).until((ExpectedCondition<Boolean>) wd ->
                    ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete"));

            return driver;
        } catch (Throwable e) {
            LOGGER.warn("Could not create a WebDriver.", e);
            throw e;
        }
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
