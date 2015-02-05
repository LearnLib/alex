package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnAlgorithms;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
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
        given(project.getResetSymbol(WebSymbol.class)).willReturn(mock(WebSymbol.class));
        given(project.getResetSymbol(RESTSymbol.class)).willReturn(mock(RESTSymbol.class));
        given(learnerConfiguration.getAlgorithm()).willReturn(LearnAlgorithms.DHC);

        factory = new LearnerThreadFactory(learnerResultDAO);
    }

    @Test
    public void shouldCreateThreadForWebSymbols() {
        Symbol<?> webSymbol = new WebSymbol();
        LearnerThread<?> thread = factory.createThread(project, learnerConfiguration, webSymbol);

        assertNotNull(thread);
    }

    @Test
    public void shouldCreateThreadForRESTSymbols() {
        Symbol<?> restSymbol = new RESTSymbol();
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        LearnerThread<?> thread = factory.createThread(project, learnerConfiguration, restSymbol);

        assertNotNull(thread);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithoutSymbols() {
        factory.createThread(project, learnerConfiguration); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailOnDifferentSymbolTypes() {
        Symbol<?> webSymbol1 = new WebSymbol();
        Symbol<?> webSymbol2 = new WebSymbol();
        Symbol<?> restStymbol = new RESTSymbol();

        factory.createThread(project, learnerConfiguration, webSymbol1, webSymbol2, restStymbol); // should fail
    }

}
