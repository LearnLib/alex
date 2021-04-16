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

package de.learnlib.alex.learning.entities.learnlibproxies.eqproxies;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class CompleteExplorationEQOracleProxyTest {

    public static final int MAX_DEPTH = 10;
    private CompleteExplorationEQOracleProxy eqOracle;

    @BeforeEach
    public void setUp() {
        eqOracle = new CompleteExplorationEQOracleProxy();
        eqOracle.setMinDepth(1);
        eqOracle.setMaxDepth(MAX_DEPTH);
    }

    @Test
    public void ensureThatIfTheParametersAreValidNoExceptionWillBeThrown() {
        eqOracle.checkParameters(); // nothing should happen
    }

    @Test
    public void ensureThatAnExceptionIsThrownIfMinDepthIsGreaterThanMaxDepth() {
        eqOracle.setMinDepth(MAX_DEPTH);
        eqOracle.setMaxDepth(1);

        assertThrows(IllegalArgumentException.class, () -> eqOracle.checkParameters());
    }

    @Test
    public void ensureThatAnExceptionIsThrownIfMinDepthIsNegative() {
        eqOracle.setMinDepth(-1);

        assertThrows(IllegalArgumentException.class, () -> eqOracle.checkParameters());
    }

    @Test
    public void ensureThatAnExceptionIsThrownIfMaxDepthIsNegative() {
        eqOracle.setMaxDepth(-1);

        assertThrows(IllegalArgumentException.class, () -> eqOracle.checkParameters());
    }

}
