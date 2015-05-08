package de.learnlib.alex.core.learner.connectors;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class VariableStoreConnectorTest {

    private static final String VARIABLE_NAME = "variable";
    private static final String VARIABLE_VALUE = "foobar";

    private VariableStoreConnector connector;

    @Before
    public void setUp() {
        connector = new VariableStoreConnector();
    }

    @Test
    public void shouldCorrectlyStoreAVariable() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);

        assertTrue(connector.contains(VARIABLE_NAME));
        assertEquals(VARIABLE_VALUE, connector.get(VARIABLE_NAME));
    }

    @Test
    public void shouldResetTheStorage() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);
        assertTrue(connector.contains(VARIABLE_NAME));

        connector.reset();

        assertFalse(connector.contains(VARIABLE_NAME));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldFailWhenFetchingANotSetVariable() {
        connector.get(VARIABLE_NAME);
    }

}
