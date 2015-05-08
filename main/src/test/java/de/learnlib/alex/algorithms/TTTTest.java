package de.learnlib.alex.algorithms;

import de.learnlib.algorithms.ttt.base.DTNode;
import de.learnlib.algorithms.ttt.base.DiscriminationTree;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class TTTTest {

    private TTT algorithm;

    @Before
    public void setUp() {
        algorithm = new TTT();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = mock(Alphabet.class);
        SULOracle<String, String> oracle = mock(SULOracle.class);

        algorithm.createLearner(sigma, oracle);
    }

    @Test
    public void shouldReturnCorrectInternalData() {
        TTTLearnerMealy learner = createLearnerMock();

        String json = algorithm.getInternalData(learner);
        assertEquals("{\"discriminator\": \"null\", \"children\": []}", json);
    }

    private TTTLearnerMealy createLearnerMock() {
        DiscriminationTree tree = mock(DiscriminationTree.class);
        given(tree.getRoot()).willReturn(mock(DTNode.class));
        TTTLearnerMealy learner = mock(TTTLearnerMealy.class);
        given(learner.getDiscriminationTree()).willReturn(tree);
        return learner;
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailToCreateInternalDataFromWrongAlgorithmType() {
        LearningAlgorithm.MealyLearner learner = mock(LearningAlgorithm.MealyLearner.class);
        algorithm.getInternalData(learner);
    }

}
