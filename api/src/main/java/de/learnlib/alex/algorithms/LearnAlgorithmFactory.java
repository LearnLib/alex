package de.learnlib.alex.algorithms;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;

/**
 * Interface to describe how a new Learner will be created.
 * The factory should get the LearnAlgorithm annotation.
 */
public interface LearnAlgorithmFactory {

    /**
     * Create a new Learner.
     *
     * @param sigma
     *         The Alphabet to use.
     * @param oracle
     *         The MQ oracle.
     * @return A new Learner.
     */
    LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                 SULOracle<String, String> oracle);

    /**
     * Read the internal data of an algorithm.
     *
     * @param learner
     *         The learner to extract the internal data from.
     * @return The internal data as a nice JSON string.
     * @throws IllegalArgumentException
     *         If the algorithm has the wrong type or no internal data.
     */
    String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner);

}
