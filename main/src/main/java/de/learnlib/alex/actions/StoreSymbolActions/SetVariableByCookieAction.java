/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.ws.rs.core.NewCookie;
import java.util.Map;

/**
 * Action to set the value of a variable based on a response cookie.
 */
@Entity
@DiscriminatorValue("setVariableByCookie")
@JsonTypeName("setVariableByCookie")
public class SetVariableByCookieAction extends SetVariableAction {

    /**
     * Enum to differentiate web & REST cookies.
     */
    private enum CookieType {
        /** Cookies from or to a web interface. */
        WEB,

        /** Cookies from or to an REST interface. */
        REST
    }

    /**
     * The type of the cookie. Either by selenium cookie or from a http request.
     *
     * @requiredField
     */
    private CookieType cookieType;

    public CookieType getCookieType() {
        return cookieType;
    }

    public void setCookieType(CookieType t) {
        cookieType = t;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            String value = null;

            if (cookieType == CookieType.WEB) {
                Cookie cookie = webSiteConnector.getDriver().manage().getCookieNamed(value);
                if (cookie != null) {
                    value = cookie.getValue();
                }
            } else if (cookieType == CookieType.REST) {
                Map<String, NewCookie> cookies = webServiceConnector.getCookies();
                javax.ws.rs.core.Cookie cookie = cookies.get(value);
                if (cookie != null) {
                    value = cookies.get(value).getValue();
                }
            } else {
                return getFailedOutput();
            }

            if (value != null) {
                storeConnector.set(name, value);
                return getSuccessOutput();
            } else {
                return getFailedOutput();
            }
        } catch (IllegalStateException | NoSuchElementException e) {
            return getFailedOutput();
        }
    }
}
