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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.Ignore;
import org.junit.Test;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class LearnerResultTest {

    private static final Long USER_ID = 3L;
    private static final Long PROJECT_ID = 3L;
    private static final Long ID = 3L;
    private static final ZonedDateTime TEST_DATE = ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00");
    private static final Statistics.DetailedStatistics TEST_DURATION = new Statistics.DetailedStatistics();

    private static final AbstractLearningAlgorithm<String, String> ALGORITHM = new TTT();

    private static final MealyRandomWordsEQOracleProxy EXAMPLE_EQ_ORACLE =
            new MealyRandomWordsEQOracleProxy(1, 5, 10, 42);

    @Test
    @Ignore
    public void shouldCreateTheCorrectJSON() throws IOException {
        Alphabet<String> sigma = new SimpleAlphabet<>();
        sigma.add("0");
        sigma.add("1");

        CompactMealy<String, String> hypothesis = new CompactMealy<>(sigma);
        int state0 = hypothesis.addInitialState();
        int state1 = hypothesis.addState();

        hypothesis.addTransition(state0, "0", state0, "OK");
        hypothesis.addTransition(state0, "1", state1, "OK");
        hypothesis.addTransition(state1, "1", state0, "OK");
        hypothesis.addTransition(state1, "0", state1, "OK");

        Project project = mock(Project.class);
        given(project.getId()).willReturn(PROJECT_ID);

        Statistics statistics = new Statistics();
        statistics.setStartDate(TEST_DATE);
        statistics.setDuration(TEST_DURATION);

        User user = new User(USER_ID);

        LearnerResult result = new LearnerResult();
        result.setProject(project);
        result.setTestNo(ID);
        result.setAlgorithm(ALGORITHM);
        result.createHypothesisFrom(hypothesis);
        result.setStatistics(statistics);

        LearnerResultStep firstStep = new LearnerResultStep();
        firstStep.setResult(result);
        firstStep.setStepNo(0L);
        firstStep.setEqOracle(EXAMPLE_EQ_ORACLE);
        firstStep.createHypothesisFrom(hypothesis);
        firstStep.setStatistics(statistics);
        result.getSteps().add(firstStep);

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        String json = mapper.writeValueAsString(result) + "\n";

        assertEquals(getExpectedJson(), json);
    }

    private String getExpectedJson() throws IOException {
        // read the symbols from a file
        String url = System.getProperty("user.dir") + "/src/test/resources/core/entities/LearnerResultTestData.json";
        Path path = Paths.get(url);
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        StringBuilder stringBuffer = new StringBuilder();
        lines.stream().map(l -> l + "\n").forEach(stringBuffer::append);
        String json = stringBuffer.toString();

        return json;
    }

}
