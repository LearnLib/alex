/*
 * Copyright 2015 - 2020 TU Dortmund
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

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByJSONAttributeAction;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.rest.CheckStatusAction;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.LearnerApi;
import de.learnlib.alex.integrationtests.resources.api.LearnerResultApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SymbolSet;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.entities.webdrivers.HtmlUnitDriverConfig;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class LearnerResourceIT extends AbstractResourceIT {

    private String jwt;
    private Project project;
    private LearnerStartConfiguration startConfiguration;
    private LearnerApi learnerApi;
    private LearnerResultApi learnerResultApi;
    private SymbolApi symbolApi;
    private String memberJwt;

    @Before
    public void pre() throws Exception {
        objectMapper.addMixIn(LearnerResult.class, LearnerSetupResourceIT.IgnoreLearnerResultFieldsMixin.class);
        objectMapper.addMixIn(LearnerResultStep.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);
        objectMapper.addMixIn(LearnerStatus.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);
        objectMapper.addMixIn(ExecuteResult.class, LearnerSetupResourceIT.IgnoreLearnerResultStepFieldsMixin.class);

        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);
        symbolApi = new SymbolApi(client, port);
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

        final ParameterizedSymbol resetSymbol = createResetSymbol();
        final ParameterizedSymbol authSymbol = createAuthSymbol();
        final ParameterizedSymbol getProfileSymbol = createGetProfileSymbol();

        final MealyRandomWordsEQOracleProxy eqOracleProxy = new MealyRandomWordsEQOracleProxy();
        eqOracleProxy.setBatchSize(1);
        eqOracleProxy.setMinLength(3);
        eqOracleProxy.setMaxLength(3);
        eqOracleProxy.setMaxNoOfTests(3);

        final LearnerSetup learnerSetup = new LearnerSetup();
        learnerSetup.setProject(project);
        learnerSetup.setPreSymbol(resetSymbol);
        learnerSetup.setSymbols(Arrays.asList(authSymbol, getProfileSymbol));
        learnerSetup.setWebDriver(new HtmlUnitDriverConfig());
        learnerSetup.setEquivalenceOracle(eqOracleProxy);
        learnerSetup.setAlgorithm(new TTT());
        learnerSetup.setEnvironments(project.getEnvironments());

        startConfiguration = new LearnerStartConfiguration();
        startConfiguration.setSetup(learnerSetup);
    }

    @Test
    public void startLearningProcess() throws Exception {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

        result = learn(result.getTestNo());
        assertLearnerResult(result, LearnerResult.Status.FINISHED, 2, 2);
    }

    @Test
    public void resumeLearningProcess() throws Exception {
        startConfiguration.getSetup().setEquivalenceOracle(new SampleEQOracleProxy());

        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

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

        result = objectMapper.readValue(res2.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

        result = learn(result.getTestNo());
        assertLearnerResult(result, LearnerResult.Status.FINISHED, 2, 2);
    }

    @Test
    public void abortLearningProcessAsOwner() throws IOException {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, memberJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

        final Response res2 = learnerApi.abort(project.getId(), result.getTestNo(), jwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
    }

    @Test
    public void abortOwnLearningProcessAsMember() throws IOException {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, memberJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

        final Response res2 = learnerApi.abort(project.getId(), result.getTestNo(), memberJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
    }

    @Test
    public void failToAbortLearningProcessAsMember() throws IOException {
        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);
        assertTrue(isActive(result));

        final Response res2 = learnerApi.abort(project.getId(), result.getTestNo(), memberJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
    }

    @Test
    public void failToResumeWithInvalidStepToContinueFrom() throws Exception {
        startConfiguration.getSetup().setEquivalenceOracle(new SampleEQOracleProxy());

        final Response res1 = learnerApi.start(project.getId(), startConfiguration, jwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final LearnerResult result = objectMapper.readValue(res1.readEntity(String.class), LearnerResult.class);

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
    public void resumeLearningProcessAndAddSymbol() throws Exception {
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
    public void getStatusIfNoLearningProcessIsActive() throws Exception {
        final Response res = learnerApi.getStatus(project.getId(), jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final LearnerStatus status = objectMapper.readValue(res.readEntity(String.class), LearnerStatus.class);
        assertEquals(0, status.getQueue().size());
        assertNull(status.getCurrentProcess());
    }

    @Test
    public void readOutputs() throws Exception {
        final SymbolSet symbolSet = new SymbolSet();
        symbolSet.setSymbols(startConfiguration.getSetup().getSymbols());
        symbolSet.setResetSymbol(startConfiguration.getSetup().getPreSymbol());

        final ReadOutputConfig config = new ReadOutputConfig();
        config.setSymbols(symbolSet);
        config.setDriverConfig(startConfiguration.getSetup().getWebDriver());

        final Response res = learnerApi.readOutput(project.getId(), config, jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final List<ExecuteResult> outputs = Arrays.asList(objectMapper.readValue(res.readEntity(String.class), ExecuteResult[].class));
        assertEquals(2, outputs.size());
    }

    private ParameterizedSymbol createResetSymbol() throws Exception {
        final SetVariableAction action = new SetVariableAction();
        action.setValue("test");
        action.setName("var");

        final SymbolActionStep step = new SymbolActionStep();
        step.setAction(action);

        Symbol resetSymbol = new Symbol();
        resetSymbol.setProject(project);
        resetSymbol.setName("reset");
        resetSymbol.getSteps().add(step);

        resetSymbol = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(resetSymbol), jwt)
                .readEntity(Symbol.class);

        final ParameterizedSymbol pResetSymbol = new ParameterizedSymbol();
        pResetSymbol.setSymbol(resetSymbol);

        return pResetSymbol;
    }

    private ParameterizedSymbol createAuthSymbol() throws Exception {
        final CallAction a1 = new CallAction();
        a1.setUrl("/rest/users/login");
        a1.setBaseUrl("Base");
        a1.setMethod(CallAction.Method.POST);
        a1.setData("{\"email\":\"" + ADMIN_EMAIL + "\",\"password\":\"" + ADMIN_PASSWORD + "\"}");

        final CheckStatusAction a0 = new CheckStatusAction();
        a0.setStatus(200);

        final SymbolActionStep step0 = new SymbolActionStep();
        step0.setAction(a0);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a1);

        final SetVariableByJSONAttributeAction a2 = new SetVariableByJSONAttributeAction();
        a2.setName("jwt");
        a2.setValue("token");

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a2);

        final SymbolOutputParameter output = new SymbolOutputParameter();
        output.setParameterType(SymbolParameter.ParameterType.STRING);
        output.setName("jwt");

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setName("auth");
        symbol.getSteps().add(step1);
        symbol.getSteps().add(step0);
        symbol.getSteps().add(step2);
        symbol.getOutputs().add(output);

        symbol = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(symbol), jwt)
                .readEntity(Symbol.class);

        final ParameterizedSymbol pS1 = new ParameterizedSymbol();
        pS1.setSymbol(symbol);

        final SymbolOutputMapping som = new SymbolOutputMapping();
        som.setName("jwt");
        som.setParameter(symbol.getOutputs().get(0));
        pS1.getOutputMappings().add(som);

        return pS1;
    }

    private ParameterizedSymbol createGetProfileSymbol() throws Exception {
        final HashMap<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer: {{$jwt}}");

        final CallAction a1 = new CallAction();
        a1.setUrl("/rest/users/myself");
        a1.setBaseUrl("Base");
        a1.setMethod(CallAction.Method.GET);
        a1.setHeaders(headers);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a1);

        final CheckStatusAction a2 = new CheckStatusAction();
        a2.setStatus(200);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a2);

        final SymbolInputParameter input = new SymbolInputParameter();
        input.setParameterType(SymbolParameter.ParameterType.STRING);
        input.setName("jwt");

        Symbol s2 = new Symbol();
        s2.setProject(project);
        s2.setName("s2");
        s2.getSteps().add(step1);
        s2.getSteps().add(step2);
        s2.getInputs().add(input);

        s2 = symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(s2), jwt)
                .readEntity(Symbol.class);

        final SymbolParameterValue spv = new SymbolParameterValue();
        spv.setValue("{{$jwt}}");
        spv.setParameter(s2.getInputs().get(0));

        final ParameterizedSymbol pS2 = new ParameterizedSymbol();
        pS2.getParameterValues().add(spv);
        pS2.setSymbol(s2);

        return pS2;
    }

    private void assertLearnerResult(LearnerResult result, LearnerResult.Status status, int numSteps, int numStates) {
        assertEquals(status, result.getStatus());
        assertFalse(result.isError());
        assertEquals(numSteps, result.getSteps().size());
        assertEquals(numStates, result.getSteps().get(numSteps - 1).getHypothesis().getNodes().size());
    }

    private LearnerResult learn(Long testNo) throws Exception {
        LearnerResult result = null;
        while (result == null || (result.getStatus() != LearnerResult.Status.FINISHED
                && result.getStatus() != LearnerResult.Status.ABORTED)) {
            final Response res = learnerResultApi.get(project.getId(), testNo, jwt);
            result = objectMapper.readValue(res.readEntity(String.class), LearnerResult.class);
            Thread.sleep(1000);
        }

        return result;
    }

    private boolean isActive(LearnerResult result) {
        return result.getStatus().equals(LearnerResult.Status.PENDING)
                || result.getStatus().equals(LearnerResult.Status.IN_PROGRESS);
    }
}
