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

package de.learnlib.alex.learning.entities.algorithms;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Parent class of all algorithms.
 *
 * @param <I> The input type.
 * @param <O> The output type.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "name")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "DHC", value = DHC.class),
        @JsonSubTypes.Type(name = "DT", value = DiscriminationTree.class),
        @JsonSubTypes.Type(name = "KEARNS_VAZIRANI", value = KearnsVazirani.class),
        @JsonSubTypes.Type(name = "LSTAR", value = LStar.class),
        @JsonSubTypes.Type(name = "TTT", value = TTT.class)
})
public abstract class AbstractLearningAlgorithm<I, O> implements Serializable {

    private static final long serialVersionUID = 670184782484991650L;

    /**
     * Creates a new learner.
     *
     * @param alphabet The input alphabet.
     * @param oracle   The membership oracle.
     * @return The corresponding learner.
     */
    public abstract LearningAlgorithm.MealyLearner<I, O> createLearner(Alphabet<I> alphabet,
                                                                       MembershipOracle<I, Word<O>> oracle);

    /**
     * Get the internal data structures as string representation.
     *
     * @param learner The learner
     * @return The internal data structures.
     */
    public abstract String getInternalData(LearningAlgorithm.MealyLearner<I, O> learner);
}
