/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.learning.services.Learner;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class LearnerStatusTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    public void shouldCreateTheCorrectJSONIfActive() throws JsonProcessingException, IOException {
        LearnerResult learnerResult = new LearnerResult();
        Statistics statistics = new Statistics();
        statistics.setStartDate(ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00"));
        statistics.setMqsUsed(new Statistics.DetailedStatistics(1L, 1L));
        learnerResult.setStatistics(statistics);
        learnerResult.setTestNo(0L);

        LearnerStatus status = new LearnerStatus(learnerResult, Learner.LearnerPhase.LEARNING, new ArrayList<>());
        JsonNode json = mapper.readTree(mapper.writeValueAsString(status));

        assertTrue(json.get("active").asBoolean());
        assertTrue(json.hasNonNull("currentQueries"));
        assertTrue(json.get("currentQueries").isArray());
        assertNotNull(json.get("learnerPhase"));
        assertNotNull(json.get("project"));
        assertNotNull(json.get("stepNo"));
        assertNotNull(json.get("testNo"));
        assertNotNull(json.get("result"));
        assertTrue(json.get("result").isObject());

    }

    @Test
    public void shouldCreateTheCorrectJSONIfInactive() throws IOException {
        LearnerStatus status = new LearnerStatus();
        JsonNode json = mapper.readTree(mapper.writeValueAsString(status));

        assertEquals(json.size(), 1);
        assertFalse(json.get("active").asBoolean());
    }
}
