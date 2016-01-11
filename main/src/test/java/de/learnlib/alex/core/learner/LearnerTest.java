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
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
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
    private static final int SYMBOL_AMOUNT = 5;

    @Mock
    private LearnerThreadFactory threadFactory;

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
    private LearnerResultDAO learnerResultDAO;

    private Learner learner;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        given(learnerConfiguration.getBrowser()).willReturn(WebSiteConnector.WebBrowser.HTMLUNITDRIVER);
        given(threadFactory.createThread(contextHandler, user, project, learnerConfiguration)).willReturn(thread);
        given(contextHandlerFactory.createContext(project, WebSiteConnector.WebBrowser.HTMLUNITDRIVER))
                .willReturn(contextHandler);

        learner = new Learner(threadFactory, contextHandlerFactory);
    }

    @Test(expected = IllegalStateException.class)
    public void shouldOnlyStartTheThreadOnce() {
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
