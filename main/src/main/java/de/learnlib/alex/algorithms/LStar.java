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
import de.learnlib.algorithms.features.observationtable.ObservationTable;
import de.learnlib.algorithms.features.observationtable.writer.ObservationTableASCIIWriter;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealy;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;

/**
 * Class that provides the LearnLib implementation of the extended L* algorithm for ALEX.
 */
@LearnAlgorithm(name = "LSTAR", prettyName = "L*")
public class LStar implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return new ExtensibleLStarMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
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

}
