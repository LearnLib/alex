package de.learnlib.alex.algorithms;

import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.alex.utils.DiscriminationTreeSerializer;
import net.automatalib.util.graphs.dot.GraphDOT;
import net.automatalib.words.Alphabet;

import java.io.IOException;

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
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types were different");
        }
        de.learnlib.discriminationtree.DiscriminationTree discriminationTree = ((DTLearnerMealy) learner).getDiscriminationTree();
        de.learnlib.discriminationtree.DiscriminationTree.GraphView graphView = discriminationTree.graphView();
        String treeAsJSON = DiscriminationTreeSerializer.toJSON(discriminationTree);
        System.out.println("========================");
        try {
            GraphDOT.write(graphView, System.out, graphView.getGraphDOTHelper());
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(treeAsJSON);
        System.out.println("========================");

        return treeAsJSON;
    }

}
