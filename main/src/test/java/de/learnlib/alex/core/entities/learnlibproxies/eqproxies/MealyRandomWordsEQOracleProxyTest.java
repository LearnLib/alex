package de.learnlib.alex.core.entities.learnlibproxies.eqproxies;

import org.junit.Before;
import org.junit.Test;

public class MealyRandomWordsEQOracleProxyTest {

    public static final int MAX_LENGTH = 10;
    public static final int MAX_NO_OF_TESTS = 10;

    private MealyRandomWordsEQOracleProxy eqOracle;

    @Before
    public void setUp() {
        eqOracle = new MealyRandomWordsEQOracleProxy();
        eqOracle.setMinLength(1);
        eqOracle.setMaxLength(MAX_LENGTH);
        eqOracle.setMaxNoOfTests(MAX_NO_OF_TESTS);
    }

    @Test
    public void ensureThatIfTheParametersAreValidNoExceptionWillBeThrown() {
        eqOracle.checkParameters(); // nothing should happen
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMinLengthIsGreaterThanMaxLength() {
        eqOracle.setMinLength(MAX_LENGTH);
        eqOracle.setMaxLength(1);

        eqOracle.checkParameters(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMinLengthIsNegative() {
        eqOracle.setMinLength(-1);

        eqOracle.checkParameters(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfMaxLengthIsNegative() {
        eqOracle.setMaxLength(-1);

        eqOracle.checkParameters(); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatAnExceptionIsThrownIfNoAmountOfTestIsGiven() {
        eqOracle.setMaxNoOfTests(0);

        eqOracle.checkParameters(); // should fail
    }

}
