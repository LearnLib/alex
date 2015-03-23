package de.learnlib.weblearner.utils;

import de.learnlib.weblearner.core.learner.connectors.CounterStoreConnector;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;
import de.learnlib.weblearner.core.learner.connectors.VariableStoreConnector;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SearchHelperTest {

    @Test
    public void shouldReplaceVariablesCorrectly() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(variables.get("name")).willReturn("Jon Doe");
        CounterStoreConnector counter = mock(CounterStoreConnector.class);
        given(counter.get("counter")).willReturn(42);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counter);

        String result = SearchHelper.insertVariableValues(connector, "Hello {{$name}}, you are user no. {{#counter}}!");

        assertEquals("Hello Jon Doe, you are user no. 42!", result);
    }

    @Test
    public void shouldNotReplaceAnythingIfTextContainsNoVariables() {
        MultiConnector connector = mock(MultiConnector.class);

        String result = SearchHelper.insertVariableValues(connector, "Hello Jon Doe, you are user no. 42!");

        assertEquals("Hello Jon Doe, you are user no. 42!", result);
        verify(connector, never()).getConnector(any(Class.class));
    }
}
