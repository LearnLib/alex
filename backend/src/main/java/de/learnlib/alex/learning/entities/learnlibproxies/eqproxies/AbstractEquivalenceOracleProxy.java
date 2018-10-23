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


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Base class for Proxies around a the different EquivalenceOracles from the LearnLib. The Proxy is needed to make it
 * easier to (de-)serialize the EQ oracles into/ from JSON.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "random_word", value = MealyRandomWordsEQOracleProxy.class),
        @JsonSubTypes.Type(name = "complete", value = CompleteExplorationEQOracleProxy.class),
        @JsonSubTypes.Type(name = "sample", value = SampleEQOracleProxy.class),
        @JsonSubTypes.Type(name = "wmethod", value = WMethodEQOracleProxy.class),
        @JsonSubTypes.Type(name = "hypothesis", value = HypothesisEQOracleProxy.class),
        @JsonSubTypes.Type(name = "test_suite", value = TestSuiteEQOracleProxy.class),
        @JsonSubTypes.Type(name = "wp_method", value = WpMethodEQOracleProxy.class)
})
public abstract class AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = 6270462192160289890L;

    /** How many membership queries are in a batch by default. */
    private static final int DEFAULT_BATCH_SIZE = 20;

    /** How many membership queries are posed together. */
    protected int batchSize;

    /** Constructor. */
    public AbstractEquivalenceOracleProxy() {
        this.batchSize = DEFAULT_BATCH_SIZE;
    }

    /**
     * Check if the parameter of the proxy are valid, i.e. it is possible to create a functional EQ oracle out of the
     * proxy. If everything is OK nothing will happen. If there are errors an exception will be thrown. This exception
     * should have a clear error message.
     *
     * @throws IllegalArgumentException
     *         If the parameters are wrong.
     */
    public abstract void checkParameters() throws IllegalArgumentException;

    /**
     * Create a EQ oracle connected with a MQ oracle based on this proxy.
     *
     * @param membershipOracle
     *         The MQ oracle to test against a hypothesis.
     * @return An EquivalenceOracle from the LearnLib based on the proxy.
     */
    public abstract EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle);

    public int getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(Integer batchSize) {
        this.batchSize = (batchSize == null || batchSize < 1) ? DEFAULT_BATCH_SIZE : batchSize;
    }
}
