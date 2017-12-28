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

package de.learnlib.alex.data.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class AssertVariableActionTest {

    private static final String TEST_VALUE = "foobar";
    private static final String TEST_NAME = "variable";

    private AssertVariableAction assertAction;

    @Before
    public void setUp() {
        assertAction = new AssertVariableAction();
        assertAction.setName(TEST_NAME);
        assertAction.setValue(TEST_VALUE);
        assertAction.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(assertAction);
        AssertVariableAction assertAction2 = (AssertVariableAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(assertAction.getName(), assertAction2.getName());
        assertEquals(assertAction.getValue(), assertAction2.getValue());
        assertEquals(assertAction.isRegexp(), assertAction2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/AssertVariableTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof AssertVariableAction);
        AssertVariableAction objAsAction = (AssertVariableAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void ensureThatAssertingWithoutRegexWorks() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        // OK
        given(variables.get(TEST_NAME)).willReturn(TEST_VALUE);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals(ExecuteResult.OK, result);

        // not OK
        given(variables.get(TEST_NAME)).willReturn(TEST_VALUE + " - invalid");
        result = assertAction.execute(connector);
        assertEquals(ExecuteResult.FAILED, result);
    }


    @Test
    public void ensureThatAssertingWithRegexWorks() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        assertAction.setRegexp(true);
        assertAction.setValue("f[o]+bar");

        // OK
        given(variables.get(TEST_NAME)).willReturn(TEST_VALUE);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals(ExecuteResult.OK, result);

        // not OK
        given(variables.get(TEST_NAME)).willReturn(TEST_VALUE + " - invalid");
        result = assertAction.execute(connector);
        assertEquals(ExecuteResult.FAILED, result);
    }

}
