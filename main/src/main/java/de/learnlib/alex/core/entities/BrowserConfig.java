package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.connectors.WebBrowser;

import javax.persistence.Embeddable;

/** Helper class for the web driver. */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class BrowserConfig {

    /** The driver that is used. */
    private WebBrowser driver;

    /** The browser width. */
    private Integer width;

    /** The browser height. */
    private Integer height;

    /** Constructor. */
    public BrowserConfig() {
        this.driver = WebBrowser.HTMLUNITDRIVER;
    }

    /** @return {@link BrowserConfig#driver}. */
    public WebBrowser getDriver() {
        return driver;
    }

    /**
     * @param driver
     *         {@link BrowserConfig#driver}.
     */
    public void setDriver(WebBrowser driver) {
        this.driver = driver;
    }

    /** @return {@link BrowserConfig#width}. */
    public Integer getWidth() {
        return width;
    }

    /**
     * @param width
     *         {@link BrowserConfig#width}.
     */
    public void setWidth(Integer width) {
        this.width = width < 0 ? 0 : width;
    }

    /** @return {@link BrowserConfig#height}. */
    public Integer getHeight() {
        return height;
    }

    /**
     * @param height
     *         {@link BrowserConfig#height}.
     */
    public void setHeight(Integer height) {
        this.height = height < 0 ? 0 : height;
    }
}
