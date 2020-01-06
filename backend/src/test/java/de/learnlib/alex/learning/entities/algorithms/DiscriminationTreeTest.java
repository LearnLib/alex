/*
 * Copyright 2015 - 2020 TU Dortmund
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

import de.learnlib.algorithms.discriminationtree.hypothesis.HState;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.datastructure.discriminationtree.model.AbstractWordBasedDTNode;
import de.learnlib.datastructure.discriminationtree.model.AbstractWordBasedDiscriminationTree;
import de.learnlib.oracle.membership.SULOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class DiscriminationTreeTest {

    private DiscriminationTree algorithm;

    @Before
    public void setUp() {
        algorithm = new DiscriminationTree();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = new SimpleAlphabet<>();
        sigma.add("a");
        sigma.add("b");
        SULOracle<String, String> oracle = mock(SULOracle.class);

        algorithm.createLearner(sigma, oracle);
    }

    @Test
    public void shouldReturnCorrectInternalData() {
        DTLearnerMealy learner = createDTLearnerMock();

        String json = algorithm.getInternalData(learner);
        assertEquals("{\"discriminator\": \"null\", \"children\": []}", json);
    }

    private DTLearnerMealy createDTLearnerMock() {
        AbstractWordBasedDiscriminationTree<String, Word<String>, HState<String, Word<String>, Void, String>> tree;
        tree = mock(AbstractWordBasedDiscriminationTree.class);
        given(tree.getRoot()).willReturn(mock(AbstractWordBasedDTNode.class));
        DTLearnerMealy learner = mock(DTLearnerMealy.class);
        given(learner.getDiscriminationTree()).willReturn(tree);
        return learner;
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailToCreateInternalDataFromWrongAlgorithmType() {
        LearningAlgorithm.MealyLearner learner = mock(LearningAlgorithm.MealyLearner.class);
        algorithm.getInternalData(learner);
    }

}
