package de.learnlib.alex.algorithms;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;

public interface LearnAlgorithmFactory {

    LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                 SULOracle<String, String> oracle);

    String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner);

}
