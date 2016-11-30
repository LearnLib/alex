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

package de.learnlib.alex.algorithms;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.api.MembershipOracle;
import net.automatalib.words.Alphabet;

/**
 * Interface to describe how a new Learner will be created.
 * The factory should get the LearnAlgorithm annotation.
 */
public interface LearnAlgorithmFactory {

    /**
     * Create a new Learner.
     *
     * @param sigma
     *         The Alphabet to use.
     * @param oracle
     *         The MQ oracle.
     *
     * @return A new Learner.
     */
    LearningAlgorithm.MealyLearner<String, String> createLearner(
            Alphabet<String> sigma, MembershipOracle.MealyMembershipOracle<String, String> oracle);

    /**
     * Read the internal data of an algorithm.
     *
     * @param learner
     *         The learner to extract the internal data from.
     *
     * @return The internal data as a nice JSON string.
     *
     * @throws IllegalArgumentException
     *         If the algorithm has the wrong type or no internal data.
     */
    String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner);

}
