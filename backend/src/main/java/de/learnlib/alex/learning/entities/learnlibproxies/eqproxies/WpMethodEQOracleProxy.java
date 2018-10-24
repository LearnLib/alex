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
import de.learnlib.oracle.equivalence.WpMethodEQOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Proxy around a {@link de.learnlib.oracle.equivalence.WMethodEQOracle}.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 */
@JsonTypeName("wp_method")
public class WpMethodEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = -4694711328777712181L;

    /** The maximal depth to explore. */
    private int maxDepth;

    /**
     * Default constructor.
     */
    public WpMethodEQOracleProxy() {
        this.maxDepth = 0;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (maxDepth < 0) {
            throw new IllegalArgumentException("Wp Method EQ Oracle: max depth must not be negative.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle) {
        return new WpMethodEQOracle.MealyWpMethodEQOracle<>(membershipOracle, maxDepth, batchSize);
    }

    public int getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }
}
