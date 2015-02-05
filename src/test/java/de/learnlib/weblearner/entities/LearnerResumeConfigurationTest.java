package de.learnlib.weblearner.entities;

import de.learnlib.weblearner.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;

public class LearnerResumeConfigurationTest {

    private LearnerResumeConfiguration configuration;

    @Before
    public void setUp() {
        configuration = new LearnerResumeConfiguration();
    }

    @Test
    public void shouldSayThatItIsAValidConfigurationIfItIsOne() {
        configuration.checkConfiguration(); // nothing should happen
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfNoEqOracleIsGiven() {
        configuration.setEqOracle(null);

        configuration.checkConfiguration(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfAnInvalidEqOracleIsGiven() {
        AbstractEquivalenceOracleProxy eqOracle = mock(AbstractEquivalenceOracleProxy.class);
        willThrow(IllegalArgumentException.class).given(eqOracle).checkParameters();
        configuration.setEqOracle(eqOracle);

        configuration.checkConfiguration(); // should fail
    }

}
