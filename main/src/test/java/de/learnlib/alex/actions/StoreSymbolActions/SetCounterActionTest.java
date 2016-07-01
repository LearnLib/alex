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
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SetCounterActionTest {

    private static final Long USER_ID = 3L;
    private static final Long PROJECT_ID = 10L;
    private static final String TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;

    @Mock
    private User user;

    @Mock
    private Project project;

    private SetCounterAction setAction;

    @Before
    public void setUp() {
        given(user.getId()).willReturn(USER_ID);
        given(project.getId()).willReturn(PROJECT_ID);

        setAction = new SetCounterAction();
        setAction.setUser(user);
        setAction.setProject(project);
        setAction.setName(TEST_NAME);
        setAction.setValue(TEST_VALUE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetCounterAction declareAction2 = (SetCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/SetCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetCounterAction);
        SetCounterAction objAsAction = (SetCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheCounterValue() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).set(USER_ID, PROJECT_ID, TEST_NAME, TEST_VALUE);
    }


}
