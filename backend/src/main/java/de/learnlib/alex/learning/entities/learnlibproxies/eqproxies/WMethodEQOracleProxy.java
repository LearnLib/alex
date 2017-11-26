/*
 * Copyright 2016 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.learning.services.eqOracles.WMethodEQOracle;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Proxy around a WMethodEQOracle.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see de.learnlib.oracle.equivalence.WMethodEQOracle
 */
@JsonTypeName("wmethod")
public class WMethodEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = 2016142289217760178L;

    /** The maximal depth to explore, i.e. minimal length of words to test. */
    private int maxDepth;

    /**
     * Default constructor.
     */
    public WMethodEQOracleProxy() {
        this.maxDepth = 1;
    }

    /**
     * Get the maximal depth to explore, i.e. the maximal length of the words to test.
     *
     * @return The maximal depth to explore.
     */
    public int getMaxDepth() {
        return maxDepth;
    }

    /**
     * Set a new maximum for the exploration level.
     *
     * @param maxDepth
     *         The new maximal depth to explore.
     */
    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }


    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (maxDepth < 0) {
            throw new IllegalArgumentException("W Method EQ Oracle: max depth must not be negative.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle, int batchSize) {
        return new WMethodEQOracle.MealyWMethodEQOracle<>(this.maxDepth, membershipOracle, batchSize);
    }
}
