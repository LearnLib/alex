/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.learning.entities.learnlibproxies.eqproxies;

import org.junit.Before;
import org.junit.Test;

public class MealyRandomWordsEQOracleProxyTest {

    public static final int MAX_LENGTH = 10;
    public static final int MAX_NO_OF_TESTS = 10;
    public static final int SEED = 42;

    private MealyRandomWordsEQOracleProxy eqOracle;

    @Before
    public void setUp() {
        eqOracle = new MealyRandomWordsEQOracleProxy();
        eqOracle.setMinLength(1);
        eqOracle.setMaxLength(MAX_LENGTH);
        eqOracle.setMaxNoOfTests(MAX_NO_OF_TESTS);
        eqOracle.setSeed(SEED);
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
