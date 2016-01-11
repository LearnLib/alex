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

import de.learnlib.algorithms.features.observationtable.ObservationTable;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealy;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class LStarTest {

    private static final String TEST_TABLE = "+==+\n"
                                           + "|  |\n"
                                           + "+==+\n"
                                           + "+==+\n"
                                           + "+==+\n";

    private LStar algorithm;

    @Before
    public void setUp() {
        algorithm = new LStar();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = mock(Alphabet.class);
        SULOracle<String, String> oracle = mock(SULOracle.class);

        algorithm.createLearner(sigma, oracle);
    }

    @Test
    public void shouldReturnCorrectInternalData() {
        ExtensibleLStarMealy<String, String> learner = createLearnerMock();

        String json = algorithm.getInternalData(learner);
        assertEquals(TEST_TABLE, json);
    }

    private ExtensibleLStarMealy<String, String> createLearnerMock() {
        ObservationTable observationTable = mock(ObservationTable.class);
        ExtensibleLStarMealy<String, String> learner = mock(ExtensibleLStarMealy.class);
        given(learner.getObservationTable()).willReturn(observationTable);
        return learner;
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailToCreateInternalDataFromWrongAlgorithmType() {
        LearningAlgorithm.MealyLearner learner = mock(LearningAlgorithm.MealyLearner.class);
        algorithm.getInternalData(learner);
    }

}
