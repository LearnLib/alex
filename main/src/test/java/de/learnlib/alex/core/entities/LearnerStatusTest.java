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

@RunWith(MockitoJUnitRunner.class)
public class LearnerStatusTest {

    @Mock
    private User user;

    @Mock
    private Learner learner;

    @Test
    public void shouldCreateTheCorrectJSONIfActive() throws JsonProcessingException {
        LearnerResult learnerResult = new LearnerResult();
        Statistics statistics = new Statistics();
        statistics.setStartDate(ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00"));
        statistics.setMqsUsed(0L);
        learnerResult.setStatistics(statistics);
        learnerResult.setTestNo(0L);

        String expectedJSON = "{\"active\":true,\"project\":0,\"statistics\":"
                                + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},\"testNo\":0}";

        LearnerStatus status = new LearnerStatus(learnerResult);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldCreateTheCorrectJSONIfInactive() throws JsonProcessingException {
        String expectedJSON = "{\"active\":false}";

        LearnerStatus status = new LearnerStatus();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(status);

        assertEquals(expectedJSON, json);
    }
}
