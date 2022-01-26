/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AssertCounterActionTest {

    private static final String TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;

    private AssertCounterAction assertAction;

    @BeforeEach
    public void setUp() {
        assertAction = new AssertCounterAction();
        assertAction.setName(TEST_NAME);
        assertAction.setValue(TEST_VALUE);
        assertAction.setOperator(AssertCounterAction.Operator.EQUAL);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(assertAction);
        AssertCounterAction assertAction2 = (AssertCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(assertAction.getName(), assertAction2.getName());
        assertEquals(assertAction.getValue(), assertAction2.getValue());
        assertEquals(assertAction.getOperator(), assertAction2.getOperator());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/AssertCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof AssertCounterAction);
        AssertCounterAction objAsAction = (AssertCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
        assertEquals(AssertCounterAction.Operator.EQUAL, objAsAction.getOperator());
    }

    @ParameterizedTest(name = "use counter value: \"{0}\", success: \"{1}\" for the test")
    @CsvSource({
            "41, true",
            "42, false",
            "43, false",
    })
    public void ensureThatLessWorks(int value, boolean success) {
        ensureThatOperatorWorks(AssertCounterAction.Operator.LESS_THAN, value, success);
    }

    @ParameterizedTest(name = "use counter value: \"{0}\", success: \"{1}\" for the test")
    @CsvSource({
            "41, true",
            "42, true",
            "43, false",
    })
    public void ensureThatLessOrEqualsWorks(int value, boolean success) {
        ensureThatOperatorWorks(AssertCounterAction.Operator.LESS_OR_EQUAL, value, success);
    }

    @ParameterizedTest(name = "use counter value: \"{0}\", success: \"{1}\" for the test")
    @CsvSource({
            "41, false",
            "42, true",
            "43, false",
    })
    public void ensureThatEqualsWorks(int value, boolean success) {
        ensureThatOperatorWorks(AssertCounterAction.Operator.EQUAL, value, success);
    }

    @ParameterizedTest(name = "use counter value: \"{0}\", success: \"{1}\" for the test")
    @CsvSource({
            "41, false",
            "42, true",
            "43, true",
    })
    public void ensureThatGreaterOrEqualsWorks(int value, boolean success) {
        ensureThatOperatorWorks(AssertCounterAction.Operator.GREATER_OR_EQUAL, value, success);
    }

    @ParameterizedTest(name = "use counter value: \"{0}\", success: \"{1}\" for the test")
    @CsvSource({
            "41, false",
            "42, false",
            "43, true",
    })
    public void ensureThatGreaterWorks(int value, boolean success) {
        ensureThatOperatorWorks(AssertCounterAction.Operator.GREATER_THAN, value, success);
    }

    private void ensureThatOperatorWorks(AssertCounterAction.Operator operator, int value, boolean success) {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(operator);

        given(counters.get(TEST_NAME)).willReturn(value);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals(success, result.isSuccess());
    }

}
