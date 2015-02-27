package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnAlgorithms;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class LearnerThreadFactoryTest {

    private static final String FAKE_URL = "http://exambple.com/reset";

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    private LearnerThreadFactory factory;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn("http://localhost/");
        given(learnerConfiguration.getAlgorithm()).willReturn(LearnAlgorithms.DHC);

        factory = new LearnerThreadFactory(learnerResultDAO);
    }

    @Test
    public void shouldCreateThreadForWebSymbols() {
        Symbol resetSymbol = new Symbol();
        Symbol webSymbol = new Symbol();
        LearnerThread<?> thread = factory.createThread(project, learnerConfiguration, resetSymbol, webSymbol);

        assertNotNull(thread);
    }

    @Test
    public void shouldCreateThreadForRESTSymbols() {
        Symbol resetSymbol = new Symbol();
        Symbol restSymbol = new Symbol();
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        LearnerThread<?> thread = factory.createThread(project, learnerConfiguration, resetSymbol, restSymbol);

        assertNotNull(thread);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithoutSymbols() {
        Symbol resetSymbol = mock(Symbol.class);
        factory.createThread(project, learnerConfiguration, resetSymbol); // should fail
    }

}
