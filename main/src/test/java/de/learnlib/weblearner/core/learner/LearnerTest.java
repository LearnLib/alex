package de.learnlib.weblearner.core.learner;

import de.learnlib.weblearner.core.dao.LearnerResultDAO;
import de.learnlib.weblearner.core.entities.LearnerConfiguration;
import de.learnlib.weblearner.core.entities.Project;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class LearnerTest {

    private static final String FAKE_URL = "http://example.com";

    @Mock
    private LearnerThreadFactory factory;

    @Mock
    private Project project;

    @Mock
    private LearnerConfiguration learnerConfiguration;

    @Mock
    private LearnerThread thread;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    private Learner learner;

    @Before
    public void setUp() {
        given(factory.createThread(project, learnerConfiguration)).willReturn(thread);

        learner = new Learner(factory);
    }

    @Test(expected = IllegalStateException.class)
    public void shouldOnlyStartTheThreadOnce() {
        given(thread.isActive()).willReturn(true);
        learner.start(project, learnerConfiguration);

        learner.start(project, learnerConfiguration); // should fail
    }

}
