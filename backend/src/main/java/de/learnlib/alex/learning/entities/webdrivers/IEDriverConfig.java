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

import com.fasterxml.jackson.annotation.JsonTypeName;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.ie.InternetExplorerDriverEngine;
import org.openqa.selenium.ie.InternetExplorerDriverService;
import org.openqa.selenium.ie.InternetExplorerOptions;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.Serializable;

/** Configuration for the Internet Explorer. */
@Entity
@DiscriminatorValue(WebDrivers.IE)
@JsonTypeName(WebDrivers.IE)
public class IEDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = 4012974840750197467L;

    /** Constructor. */
    public IEDriverConfig() {
        super();
    }

    @Override
    public WebDriver createDriver() throws Exception {
        final InternetExplorerOptions options = new InternetExplorerOptions()
                .introduceFlakinessByIgnoringSecurityDomains();

        final InternetExplorerDriverService service = new InternetExplorerDriverService.Builder()
                .withEngineImplementation(InternetExplorerDriverEngine.AUTODETECT)
                .usingAnyFreePort()
                .build();

        final WebDriver driver = new InternetExplorerDriver(service, options);
        manage(driver);

        return driver;
    }
}
