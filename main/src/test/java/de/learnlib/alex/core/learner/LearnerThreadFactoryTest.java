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
import de.learnlib.alex.core.entities.LearnAlgorithms;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.HashSet;
import java.util.Set;

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
    private User user;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    private LearnerThreadFactory factory;

    @Before
    public void setUp() {
        given(project.getBaseUrl()).willReturn("http://localhost/");
        given(learnerConfiguration.getAlgorithm()).willReturn(LearnAlgorithms.DHC);

        Set<Symbol> symbols = new HashSet<>();
        Symbol symbol = mock(Symbol.class);
        symbols.add(symbol);
        given(learnerConfiguration.getSymbols()).willReturn(symbols);

        factory = new LearnerThreadFactory(learnerResultDAO);
    }

    @Test
    public void shouldCreateThreadForWebSymbols() {
        LearnerThread thread = factory.createThread(contextHandler, user, project, learnerConfiguration);

        assertNotNull(thread);
    }

    @Test
    public void shouldCreateThreadForRESTSymbols() {
        given(project.getBaseUrl()).willReturn(FAKE_URL);
        LearnerThread thread = factory.createThread(contextHandler, user, project, learnerConfiguration);

        assertNotNull(thread);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailWithoutSymbols() {
        learnerConfiguration.getSymbols().clear();

        factory.createThread(contextHandler, user, project, learnerConfiguration); // should fail
    }

}
