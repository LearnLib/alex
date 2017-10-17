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

package de.learnlib.alex.data.entities;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.actions.WebSymbolActions.CheckTextWebAction;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class SymbolTest {

    private WebSiteConnector webSiteConnector;
    private ConnectorManager connectorManager;

    private Symbol symbol;

    private CheckTextWebAction a1;

    @Before
    public void setUp() {
        User user = new User(1L);
        Project project = new Project(1L);

        a1 = new CheckTextWebAction();
        a1.setUser(user);
        a1.setProject(project);
        a1.setDisabled(false);
        a1.setIgnoreFailure(false);
        a1.setRegexp(false);
        a1.setValue("test");

        symbol = new Symbol();
        symbol.addAction(a1);

        connectorManager = mock(ConnectorManager.class);
        webSiteConnector = mock(WebSiteConnector.class);

        given(connectorManager.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
    }

    @Test
    public void itShouldReturnOkOnSuccessAndNoCustomOutput() {
        given(webSiteConnector.getPageSource()).willReturn("test");

        ExecuteResult result = symbol.execute(connectorManager);

        assertEquals(result, ExecuteResult.OK);
        assertEquals(result.getOutput(), ExecuteResult.DEFAULT_SUCCESS_OUTPUT);
    }

    @Test
    public void itShouldReturnACustomOutputOnSuccess() {
        String output = "success";

        given(webSiteConnector.getPageSource()).willReturn("test");

        symbol.setSuccessOutput(output);
        ExecuteResult result = symbol.execute(connectorManager);

        assertEquals(result, ExecuteResult.OK);
        assertEquals(result.getOutput(), output);
    }

    @Test
    public void itShouldReturnFailedOnErrorAndNoCustomOutput() {
        // let the first action fail
        given(webSiteConnector.getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertEquals(result, ExecuteResult.FAILED);
        assertEquals(result.getOutput(), ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)");
    }

    @Test
    public void itShouldReturnCustomOutputOnError() {
        String output = "textNotFound";
        a1.setErrorOutput(output);

        // let the first action fail
        given(webSiteConnector.getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertEquals(result, ExecuteResult.FAILED);
        assertEquals(result.getOutput(), output);
    }
}
