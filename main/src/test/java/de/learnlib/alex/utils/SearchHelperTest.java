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

package de.learnlib.alex.utils;

import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SearchHelperTest {

    private static final Long USER_ID = 10L;
    private static final Long PROJECT_ID = 10L;
    private static final int COUNTER_VALUE = 42;
    private static final String PROJECT_URL = "http://localhost:8000";

    @Test
    public void shouldReplaceVariablesCorrectly() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(variables.get("name")).willReturn("Jon Doe");
        CounterStoreConnector counter = mock(CounterStoreConnector.class);
        given(counter.get(PROJECT_URL, "counter")).willReturn(COUNTER_VALUE);
        ConnectorManager connector = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counter);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        String result = SearchHelper.insertVariableValues(connector, USER_ID, PROJECT_ID,
                                                          "Hello {{$name}}, you are {{user}} no. {{#counter}}!");

        assertEquals("Hello Jon Doe, you are {{user}} no. " + COUNTER_VALUE + "!", result);
    }

    @Test
    public void shouldNotReplaceAnythingIfTextContainsNoVariables() {
        ConnectorManager connector = mock(ConnectorManager.class);

        String result = SearchHelper.insertVariableValues(connector, USER_ID, PROJECT_ID,
                                                          "Hello Jon Doe, you are user no. 42!");

        assertEquals("Hello Jon Doe, you are user no. " + COUNTER_VALUE + "!", result);
        verify(connector, never()).getConnector(any(Class.class));
    }
}
