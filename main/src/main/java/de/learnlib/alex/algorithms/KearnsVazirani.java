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

import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.algorithms.kv.mealy.KearnsVaziraniMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.api.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

/**
 * Class that provides the LearnLib implementation of the Kearns Vazirani algorithm for ALEX.
 */
@LearnAlgorithm(name = "KEARNS_VAZIRANI", prettyName = "Kearns Vazirani")
public class KearnsVazirani implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(
            Alphabet<String> alphabet, MembershipOracle<String, Word<String>> membershipOracle) {

        return new KearnsVaziraniMealyBuilder<String, String>()
                .withAlphabet(alphabet)
                .withOracle(membershipOracle)
                .create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> mealyLearner) {
        return "";
    }
}
