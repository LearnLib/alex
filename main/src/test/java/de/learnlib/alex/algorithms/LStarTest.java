package de.learnlib.alex.algorithms;

import de.learnlib.algorithms.features.observationtable.ObservationTable;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealy;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class LStarTest {

    private static final String TEST_TABLE = "+==+\n"
                                           + "|  |\n"
                                           + "+==+\n"
                                           + "+==+\n"
                                           + "+==+\n";

    private LStar algorithm;

    @Before
    public void setUp() {
        algorithm = new LStar();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = mock(Alphabet.class);
        SULOracle<String, String> oracle = mock(SULOracle.class);

        algorithm.createLearner(sigma, oracle);
    }

    @Test
    public void shouldReturnCorrectInternalData() {
        ExtensibleLStarMealy<String, String> learner = createLearnerMock();

        String json = algorithm.getInternalData(learner);
        assertEquals(TEST_TABLE, json);
    }

    private ExtensibleLStarMealy<String, String> createLearnerMock() {
        ObservationTable observationTable = mock(ObservationTable.class);
        ExtensibleLStarMealy<String, String> learner = mock(ExtensibleLStarMealy.class);
        given(learner.getObservationTable()).willReturn(observationTable);
        return learner;
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailToCreateInternalDataFromWrongAlgorithmType() {
        LearningAlgorithm.MealyLearner learner = mock(LearningAlgorithm.MealyLearner.class);
        algorithm.getInternalData(learner);
    }

}
