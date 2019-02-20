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
import de.learnlib.algorithms.lstar.AutomatonLStarState;
import de.learnlib.algorithms.lstar.mealy.ExtensibleLStarMealy;
import de.learnlib.algorithms.lstar.mealy.ExtensibleLStarMealyBuilder;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.datastructure.observationtable.ObservationTable;
import de.learnlib.datastructure.observationtable.writer.ObservationTableASCIIWriter;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;

/**
 * Class that provides the LearnLib implementation of the extended L* algorithm for ALEX.
 */
@JsonTypeName("LSTAR")
public class LStar extends AbstractLearningAlgorithm<String, String> implements Serializable {

    private static final long serialVersionUID = -4916532996322906039L;

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
            MembershipOracle<String, Word<String>> oracle) {
        return new ExtensibleLStarMealyBuilder<String, String>()
                .withAlphabet(sigma)
                .withOracle(oracle)
                .create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof ExtensibleLStarMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types"
                    + "were different");
        }

        ObservationTable observationTable = ((ExtensibleLStarMealy) learner).getObservationTable();
        StringBuilder observationTableAsString = new StringBuilder();
        new ObservationTableASCIIWriter<String, String>().write(observationTable, observationTableAsString);
        return observationTableAsString.toString();
    }

    @Override
    public void resume(LearningAlgorithm.MealyLearner<String, String> learner, byte[] data)
            throws IOException, ClassNotFoundException {
        try (final ObjectInputStream objectIn = new ObjectInputStream(new ByteArrayInputStream(data))) {
            final AutomatonLStarState<String, Word<String>, CompactMealy<String, String>, Integer> state =
                    (AutomatonLStarState<String, Word<String>, CompactMealy<String, String>, Integer>) objectIn.readObject();
            ((ExtensibleLStarMealy<String, String>) learner).resume(state);
        }
    }
}
