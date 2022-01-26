/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.integrationtests.resources;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.LearnerApi;
import de.learnlib.alex.integrationtests.resources.api.LearnerResultApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.resources.utils.SymbolUtils;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import java.io.IOException;
import java.net.InetAddress;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.TimeUnit;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class LearnerResourceIT extends AbstractResourceIT {

    private String jwt;
    private Project project;
    private LearnerStartConfiguration startConfiguration;
    private LearnerApi learnerApi;
    private LearnerResultApi learnerResultApi;
    private String memberJwt;

    @BeforeEach
    public void pre() throws Exception {
        objectMapper.addMixIn(LearnerResult.class, LearnerSetupResourceIT.IgnoreLearnerResultFieldsMixin.class);
        objectMapper.addMixIn(LearnerResultStep.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);
        objectMapper.addMixIn(LearnerStatus.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);
        objectMapper.addMixIn(ExecuteResult.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);

        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);
        final SymbolApi symbolApi = new SymbolApi(client, port);
        final SymbolUtils symbolUtils = new SymbolUtils(symbolApi);

        learnerApi = new LearnerApi(client, port);
        learnerResultApi = new LearnerResultApi(client, port);

        jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final Response res1 = userApi.create("{\"email\":\"test1@test.de\", \"username\":\"test1\", \"password\":\"test\"}");
        final int memberId = JsonPath.read(res1.readEntity(String.class), "id");
        memberJwt = userApi.login("test1@test.de", "test");

        final String url = "http://" + InetAddress.getLocalHost().getHostAddress() + ":" + port;
        project = projectApi.create("{\"name\":\"test\",\"url\":\"" + url + "\"}", jwt)
                .readEntity(Project.class);

        projectApi.addMembers(project.getId(), Collections.singletonList((long) memberId), jwt);

        final ParameterizedSymbol resetSymbol = symbolUtils.createResetSymbol(project, jwt);
        final ParameterizedSymbol authSymbol = symbolUtils.createAuthSymbol(project, ADMIN_EMAIL, ADMIN_PASSWORD, jwt);
        final ParameterizedSymbol getProfileSymbol = symbolUtils.createGetProfileSymbol(project, jwt);

        final MealyRandomWordsEQOracleProxy eqOracleProxy = new MealyRandomWordsEQOracleProxy();
        eqOracleProxy.setBatchSize(1);
        eqOracleProxy.setMinLength(3);
        eqOracleProxy.setMaxLength(3);
        eqOracleProxy.setMaxNoOfTests(3);

        final LearnerSetup learnerSetup = new LearnerSetup();
        learnerSetup.setProject(project);
        learnerSetup.setPreSymbol(resetSymbol);
        learnerSetup.setSymbols(Arrays.asList(authSymbol, getProfileSymbol));

        final var webDriverConfig = new WebDriverConfig();
        webDriverConfig.setBrowser("chrome");
        learnerSetup.setWebDriver(webDriverConfig);
        learnerSetup.setEquivalenceOracle(eqOracleProxy);
        learnerSetup.setAlgorithm(new TTT());
        learnerSetup.setEnvironments(project.getEnvironments());

        startConfiguration = new LearnerStartConfiguration();
        startConfiguration.setSetup(learnerSetup);
    }

    @Test
    public void shouldStartLearningProcess() throws Exception {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isLearnerProcessActive(result));

        result = learn(result.getTestNo());
        assertLearnerResult(result, LearnerResult.Status.FINISHED, 2, 2);
    }

    @Test
    public void shouldResumeLearningProcess() throws Exception {
        startConfiguration.getSetup().setEquivalenceOracle(new SampleEQOracleProxy());

        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        var result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        result = learn(result.getTestNo());

        assertLearnerResult(result, LearnerResult.Status.FINISHED, 1, 1);

        // resume
        final MealyRandomWordsEQOracleProxy eqOracleProxy = new MealyRandomWordsEQOracleProxy();
        eqOracleProxy.setBatchSize(1);
        eqOracleProxy.setMinLength(3);
        eqOracleProxy.setMaxLength(3);
        eqOracleProxy.setMaxNoOfTests(3);

        final LearnerResumeConfiguration resumeConfiguration = new LearnerResumeConfiguration();
        resumeConfiguration.setStepNo(result.getSteps().get(0).getStepNo().intValue());
        resumeConfiguration.setEqOracle(eqOracleProxy);

        final Response res2 = learnerApi.resume(project.getId(), result.getTestNo(), resumeConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        result = learn(result.getTestNo());
        assertLearnerResult(result, LearnerResult.Status.FINISHED, 2, 2);
    }

    @Test
    public void shouldAbortLearningProcessOfMemberAsOwner() throws IOException {
        abortLearningProcess(memberJwt, jwt);
    }

    @Test
    public void shouldAbortOwnLearningProcessAsOwner() throws IOException {
        abortLearningProcess(jwt, jwt);
    }

    @Test
    public void shouldAbortOwnLearningProcessAsMember() throws IOException {
        abortLearningProcess(memberJwt, memberJwt);
    }

    @Test
    public void shouldFailToAbortLearningProcessOfOwnerAsMember() throws Exception {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);

        final Response res2 = learnerApi.abort(project.getId(), result.getTestNo(), memberJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());

        learn(result.getTestNo());
    }

    @Test
    public void shouldFailToResumeWithInvalidStepToContinueFrom() throws Exception {
        startConfiguration.getSetup().setEquivalenceOracle(new SampleEQOracleProxy());

        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());
        final LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);

        learn(result.getTestNo());

        final LearnerResumeConfiguration resumeConfiguration = new LearnerResumeConfiguration();
        resumeConfiguration.setStepNo(5); // does not exist
        resumeConfiguration.setEqOracle(new SampleEQOracleProxy());

        final Response res2 = learnerApi.resume(project.getId(), result.getTestNo(), resumeConfiguration, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());
        res2.readEntity(SpringRestError.class);

        final Response res3 = learnerApi.getStatus(project.getId(), jwt);
        final LearnerStatus status = objectMapper.readValue(res3.readEntity(String.class), LearnerStatus.class);
        assertEquals(0, status.getQueue().size());
    }

    @Test
    public void shouldResumeLearningProcessWithSymbolsToAdd() throws Exception {
        startConfiguration.getSetup().setEquivalenceOracle(new SampleEQOracleProxy());

        final ParameterizedSymbol symbolToLearn = startConfiguration.getSetup().getSymbols().get(0);
        final ParameterizedSymbol symbolToAdd = startConfiguration.getSetup().getSymbols().get(1);
        startConfiguration.getSetup().setSymbols(Collections.singletonList(symbolToLearn));

        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        result = learn(result.getTestNo());

        assertLearnerResult(result, LearnerResult.Status.FINISHED, 1, 1);

        final MealyRandomWordsEQOracleProxy eqOracleProxy = new MealyRandomWordsEQOracleProxy();
        eqOracleProxy.setBatchSize(1);
        eqOracleProxy.setMinLength(3);
        eqOracleProxy.setMaxLength(3);
        eqOracleProxy.setMaxNoOfTests(3);

        final LearnerResumeConfiguration resumeConfiguration = new LearnerResumeConfiguration();
        resumeConfiguration.setStepNo(result.getSteps().get(0).getStepNo().intValue());
        resumeConfiguration.setEqOracle(eqOracleProxy);
        resumeConfiguration.getSymbolsToAdd().add(symbolToAdd);

        final Response res2 = learnerApi.resume(project.getId(), result.getTestNo(), resumeConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        result = learn(result.getTestNo());

        assertLearnerResult(result, LearnerResult.Status.FINISHED, 3, 2);
        assertEquals(2, result.getSetup().getSymbols().size());
    }

    @Test
    public void shouldGetEmptyStatusIfNoLearningProcessIsActive() throws Exception {
        final Response res = learnerApi.getStatus(project.getId(), jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final var status = objectMapper.readValue(res.readEntity(String.class), LearnerStatus.class);
        assertEquals(0, status.getQueue().size());
        assertNull(status.getCurrentProcess());
    }

    private void assertLearnerResult(LearnerResult result, LearnerResult.Status status, int numSteps, int numStates) {
        assertEquals(status, result.getStatus());
        assertFalse(result.isError());
        assertEquals(numSteps, result.getSteps().size());
        assertEquals(numStates, result.getSteps().get(numSteps - 1).getHypothesis().getNodes().size());
    }

    private LearnerResult learn(Long testNo) throws Exception {
        await().atMost(10, TimeUnit.SECONDS)
                .pollInSameThread()
                .pollDelay(Duration.ofSeconds(1))
                .pollInterval(Duration.ofSeconds(1))
                .until(() -> {
                    final var result = getLearnerResult(project.getId(), testNo, jwt);
                    return !isLearnerProcessActive(result);
                });

        return getLearnerResult(project.getId(), testNo, jwt);
    }

    private boolean isLearnerProcessActive(LearnerResult result) {
        return result.getStatus().equals(LearnerResult.Status.PENDING)
                || result.getStatus().equals(LearnerResult.Status.IN_PROGRESS);
    }

    private boolean isLearnerProcessAbortedOrFinished(LearnerResult result) {
        return result.getStatus().equals(LearnerResult.Status.ABORTED)
                || result.getStatus().equals(LearnerResult.Status.FINISHED);
    }

    private LearnerResult getLearnerResult(Long projectId, Long testNo, String jwt) throws JsonProcessingException {
        final var res = learnerResultApi.get(projectId, testNo, jwt);
        return objectMapper.readValue(res.readEntity(String.class), LearnerResult.class);
    }

    private void abortLearningProcess(String jwtInitiator, String jwtAborter) throws IOException {
        final var res1 = learnerApi.start(project.getId(), startConfiguration, jwtInitiator);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        var result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isLearnerProcessActive(result));

        final var res2 = learnerApi.abort(project.getId(), result.getTestNo(), jwtAborter);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        // eventually the result will be aborted or finished
        final var finalResult = result;
        await().atMost(10, TimeUnit.SECONDS).until(() -> {
            final var r = getLearnerResult(project.getId(), finalResult.getTestNo(), jwtInitiator);
            return isLearnerProcessAbortedOrFinished(r);
        });

        result = getLearnerResult(project.getId(), finalResult.getTestNo(), jwtInitiator);
        assertTrue(isLearnerProcessAbortedOrFinished(result));
    }
}
