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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.oracle.equivalence.CompleteExplorationEQOracle;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Proxy around a {@link CompleteExplorationEQOracle}.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 */
@JsonTypeName("complete")
public class CompleteExplorationEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = 8363769818889990904L;

    /** The minimal depth to explore, i.e. minimal length of words to test. */
    private int minDepth;

    /** The maximal depth to explore, i.e. minimal length of words to test. */
    private int maxDepth;

    /**
     * Default constructor.
     */
    public CompleteExplorationEQOracleProxy() {
        this.minDepth = 1;
        this.maxDepth = 1;
    }

    /**
     * Constructor that initialises all fields.
     *
     * @param minDepth
     *         The minimal depth to explore.
     * @param maxDepth
     *         The maximal depth to explore.
     */
    public CompleteExplorationEQOracleProxy(int minDepth, int maxDepth) {
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }

    /**
     * Get the minimal depth to explore, i.e. the minimal length of the words to test.
     *
     * @return The minimal depth to explore.
     */
    public int getMinDepth() {
        return minDepth;
    }

    /**
     * Set a new minimum for the exploration level.
     *
     * @param minDepth
     *         The new minimal depth to explore.
     */
    public void setMinDepth(int minDepth) {
        this.minDepth = minDepth;
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
        if (minDepth < 0 || maxDepth < 0) {
            throw new IllegalArgumentException("Complete EQ Oracle: min depth and max depth must not be negative.");
        } else if (minDepth > maxDepth) {
            throw new IllegalArgumentException("Complete EQ Oracle: max depth must be greater or equal to min depth.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle) {
        return new CompleteExplorationEQOracle<>(membershipOracle, minDepth, maxDepth, batchSize);
    }

}
