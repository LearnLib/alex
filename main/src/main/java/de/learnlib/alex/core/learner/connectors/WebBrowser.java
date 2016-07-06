package de.learnlib.alex.core.learner.connectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import de.learnlib.alex.core.dao.SettingsDAOImpl;
import de.learnlib.alex.core.entities.Settings;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.MarionetteDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

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
    HTMLUNITDRIVER(HtmlUnitDriver.class);


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
     * @return An instance of a web driver.
     * @throws Exception
     *          If the instantiation of the driver failed.
     */
    public WebDriver getWebDriver() throws Exception {
        try {
            switch (this) {
                case HTMLUNITDRIVER:
                    HtmlUnitDriver driver = new HtmlUnitDriver(BrowserVersion.BEST_SUPPORTED);
                    enableJavaScript(driver);
                    return driver;
                case CHROME:
                    DesiredCapabilities chromeCapabilities = DesiredCapabilities.chrome();
                    return new ChromeDriver(chromeCapabilities);
                case FIREFOX:
                    DesiredCapabilities firefoxCapabilities = DesiredCapabilities.firefox();
                    return new MarionetteDriver(firefoxCapabilities);
                default:
                    throw new Exception();
            }
        } catch (Exception e) {
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
