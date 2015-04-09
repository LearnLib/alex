package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class LearnerTest {

    private static final String FAKE_URL = "http://example.com";

    @Mock
    private LearnerThreadFactory threadFactory;

    @Mock
    private ConnectorContextHandlerFactory contextHandlerFactory;

    @Mock
    private LearnerThread thread;

    @Mock
    private ConnectorContextHandler contextHandler;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    private Learner learner;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        given(threadFactory.createThread(contextHandler, project, learnerConfiguration)).willReturn(thread);
        given(contextHandlerFactory.createContext(project)).willReturn(contextHandler);

        learner = new Learner(threadFactory, contextHandlerFactory);
    }

    @Test(expected = IllegalStateException.class)
    public void shouldOnlyStartTheThreadOnce() {
        given(thread.isActive()).willReturn(true);
        learner.start(project, learnerConfiguration);

        learner.start(project, learnerConfiguration); // should fail
    }

    @Test
    public void shouldReadTheCorrectOutputOfSomeSymbols() {
        Symbol resetSymbol = mock(Symbol.class);
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn("OK");
        List<Symbol> symbols = new LinkedList<>();
        for (int i = 0; i < 5; i++) {
            Symbol symbol = mock(Symbol.class);
            given(symbol.execute(any(ConnectorManager.class))).willReturn("OK");
            symbols.add(symbol);
        }

        List<String> outputs = learner.readOutputs(project, resetSymbol, symbols);

        assertEquals(symbols.size(), outputs.size());
        assertTrue("at least one output was not OK", outputs.stream().allMatch(output -> output.equals("OK")));
    }

}
