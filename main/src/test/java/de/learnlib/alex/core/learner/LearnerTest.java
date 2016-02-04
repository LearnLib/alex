/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class LearnerTest {

    private static final String FAKE_URL = "http://example.com";
    private static final int SYMBOL_AMOUNT = 5;

    @Mock
    private ConnectorContextHandlerFactory contextHandlerFactory;

    @Mock
    private LearnerThread thread;

    @Mock
    private ConnectorContextHandler contextHandler;

    @Mock
    private User user;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private LearnerThreadFactory learnerThreadFactory;

    @Mock
    private LearnerThread learnerThread;

    private Learner learner;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        given(learnerConfiguration.getBrowser()).willReturn(WebSiteConnector.WebBrowser.HTMLUNITDRIVER);
        given(contextHandlerFactory.createContext(project, WebSiteConnector.WebBrowser.HTMLUNITDRIVER))
                .willReturn(contextHandler);
        given(learnerThreadFactory.createThread(any(LearnerResult.class), any(ConnectorContextHandler.class)))
                .willReturn(learnerThread);
        given(learnerThreadFactory.createThread(any(LearnerThread.class), any(LearnerResult.class)))
                .willReturn(learnerThread);

        learner = new Learner(symbolDAO, learnerResultDAO, contextHandlerFactory, learnerThreadFactory);
    }

    @Test
    public void shouldStartAThread() throws NotFoundException {
        learner.start(user, project, learnerConfiguration);
    }

    @Test
    @Ignore
    public void shouldResumeAThread() throws NotFoundException {
        learner.start(user, project, learnerConfiguration);
        given(thread.isFinished()).willReturn(true);

        learner.resume(user, learnerConfiguration);
    }

    @Test
    public void shouldStopAThread() throws NotFoundException {
        learner.stop(user);
    }

    @Test
    public void shouldCorrectlyTestIfTheUserHasAnActiveThread() throws NotFoundException {
        assertFalse(learner.isActive(user));

        learner.start(user, project, learnerConfiguration);

        assertTrue(learner.isActive(user));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldOnlyStartTheThreadOnce() throws NotFoundException {
        given(symbolDAO.getAll(any(User.class), any(Long.class), any(List.class))).willReturn(new LinkedList<>());
        given(learnerResultDAO.createStep(any(LearnerResult.class), any(LearnerConfiguration.class)))
                .willReturn(new LearnerResultStep());
        given(thread.isFinished()).willReturn(false);
        learner.start(user, project, learnerConfiguration);

        learner.start(user, project, learnerConfiguration); // should fail
    }

    @Test
    public void shouldReadTheCorrectOutputOfSomeSymbols() {
        Symbol resetSymbol = mock(Symbol.class);
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(ExecuteResult.OK);
        List<Symbol> symbols = new LinkedList<>();
        for (int i = 0; i < SYMBOL_AMOUNT; i++) {
            Symbol symbol = mock(Symbol.class);
            given(symbol.execute(any(ConnectorManager.class))).willReturn(ExecuteResult.OK);
            symbols.add(symbol);
        }

        List<String> outputs = learner.readOutputs(user, project, resetSymbol, symbols);

        assertEquals(symbols.size(), outputs.size());
        assertTrue("at least one output was not OK", outputs.stream().allMatch(output -> output.equals("OK")));
    }

}
