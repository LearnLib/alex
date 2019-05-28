/*
 * Copyright 2015 - 2019 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.algorithms.kv.mealy.KearnsVaziraniMealy;
import de.learnlib.algorithms.kv.mealy.KearnsVaziraniMealyBuilder;
import de.learnlib.algorithms.kv.mealy.KearnsVaziraniMealyState;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;

/**
 * Class that provides the LearnLib implementation of the Kearns Vazirani algorithm for ALEX.
 */
@JsonTypeName("KEARNS_VAZIRANI")
public class KearnsVazirani extends AbstractLearningAlgorithm<String, String> implements Serializable {

    private static final long serialVersionUID = 4571297392539122947L;

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> alphabet,
            MembershipOracle<String, Word<String>> membershipOracle) {
        return new KearnsVaziraniMealyBuilder<String, String>()
                .withAlphabet(alphabet)
                .withOracle(membershipOracle)
                .create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> mealyLearner) {
        return "";
    }

    @Override
    public void resume(LearningAlgorithm.MealyLearner<String, String> learner, byte[] data)
            throws IOException, ClassNotFoundException {
        try (final ObjectInputStream objectIn = new ObjectInputStream(new ByteArrayInputStream(data))) {
            final KearnsVaziraniMealyState<String, String> state =
                    (KearnsVaziraniMealyState<String, String>) objectIn.readObject();
            ((KearnsVaziraniMealy<String, String>) learner).resume(state);
        }
    }
}
