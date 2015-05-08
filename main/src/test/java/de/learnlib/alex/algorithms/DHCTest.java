package de.learnlib.alex.algorithms;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.oracles.SULOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.mock;

public class DHCTest {

    private DHC algorithm;

    @Before
    public void setUp() {
        algorithm = new DHC();
    }

    @Test
    public void shouldCreateCorrectLearner() {
        Alphabet<String> sigma = new SimpleAlphabet<>();
        SULOracle<String, String> oracle = mock(SULOracle.class);

        algorithm.createLearner(sigma, oracle);
    }

    @Test(expected = IllegalStateException.class)
    public void shouldNeverReturnInternalData() {
        LearningAlgorithm.MealyLearner<String, String> learner = mock(LearningAlgorithm.MealyLearner.class);
        algorithm.getInternalData(learner);
    }

}
