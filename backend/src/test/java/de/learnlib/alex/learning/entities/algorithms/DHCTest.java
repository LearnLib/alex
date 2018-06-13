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

package de.learnlib.alex.learning.entities.algorithms;

import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.oracle.membership.SULOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class DHCTest {

    private DHC algorithm;

    @Before
    public void setUp() {
        algorithm = new DHC();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = new SimpleAlphabet<>();
        SULOracle<String, String> oracle = mock(SULOracle.class);
        algorithm.createLearner(sigma, oracle);
    }

    @Test
    public void shouldNeverReturnInternalData() {
        LearningAlgorithm.MealyLearner<String, String> learner = mock(LearningAlgorithm.MealyLearner.class);
        assertEquals(algorithm.getInternalData(learner), "");
    }

}
