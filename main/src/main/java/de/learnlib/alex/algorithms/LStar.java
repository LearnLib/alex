package de.learnlib.alex.algorithms;

import de.learnlib.algorithms.features.observationtable.writer.ObservationTableASCIIWriter;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealy;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealyBuilder;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import de.learnlib.alex.annotations.LearnAlgorithm;
import net.automatalib.words.Alphabet;

@LearnAlgorithm(name = "LSTAR", prettyName = "L*")
public class LStar implements LearnAlgorithmFactory {

    @Override
    public LearningAlgorithm.MealyLearner<String, String> createLearner(Alphabet<String> sigma,
                                                                        SULOracle<String, String> oracle) {
        return new ExtensibleLStarMealyBuilder<String, String>().withAlphabet(sigma).withOracle(oracle).create();
    }

    @Override
    public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
        if (!(learner instanceof ExtensibleLStarMealy)) {
            throw new IllegalArgumentException("Can not read the internal data because the algorithm types were different");
        }

        StringBuilder observationTable = new StringBuilder();
        new ObservationTableASCIIWriter<String, String>().write(((ExtensibleLStarMealy) learner).getObservationTable(), observationTable);
        return observationTable.toString();
    }

}
