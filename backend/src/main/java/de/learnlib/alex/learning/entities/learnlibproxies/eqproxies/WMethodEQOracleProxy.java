/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.oracle.equivalence.WMethodEQOracle;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Proxy around a {@link WMethodEQOracle}. The Proxy is needed to make it easier to (de-)serialize the Transition into/ from
 * JSON.
 */
@JsonTypeName("wmethod")
public class WMethodEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = 2016142289217760178L;

    /** The maximal depth to explore. */
    private int maxDepth;

    /**
     * Default constructor.
     */
    public WMethodEQOracleProxy() {
        this.maxDepth = 0;
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
            MembershipOracle<String, Word<String>> membershipOracle) {
        return new WMethodEQOracle.MealyWMethodEQOracle<>(membershipOracle, this.maxDepth, batchSize);
    }
}
