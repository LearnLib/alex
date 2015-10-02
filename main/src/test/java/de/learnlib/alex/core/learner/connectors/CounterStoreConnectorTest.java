package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CounterStoreConnectorTest {

    private static final Long    USER_ID       = 3L;
    private static final Long    PROJECT_ID    = 10L;
    private static final String  COUNTER_NAME  = "counter";
    private static final Integer COUNTER_VALUE = 42;

    @Mock
    private CounterDAOImpl  counterDAO;

    @Mock
    private Counter counter;

    private CounterStoreConnector connector;

    @Before
    public void setUp() {
        connector = new CounterStoreConnector(counterDAO);
    }

    @Test
    public void shouldCorrectlyCreateACounter() throws NotFoundException {
        given(counterDAO.get(USER_ID, PROJECT_ID, COUNTER_NAME)).willThrow(NotFoundException.class);

        connector.set(USER_ID, PROJECT_ID, COUNTER_NAME, COUNTER_VALUE);

        verify(counterDAO).create(any(Counter.class));
    }

    @Test
    public void shouldCorrectlyUpdateACounter() throws NotFoundException {
        given(counterDAO.get(USER_ID, PROJECT_ID, COUNTER_NAME)).willReturn(counter);

        connector.set(USER_ID, PROJECT_ID, COUNTER_NAME, COUNTER_VALUE);

        verify(counterDAO).update(any(Counter.class));
        verify(counter).setValue(COUNTER_VALUE);
    }

    @Test
    public void shouldIncrementACounter() throws NotFoundException {
        given(counter.getValue()).willReturn(COUNTER_VALUE);
        given(counterDAO.get(USER_ID, PROJECT_ID, COUNTER_NAME)).willReturn(counter);

        connector.increment(USER_ID, PROJECT_ID, COUNTER_NAME);

        verify(counterDAO).update(any(Counter.class));
        verify(counter).setValue(COUNTER_VALUE + 1);
    }

}
