/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.common.utils;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.FileStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class SearchHelperTest {

    private static final Long PROJECT_ID = 10L;
    private static final int COUNTER_VALUE = 42;

    @Test
    public void shouldReplaceVariablesCorrectly() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(variables.get("name")).willReturn("Jon Doe");
        CounterStoreConnector counter = mock(CounterStoreConnector.class);
        given(counter.get("counter")).willReturn(COUNTER_VALUE);
        ConnectorManager connector = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        FileStoreConnector fileStoreConnector = mock(FileStoreConnector.class);
        given(fileStoreConnector.getAbsoluteFileLocation(PROJECT_ID, "file.txt")).willReturn("/dir/file.text");
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counter);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        given(connector.getConnector(FileStoreConnector.class)).willReturn(fileStoreConnector);

        String result =
                SearchHelper.insertVariableValues(connector, PROJECT_ID, "Hello {{$name}}, you are {{user}} no. {{#counter}} and want to upload file {{\\file.txt}} that belongs to {{$name}}!");

        assertEquals("Hello Jon Doe, you are {{user}} no. " + COUNTER_VALUE + " and want to upload file /dir/file.text that belongs to Jon Doe!", result);
    }

    @Test
    public void shouldNotReplaceAnythingIfTextContainsNoVariables() {
        ConnectorManager connector = mock(ConnectorManager.class);

        String result = SearchHelper.insertVariableValues(connector, PROJECT_ID, "Hello Jon Doe, you are user no. 42!");

        assertEquals("Hello Jon Doe, you are user no. " + COUNTER_VALUE + "!", result);
    }

    @Test
    public void shouldReplaceEnvironmentVariables() {
        final ProjectEnvironmentVariable variable = new ProjectEnvironmentVariable();
        variable.setName("TEST");
        variable.setValue("muffin");

        final ProjectEnvironment environment = new ProjectEnvironment();
        environment.getVariables().add(variable);

        final ConnectorManager connectors = new ConnectorManager(environment);

        final String result = SearchHelper.insertVariableValues(connectors, PROJECT_ID, "env: {{:TEST}}");
        assertEquals("env: muffin", result);
    }

    @Test
    public void shouldEscapeDollarSignAndBackSlashInVariableValues() {
        final ConnectorManager connector = mock(ConnectorManager.class);
        final VariableStoreConnector variables = mock(VariableStoreConnector.class);

        given(variables.get("text")).willReturn("text with $ and \\ sign");
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        final String result = SearchHelper.insertVariableValues(connector, PROJECT_ID, "this is a {{$text}}");

        assertEquals("this is a text with $ and \\ sign", result);
    }
}
