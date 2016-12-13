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
import de.learnlib.algorithms.ttt.base.DTNode;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.api.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

/**
 * Class that provides the LearnLib implementation of the TTT algorithm for ALEX.
 */
@LearnAlgorithm(name = "TTT")
public class TTT implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(
            Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
        return new TTTLearnerMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof TTTLearnerMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types"
                                                       + "were different");
        }

        TTTLearnerMealy tttLearner = (TTTLearnerMealy) learner;
        return toJSON(tttLearner.getDiscriminationTree());
    }

    /**
     * Serializes the discrimination tree of the TTT algorithm into JSON.
     *
     * @param tree
     *         The tree to convert into nice JSON.
     * @return The JSON string of the given tree.
     */
    private String toJSON(de.learnlib.algorithms.ttt.base.DiscriminationTree<String, Word> tree) {
        return toJSON(tree.getRoot());
    }

    private String toJSON(DTNode<String, Word> node) {
        StringBuilder result = new StringBuilder();
        result.append('{');

        if (node.getParentEdgeLabel() != null) {
            result.append("\"edgeLabel\": \"");
            result.append(node.getParentEdgeLabel());
            result.append("\",");
        }

        if (node.isLeaf()) {
            result.append("\"data\": \"");
            result.append(node.getState());
            result.append('"');
        } else {
            result.append("\"discriminator\": \"");
            result.append(node.getDiscriminator());
            result.append("\", ");

            result.append("\"children\": [");
            node.getChildEntries().forEach(entry -> {
                DTNode child = entry.getValue();
                result.append(toJSON(child));
                result.append(",");
            });

            // remove last ','
            if (result.charAt(result.length() - 1) == ',') {
                result.setLength(result.length() - 1);
            }

            result.append(']');
        }

        result.append('}');
        return result.toString();
    }

}
