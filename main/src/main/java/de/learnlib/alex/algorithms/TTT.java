package de.learnlib.alex.algorithms;

import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.alex.utils.TTTSerializer;
import net.automatalib.util.graphs.dot.GraphDOT;
import net.automatalib.words.Alphabet;

import java.io.IOException;

@LearnAlgorithm(name = "TTT")
public class TTT implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return new TTTLearnerMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof TTTLearnerMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types were different");
        }

        TTTLearnerMealy tttLearner = (TTTLearnerMealy) learner;
        String treeAsJSON = TTTSerializer.toJSON(tttLearner.getDiscriminationTree());
        de.learnlib.algorithms.ttt.base.DiscriminationTree.GraphView graphView = tttLearner.getDiscriminationTree().graphView();
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
