package de.learnlib.alex.utils;

import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SearchHelperTest {

    private static final Long PROJECT_ID = 10L;
    private static final int COUNTER_VALUE = 42;

    @Test
    public void shouldReplaceVariablesCorrectly() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(variables.get("name")).willReturn("Jon Doe");
        CounterStoreConnector counter = mock(CounterStoreConnector.class);
        given(counter.get(PROJECT_ID, "counter")).willReturn(COUNTER_VALUE);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counter);

        String result = SearchHelper.insertVariableValues(connector, PROJECT_ID,
                                                          "Hello {{$name}}, you are user no. {{#counter}}!");

        assertEquals("Hello Jon Doe, you are user no. " + COUNTER_VALUE + "!", result);
    }

    @Test
    public void shouldNotReplaceAnythingIfTextContainsNoVariables() {
        ConnectorManager connector = mock(ConnectorManager.class);

        String result = SearchHelper.insertVariableValues(connector, PROJECT_ID,
                                                          "Hello Jon Doe, you are user no. 42!");

        assertEquals("Hello Jon Doe, you are user no. " + COUNTER_VALUE + "!", result);
        verify(connector, never()).getConnector(any(Class.class));
    }
}
