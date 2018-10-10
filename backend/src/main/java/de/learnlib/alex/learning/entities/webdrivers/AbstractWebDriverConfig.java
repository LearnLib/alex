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

package de.learnlib.alex.learning.entities.webdrivers;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;

/**
 * The abstract web driver configuration class.
 */
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "name", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "name")
@JsonSubTypes({
        @JsonSubTypes.Type(name = WebDrivers.CHROME, value = ChromeDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.EDGE, value = EdgeDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.FIREFOX, value = FirefoxDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.HTML_UNIT, value = HtmlUnitDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.IE, value = IEDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.REMOTE, value = RemoteDriverConfig.class),
        @JsonSubTypes.Type(name = WebDrivers.SAFARI, value = SafariDriverConfig.class)
})
@JsonPropertyOrder(alphabetic = true)
public abstract class AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = -2663686839180427383L;

    /** The selenium implicit wait time. */
    private static final int DEFAULT_IMPLICITLY_WAIT = 0;

    /** How long should be waited for the page to load before a timeout. */
    private static final int DEFAULT_PAGE_LOAD_TIMEOUT = 10;

    /** How long should be waited for JavaScript to execute before a timeout. */
    private static final int DEFAULT_SCRIPT_TIMEOUT = 10;

    /** The id of the config in the database. */
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    /** The width of the browser window. */
    @Min(value = 0)
    private int width;

    /** The height of the browser window. */
    @Min(value = 0)
    private int height;

    /** The implicit wait time for selenium. */
    private int implicitlyWait;

    /** The page load timeout time for selenium. */
    private int pageLoadTimeout;

    /** The script timeout time for selenium. */
    private int scriptTimeout;

    /**
     * Constructor.
     */
    public AbstractWebDriverConfig() {
        this.width = 0;
        this.height = 0;
        this.implicitlyWait = DEFAULT_IMPLICITLY_WAIT;
        this.pageLoadTimeout = DEFAULT_PAGE_LOAD_TIMEOUT;
        this.scriptTimeout = DEFAULT_SCRIPT_TIMEOUT;
    }

    /**
     * Creates a new instance of a web driver.
     *
     * @return The new web driver.
     * @throws Exception
     *         If the instantiation of the web driver fails.
     */
    public abstract WebDriver createDriver() throws Exception;

    /**
     * Handle timeouts and browser dimensions.
     *
     * @param driver
     *         The web driver.
     */
    protected void manage(final WebDriver driver) {
        driver.manage().timeouts().pageLoadTimeout(pageLoadTimeout, TimeUnit.SECONDS);
        driver.manage().timeouts().setScriptTimeout(scriptTimeout, TimeUnit.SECONDS);

        if (implicitlyWait > 0) {
            driver.manage().timeouts().implicitlyWait(implicitlyWait, TimeUnit.SECONDS);
        }

        if (height > 0 && width > 0) {
            driver.manage().window().setSize(new Dimension(width, height));
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width < 0 ? 0 : width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height < 0 ? 0 : height;
    }

    public int getImplicitlyWait() {
        return implicitlyWait;
    }

    public void setImplicitlyWait(int implicitlyWait) {
        this.implicitlyWait = implicitlyWait < 0 ? 0 : implicitlyWait;
    }

    public int getPageLoadTimeout() {
        return pageLoadTimeout;
    }

    public void setPageLoadTimeout(int pageLoadTimeout) {
        this.pageLoadTimeout = pageLoadTimeout < 0 ? 0 : pageLoadTimeout;
    }

    public int getScriptTimeout() {
        return scriptTimeout;
    }

    public void setScriptTimeout(int scriptTimeout) {
        this.scriptTimeout = scriptTimeout < 0 ? 0 : scriptTimeout;
    }
}
