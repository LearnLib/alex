package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnAlgorithms;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.learner.connectors.ConnectorContextHandler;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class LearnerThreadFactoryTest {

    private static final String FAKE_URL = "http://exambple.com/reset";

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private ConnectorContextHandler contextHandler;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    private LearnerThreadFactory factory;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn("http://localhost/");
        given(learnerConfiguration.getAlgorithm()).willReturn(LearnAlgorithms.DHC);

        List<Symbol> symbols = new LinkedList<>();
        Symbol symbol = mock(Symbol.class);
        symbols.add(symbol);
        given(learnerConfiguration.getSymbols()).willReturn(symbols);

        factory = new LearnerThreadFactory(learnerResultDAO);
    }

    @Test
    public void shouldCreateThreadForWebSymbols() {
        LearnerThread thread = factory.createThread(contextHandler, project, learnerConfiguration);

        assertNotNull(thread);
    }

    @Test
    public void shouldCreateThreadForRESTSymbols() {
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        LearnerThread thread = factory.createThread(contextHandler, project, learnerConfiguration);

        assertNotNull(thread);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithoutSymbols() {
        learnerConfiguration.getSymbols().clear();

        factory.createThread(contextHandler, project, learnerConfiguration); // should fail
    }

}
