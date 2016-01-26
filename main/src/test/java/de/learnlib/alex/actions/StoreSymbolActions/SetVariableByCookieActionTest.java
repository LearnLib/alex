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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;

import javax.ws.rs.core.NewCookie;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SetVariableByCookieActionTest {

    private static final String VARIABLE_NAME  = "foobar";

    private static final String COOKIE_NAME  = "cookie";
    private static final String COOKIE_VALUE = "hello world";

    private SetVariableByCookieAction setAction;

    @Before
    public void setUp() {
        setAction = new SetVariableByCookieAction();
        setAction.setName(VARIABLE_NAME);
        setAction.setValue(COOKIE_NAME);
        setAction.setCookieType(SetVariableByCookieAction.CookieType.WEB);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByCookieAction setAction2 = mapper.readValue(json, SetVariableByCookieAction.class);

        assertEquals(setAction.getName(), setAction2.getName());
        assertEquals(setAction.getValue(), setAction2.getValue());
        assertEquals(setAction.getCookieType(), setAction2.getCookieType());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByCookieTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByCookieAction);
        SetVariableByCookieAction objAsAction = (SetVariableByCookieAction) obj;
        assertEquals(VARIABLE_NAME, objAsAction.getName());
        assertEquals(COOKIE_NAME, objAsAction.getValue());
        assertEquals(SetVariableByCookieAction.CookieType.WEB, objAsAction.getCookieType());
    }

    @Test
    public void shouldSetTheVariableFromAnExistingWebCookie() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        Cookie cookie = mock(Cookie.class);
        given(cookie.getValue()).willReturn(COOKIE_VALUE);
        WebSiteConnector webSiteConnector = createWebSiteConnectorMock(cookie);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        setAction.execute(connector);

        verify(variables).set(VARIABLE_NAME, COOKIE_VALUE);
    }

    @Test
    public void shouldReturnFailedIfTheWebCookiesDoesNotExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        WebSiteConnector webSiteConnector = createWebSiteConnectorMock(null);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        setAction.execute(connector);

        verify(variables, never()).set(eq(VARIABLE_NAME), anyString());
    }

    private WebSiteConnector createWebSiteConnectorMock(Cookie cookie) {
        WebDriver.Options options = mock(WebDriver.Options.class);
        given(options.getCookieNamed(COOKIE_NAME)).willReturn(cookie);
        WebDriver driver = mock(WebDriver.class);
        given(driver.manage()).willReturn(options);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        return webSiteConnector;
    }

    @Test
    public void shouldSetTheVariableFromAnExistingRESTCookie() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        NewCookie cookie = mock(NewCookie.class);
        given(cookie.getValue()).willReturn(COOKIE_VALUE);
        WebServiceConnector webServiceConnector = createWebServiceConnectorMock(cookie);
        given(connector.getConnector(WebServiceConnector.class)).willReturn(webServiceConnector);
        setAction.setCookieType(SetVariableByCookieAction.CookieType.REST);

        setAction.execute(connector);

        verify(variables).set(VARIABLE_NAME, COOKIE_VALUE);
    }

    @Test
    public void shouldReturnFailedIfTheRESTCookiesDoesNotExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        WebServiceConnector webServiceConnector = createWebServiceConnectorMock(null);
        given(connector.getConnector(WebServiceConnector.class)).willReturn(webServiceConnector);
        setAction.setCookieType(SetVariableByCookieAction.CookieType.REST);

        setAction.execute(connector);

        verify(variables, never()).set(eq(VARIABLE_NAME), anyString());

    }

    private WebServiceConnector createWebServiceConnectorMock(NewCookie cookie) {
        Map<String, NewCookie> cookies = mock(Map.class);
        given(cookies.get(COOKIE_NAME)).willReturn(cookie);
        WebServiceConnector webServiceConnector = mock(WebServiceConnector.class);
        given(webServiceConnector.getCookies()).willReturn(cookies);
        return webServiceConnector;
    }

}
