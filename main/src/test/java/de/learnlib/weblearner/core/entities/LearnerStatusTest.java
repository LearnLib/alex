package de.learnlib.weblearner.core.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.learner.Learner;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;


public class LearnerStatusTest {

    @Test
    public void shouldCreateTheCorrectJSONIfActive() throws JsonProcessingException {
        Learner learner = mock(Learner.class);
        given(learner.isActive()).willReturn(true);
        given(learner.getResult()).willReturn(null);
        String expectedJSON = "{\"active\":true,\"project\":0,\"testNo\":0}";

        LearnerStatus status = new LearnerStatus(learner);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldCreateTheCorrectJSONIfInactive() throws JsonProcessingException {
        Learner learner = mock(Learner.class);
        given(learner.isActive()).willReturn(false);
        given(learner.getResult()).willReturn(null);
        String expectedJSON = "{\"active\":false}";

        LearnerStatus status = new LearnerStatus(learner);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }
}
