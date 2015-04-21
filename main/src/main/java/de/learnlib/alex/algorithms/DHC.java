package de.learnlib.alex.algorithms;

import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.algorithms.dhc.mealy.MealyDHCBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;

/**
 * Class that provides the LearnLib implementation of the DHC algorithm for ALEX.
 */
@LearnAlgorithm(name = "DHC")
public class DHC implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return new MealyDHCBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        throw new IllegalStateException("DHC has no internal data structures");
    }

}
