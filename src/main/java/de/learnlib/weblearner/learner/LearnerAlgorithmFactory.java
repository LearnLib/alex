package de.learnlib.weblearner.learner;

import de.learnlib.algorithms.dhc.mealy.MealyDHCBuilder;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealyBuilder;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealyBuilder;
import de.learnlib.api.LearningAlgorithm.MealyLearner;
import de.learnlib.oracles.SULOracle;
import de.learnlib.weblearner.entities.LearnAlgorithms;
import net.automatalib.words.Alphabet;

/**
 * Factory to instantiate the different LearnAlgorithms.
 */
public final class LearnerAlgorithmFactory {

    /**
     * Default constructor disabled because this is a helper class.
     */
    private LearnerAlgorithmFactory() {
    }

    /**
     * Create a Learner of the specified type base on the Alphabet and Sigma.
     *
     * @param algorithm
     *         The type of learner to create.
     * @param sigma
     *         The Alphabet the learner will work work on.
     * @param oracle
     *         The MS oracle to learn on.
     * @return A new learner object.
     */
    public static MealyLearner<String, String> createLearner(LearnAlgorithms algorithm, Alphabet<String> sigma,
                                                             SULOracle<String, String> oracle) {
        switch (algorithm) {
        case DHC:
            return createDHCLearner(sigma, oracle);
        case DISCRIMINATION_TREE:
            return createDiscriminationTreeLearner(sigma, oracle);
        case EXTENSIBLE_LSTAR:
            return createExtensibleLStarLearner(sigma, oracle);
        default:
            throw new IllegalArgumentException("The learn algorithm " + algorithm + " is not known in the factory.");
        }
    }

    private static MealyLearner<String, String> createDHCLearner(Alphabet<String> sigma,
                                                                 SULOracle<String, String> oracle) {
        return new MealyDHCBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    private static MealyLearner<String, String> createDiscriminationTreeLearner(Alphabet<String> sigma,
                                                                                SULOracle<String, String> oracle) {
        return new DTLearnerMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    private static MealyLearner<String, String> createExtensibleLStarLearner(Alphabet<String> sigma,
                                                                             SULOracle<String, String> oracle) {
        return new ExtensibleLStarMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }
}
