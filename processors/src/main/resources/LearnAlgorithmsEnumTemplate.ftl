package de.learnlib.weblearner.core.entities;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import de.learnlib.weblearner.algorithms.LearnAlgorithmFactory;
import net.automatalib.words.Alphabet;

/**
 * Enumeration of the different algorithms to use for the learning process.
 */
public enum LearnAlgorithms {

<#list algorithms as algorithm>
    ${algorithm.name}(new ${algorithm.class}()),
</#list>
    ;

    private LearnAlgorithmFactory factory;

    private LearnAlgorithms(LearnAlgorithmFactory factory) {
        this.factory = factory;
    }

    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return factory.createLearner(sigma, oracle);
    }

    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        return factory.getInternalData(learner);
    }

}
