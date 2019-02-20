/*
 * Copyright 2015 - 2019 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.gargoylesoftware.htmlunit.BrowserVersion;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.Serializable;

/**
 * The config for the html unit driver.
 */
@Entity
@DiscriminatorValue(WebDrivers.HTML_UNIT)
@JsonTypeName(WebDrivers.HTML_UNIT)
public class HtmlUnitDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = -7275962148556242118L;

    @Override
    public WebDriver createDriver() throws Exception {
        final HtmlUnitDriver driver = new HtmlUnitDriver(BrowserVersion.BEST_SUPPORTED);
        driver.setJavascriptEnabled(true);
        manage(driver);
        return driver;
    }
}
