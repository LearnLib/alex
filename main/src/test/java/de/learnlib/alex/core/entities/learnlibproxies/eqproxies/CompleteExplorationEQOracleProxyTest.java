package de.learnlib.alex.core.entities.learnlibproxies.eqproxies;

import org.junit.Before;
import org.junit.Test;

public class CompleteExplorationEQOracleProxyTest {

    public static final int MAX_DEPTH = 10;
    private CompleteExplorationEQOracleProxy eqOracle;

    @Before
    public void setUp() {
        eqOracle = new CompleteExplorationEQOracleProxy();
        eqOracle.setMinDepth(1);
        eqOracle.setMaxDepth(MAX_DEPTH);
    }

    @Test
    public void ensureThatIfTheParametersAreValidNoExceptionWillBeThrown() {
        eqOracle.checkParameters(); // nothing should happen
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMinDepthIsGreaterThanMaxDepth() {
        eqOracle.setMinDepth(MAX_DEPTH);
        eqOracle.setMaxDepth(1);

        eqOracle.checkParameters(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMinDepthIsNegative() {
        eqOracle.setMinDepth(-1);

        eqOracle.checkParameters(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMaxDepthIsNegative() {
        eqOracle.setMaxDepth(-1);

        eqOracle.checkParameters(); // should fail
    }

}
