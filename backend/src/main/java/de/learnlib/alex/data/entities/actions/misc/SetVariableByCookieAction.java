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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.NewCookie;
import java.util.Map;

/**
 * Action to set the value of a variable based on a response cookie.
 */
@Entity
@DiscriminatorValue("setVariableByCookie")
@JsonTypeName("setVariableByCookie")
public class SetVariableByCookieAction extends SetVariableAction {

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * Enum to differentiate web & REST cookies.
     */
    public enum CookieType {

        /** Cookies from or to a web interface. */
        WEB,

        /** Cookies from or to an REST interface. */
        REST;

        /**
         * Parser function to handle the enum names case insensitive.
         *
         * @param name
         *         The enum name.
         * @return The corresponding CookieType.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        @JsonCreator
        public static CookieType fromString(String name) throws IllegalArgumentException {
            return CookieType.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }

    }

    private static final long serialVersionUID = 5093001294341313128L;

    /**
     * The type of the cookie. Either by selenium cookie or from a http request.
     */
    @NotNull
    private CookieType cookieType;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            String cookieValue = null;

            if (cookieType == CookieType.WEB) {
                WebDriver driver = webSiteConnector.getDriver();
                WebDriver.Options manage = driver.manage();
                Cookie cookie = manage.getCookieNamed(value);
                if (cookie != null) {
                    cookieValue = cookie.getValue();
                }
            } else if (cookieType == CookieType.REST) {
                Map<String, NewCookie> cookies = webServiceConnector.getCookies();
                javax.ws.rs.core.Cookie cookie = cookies.get(value);
                if (cookie != null) {
                    cookieValue = cookie.getValue();
                }
            } else {
                LOGGER.warn(LoggerMarkers.LEARNER, "Could not set the variable '{}' to the cookie '{}' because the type '{}' is not supported!",
                        name, value, cookieType);
                return getFailedOutput();
            }

            if (cookieValue != null) {
                storeConnector.set(name, cookieValue);
                LOGGER.info(LoggerMarkers.LEARNER, "Set the variable '{}' to the value '{}' of the cookie '{}:{}' ",
                        name, cookieValue, cookieType, value);
                return getSuccessOutput();
            } else {
                LOGGER.info(LoggerMarkers.LEARNER, "Could not set the variable '{}' to the cookie '{}:{}' because the cookie was not found!",
                        name, cookieType, value);
                return getFailedOutput();
            }
        } catch (IllegalStateException | NoSuchElementException e) {
            LOGGER.warn(LoggerMarkers.LEARNER, "Could not set the variable '{}' to the cookie '{}' because of an error.",
                    name, value, e);
            return getFailedOutput();
        }
    }

    public CookieType getCookieType() {
        return cookieType;
    }

    public void setCookieType(CookieType type) {
        cookieType = type;
    }

}
