/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.oracle.equivalence.RandomWordsEQOracle;
import java.io.Serializable;
import java.util.Random;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Word;

@JsonTypeName("random_word")
public class MealyRandomWordsEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    /** The seed to use for the RNG. */
    public static final int RANDOM_SEED = 42;

    /** The minimal length of the random generated words. */
    private int minLength;

    /** The maximal length of the random generated words. */
    private int maxLength;

    /** The seed to use for the random number generator. */
    private int seed;

    /** How many words should be created before ending the oracle with the assumption that no counter example exists. */
    private int maxNoOfTests;

    public MealyRandomWordsEQOracleProxy() {
        this.minLength = 1;
        this.maxLength = 1;
        this.maxNoOfTests = 1;
        this.seed = RANDOM_SEED;
    }

    public MealyRandomWordsEQOracleProxy(int minLength, int maxLength, int maxNoOfTests, int seed) {
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
        this.seed = seed;
    }

    public int getMinLength() {
        return minLength;
    }

    public void setMinLength(int minLength) {
        this.minLength = minLength;
    }

    public int getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }

    public int getMaxNoOfTests() {
        return maxNoOfTests;
    }

    public void setMaxNoOfTests(int maxNoOfTests) {
        this.maxNoOfTests = maxNoOfTests;
    }

    public int getSeed() {
        return seed;
    }

    public void setSeed(int seed) {
        this.seed = seed;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (minLength < 0 || maxLength < 0) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: min length and max length must not be negative.");
        } else if (minLength > maxLength) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: max depth must be greater or equal to min depth.");
        } else if (maxNoOfTests < 1) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: max no of test must be greater than 0.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle) {
        return new RandomWordsEQOracle<>(membershipOracle, minLength, maxLength, maxNoOfTests, new Random(seed), batchSize);
    }

}
