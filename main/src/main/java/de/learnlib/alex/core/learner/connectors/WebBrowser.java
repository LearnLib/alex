package de.learnlib.alex.core.learner.connectors;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

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


    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("leaner");

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
