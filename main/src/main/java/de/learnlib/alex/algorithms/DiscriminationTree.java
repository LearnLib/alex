package de.learnlib.alex.algorithms;

import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.alex.utils.DiscriminationTreeSerializer;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;

/**
 * Class that provides the LearnLib implementation of the Discrimination Tree algorithm for ALEX.
 */
@LearnAlgorithm(name = "DISCRIMINATION_TREE", prettyName = "Discrimination Tree")
public class DiscriminationTree implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return new DTLearnerMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof DTLearnerMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types"
                                                       + "were different");
        }
        de.learnlib.discriminationtree.DiscriminationTree discriminationTree;
        discriminationTree = ((DTLearnerMealy) learner).getDiscriminationTree();
        return DiscriminationTreeSerializer.toJSON(discriminationTree);
    }

}
