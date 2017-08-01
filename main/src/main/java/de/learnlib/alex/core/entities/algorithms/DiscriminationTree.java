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

package de.learnlib.alex.core.entities.algorithms;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.algorithms.discriminationtree.hypothesis.HState;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.api.MembershipOracle;
import de.learnlib.datastructure.discriminationtree.model.AbstractWordBasedDiscriminationTree;
import de.learnlib.datastructure.discriminationtree.model.DTNode;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.Serializable;

/**
 * Class that provides the LearnLib implementation of the Discrimination Tree algorithm for ALEX.
 */
@JsonTypeName("DT")
public class DiscriminationTree extends AbstractLearningAlgorithm<String, String> implements Serializable {

    private static final long serialVersionUID = 2655022507456200915L;

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(
            Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
        return new DTLearnerMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof DTLearnerMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types"
                                                       + "were different");
        }

        return toJSON(((DTLearnerMealy<String, String>) learner).getDiscriminationTree());
    }

    /**
     * Serializes the discrimination tree of the discrimination tree algorithm into JSON.
     *
     * @param dtree The tree to convert into nice JSON.
     *
     * @return The JSON string of the given tree.
     */
    private String toJSON(AbstractWordBasedDiscriminationTree<String, Word<String>, HState<String, Word<String>, Void, String>> dtree) {
        return toJSON(dtree.getRoot());
    }

    private String toJSON(DTNode<String, Word<String>, HState<String, Word<String>, Void, String>> node) {
        StringBuilder result = new StringBuilder();
        result.append('{');

        if (node.getParentOutcome() != null) {
            result.append("\"edgeLabel\": \"");
            result.append(node.getParentOutcome());
            result.append("\",");
        }

        if (node.isLeaf()) {
            result.append("\"data\": \"");
            result.append(node.getData());
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
