/*
 * Copyright 2015 - 2020 TU Dortmund
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
import org.openqa.selenium.safari.SafariDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.Serializable;

/**
 * The configuration for the safari driver.
 */
@Entity
@DiscriminatorValue(WebDrivers.SAFARI)
@JsonTypeName(WebDrivers.SAFARI)
public class SafariDriverConfig extends AbstractWebDriverConfig implements Serializable {

    private static final long serialVersionUID = -6373881745025564267L;

    @Override
    public WebDriver createDriver() throws Exception {
        final WebDriver driver = new SafariDriver();
        manage(driver);
        return driver;
    }
}
