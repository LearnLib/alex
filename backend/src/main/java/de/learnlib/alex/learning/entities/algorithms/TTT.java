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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.algorithms.ttt.base.AbstractBaseDTNode;
import de.learnlib.algorithms.ttt.base.BaseTTTDiscriminationTree;
import de.learnlib.algorithms.ttt.base.TTTLearnerState;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealyBuilder;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;

/**
 * Class that provides the LearnLib implementation of the TTT algorithm for ALEX.
 */
@JsonTypeName("TTT")
public class TTT extends AbstractLearningAlgorithm<String, String> implements Serializable {

    private static final long serialVersionUID = -7594934697689034183L;

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
        return new TTTLearnerMealyBuilder<String, String>()
                .withAlphabet(sigma)
                .withOracle(oracle)
                .create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof TTTLearnerMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types"
                    + "were different");
        }

        TTTLearnerMealy<String, String> tttLearner = (TTTLearnerMealy<String, String>) learner;
        return toJSON(tttLearner.getDiscriminationTree());
    }

    @Override
    public void resume(LearningAlgorithm.MealyLearner<String, String> learner, byte[] data)
            throws IOException, ClassNotFoundException {
        try (final ObjectInputStream objectIn = new ObjectInputStream(new ByteArrayInputStream(data))) {
            final TTTLearnerState<String, Word<String>> state = (TTTLearnerState<String, Word<String>>) objectIn.readObject();
            ((TTTLearnerMealy<String, String>) learner).resume(state);
        }
    }

    /**
     * Serializes the discrimination tree of the TTT algorithm into JSON.
     *
     * @param dtree
     *         The tree to convert into nice JSON.
     * @return The JSON string of the given tree.
     */
    private String toJSON(BaseTTTDiscriminationTree<String, Word<String>> dtree) {
        return toJSON(dtree.getRoot());
    }

    private String toJSON(AbstractBaseDTNode<String, Word<String>> node) {
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
                AbstractBaseDTNode<String, Word<String>> child = entry.getValue();
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
