package de.learnlib.alex.core.services;

import de.learnlib.alex.algorithms.LearnAlgorithmFactory;
import de.learnlib.alex.annotations.LearnAlgorithm;
import de.learnlib.alex.core.entities.Algorithm;
import de.learnlib.api.LearningAlgorithm;
import de.learnlib.api.MembershipOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;

public class LearnAlgorithmServiceTest {

    @LearnAlgorithm(name = "ValidLearner")
    private static class ValidLearnAlgorithm implements LearnAlgorithmFactory {

        /**
         * Explicit declared default constructor, because the class is private and the compiler does not create one.
         */
        public ValidLearnAlgorithm() {
        }

        @Override
        public LearningAlgorithm.MealyLearner<String, String>
        createLearner(Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
            return null;
        }

        @Override
        public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
            return null;
        }
    }

    @LearnAlgorithm(name = "Missing Implementation")
    private static class LearnAlgorithmWithoutInterface  {
    }

    private static class LearnAlgorithmWithoutAnnotation implements LearnAlgorithmFactory {

        @Override
        public LearningAlgorithm.MealyLearner<String, String>
        createLearner(Alphabet<String> sigma, MembershipOracle<String, Word<String>> oracle) {
            return null;
        }

        @Override
        public String getInternalData(LearningAlgorithm.MealyLearner<String, String> learner) {
            return null;
        }
    }

    @Test
    public void shouldAcceptValidLearnAlgorithm() {
        LearnAlgorithmService service = new LearnAlgorithmService();
        Algorithm algorithm = new Algorithm("ValidLearner", "");

        service.addAlgorithm(ValidLearnAlgorithm.class);

        assertThat(service.size(), is(equalTo(1)));
        assertNotNull(service.getLearnAlgorithm(algorithm));
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldRejectALearnAlgorithmWithoutInterfaceImplementation() {
        LearnAlgorithmService service = new LearnAlgorithmService();

        service.addAlgorithm(LearnAlgorithmWithoutInterface.class);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldRejectALearnAlgorithmWithoutLearnAlgorithmInterface() {
        LearnAlgorithmService service = new LearnAlgorithmService();

        service.addAlgorithm(LearnAlgorithmWithoutAnnotation.class);
    }
}
