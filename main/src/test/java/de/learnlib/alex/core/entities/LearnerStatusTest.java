package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.learner.Learner;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.ZonedDateTime;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class LearnerStatusTest {

    @Mock
    private User user;

    @Mock
    private Learner learner;

    @Test
    public void shouldCreateTheCorrectJSONIfActive() throws JsonProcessingException {
        given(learner.isActive(user)).willReturn(true);
        given(learner.getResult(user)).willReturn(mock(LearnerResult.class));
        given(learner.getStartDate(user)).willReturn(ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00"));
        given(learner.getMQsUsed(user)).willReturn(0L);
        String expectedJSON = "{\"active\":true,\"project\":0,\"statistics\":"
                                + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},\"testNo\":0}";

        LearnerStatus status = new LearnerStatus(user, learner);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldCreateTheCorrectJSONIfInactive() throws JsonProcessingException {
        given(learner.isActive(user)).willReturn(false);
        given(learner.getResult(user)).willReturn(null);
        String expectedJSON = "{\"active\":false}";

        LearnerStatus status = new LearnerStatus(user, learner);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }
}
