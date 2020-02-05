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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.LearnerResultApi;
import de.learnlib.alex.integrationtests.resources.api.LearnerSetupApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.learning.entities.LearnerOptions;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.learning.entities.webdrivers.HtmlUnitDriverConfig;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class LearnerSetupResourceIT extends AbstractResourceIT {

    private LearnerSetupApi learnerSetupApi;
    private LearnerResultApi learnerResultApi;

    private Project project;
    private List<Symbol> symbols;
    private String jwt;

    @Before
    public void pre() throws Exception {
        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);
        final SymbolApi symbolApi = new SymbolApi(client, port);

        learnerSetupApi = new LearnerSetupApi(client, port);
        learnerResultApi = new LearnerResultApi(client, port);

        jwt = userApi.login("admin@alex.example", "admin");
        project = projectApi.create("{\"name\":\"test\",\"url\":\"http://" + InetAddress.getLocalHost().getHostName() + " :" + port + "\"}", jwt)
                .readEntity(Project.class);

        final SetVariableAction action1 = new SetVariableAction();
        action1.setName("v1");
        action1.setValue("val1");

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(action1);

        final SetVariableAction action2 = new SetVariableAction();
        action2.setName("v2");
        action2.setValue("val2");

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(action2);

        final Symbol s1 = new Symbol();
        s1.setProject(project);
        s1.setName("s1");
        s1.getSteps().add(step1);

        final Symbol s2 = new Symbol();
        s2.setProject(project);
        s2.setName("s2");
        s2.getSteps().add(step2);

        symbols = new ArrayList<>();
        symbols.add(symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(s1), jwt)
                .readEntity(Symbol.class));
        symbols.add(symbolApi.create(project.getId().intValue(), objectMapper.writeValueAsString(s2), jwt)
                .readEntity(Symbol.class));
    }

    @Test
    public void startLearningProcessFromSetupWithoutOptions() throws InterruptedException, IOException {
        startLearningFromSetup(null, null);
    }

    @Test
    public void startLearningProcessFromSetupWithOptions() throws InterruptedException, IOException {
        final String comment = "testComment";
        final LearnerOptions options = new LearnerOptions();
        options.setComment(comment);
        startLearningFromSetup(options, comment);
    }

    private void startLearningFromSetup(LearnerOptions options, String expectedComment) throws InterruptedException, IOException {
        objectMapper.addMixIn(LearnerResult.class, IgnoreLearnerResultFieldsMixin.class);
        objectMapper.addMixIn(LearnerResultStep.class, IgnoreLearnerResultStepFieldsMixin.class);

        final LearnerSetup setup = learnerSetupApi.create(project.getId(), createDefaultLearnerSetup(), jwt)
                .readEntity(LearnerSetup.class);

        final Response res;
        if (options == null) {
            res = learnerSetupApi.run(project.getId(), setup.getId(), jwt);
        } else {
            res = learnerSetupApi.run(project.getId(), setup.getId(), options, jwt);
        }
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        LearnerResult result = objectMapper.readValue(res.readEntity(String.class), LearnerResult.class);
        assertEquals(LearnerResult.Status.IN_PROGRESS, result.getStatus());

        while (result.getStatus() != LearnerResult.Status.FINISHED
                && result.getStatus() != LearnerResult.Status.ABORTED) {
            final Response res2 = learnerResultApi.get(project.getId(), result.getTestNo(), jwt);
            result = objectMapper.readValue(res2.readEntity(String.class), LearnerResult.class);
            Thread.sleep(3000);
        }

        assertEquals(LearnerResult.Status.FINISHED, result.getStatus());
        assertEquals(expectedComment, result.getComment());
        assertEquals(1, result.getSteps().size());
        assertEquals(1, result.getSteps().get(0).getHypothesis().getNodes().size());
        assertNotEquals(setup.getId(), result.getSetup().getId());
        assertFalse(result.isError());
    }

    @Test
    public void cannotCreateLearnerSetupWithoutPreSymbol() {
        LearnerSetup ls = createDefaultLearnerSetup();
        ls.setPreSymbol(null);

        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, getAllSetups().size());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void cannotCreateLearnerSetupWithoutAlphabet() {
        LearnerSetup ls = createDefaultLearnerSetup();
        ls.setSymbols(new ArrayList<>());

        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, getAllSetups().size());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void createLearnerSetup() {
        final LearnerSetup ls = createDefaultLearnerSetup();
        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        final LearnerSetup createdSetup = res.readEntity(LearnerSetup.class);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(1, getAllSetups().size());
        compareTo(ls, createdSetup);
    }

    @Test
    public void deleteSetup() {
        final LearnerSetup ls = learnerSetupApi.create(project.getId(), createDefaultLearnerSetup(), jwt)
                .readEntity(LearnerSetup.class);

        final Response res = learnerSetupApi.delete(project.getId(), ls.getId(), jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));
        assertEquals(0, getAllSetups().size());
    }

    @Test
    public void copySetup() {
        final LearnerSetup ls = learnerSetupApi.create(project.getId(), createDefaultLearnerSetup(), jwt)
                .readEntity(LearnerSetup.class);

        final Response res = learnerSetupApi.copy(project.getId(), ls.getId(), jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(2, getAllSetups().size());

        final LearnerSetup copiedSetup = res.readEntity(LearnerSetup.class);
        compareTo(ls, copiedSetup);
    }

    @Test
    public void shouldNotChangeSavedFlag() {
        final LearnerSetup ls = learnerSetupApi.create(project.getId(), createDefaultLearnerSetup(), jwt)
                .readEntity(LearnerSetup.class);

        ls.setSaved(false);

        final Response res = learnerSetupApi.update(project.getId(), ls.getId(), ls, jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(1, getAllSetups().size());

        final LearnerSetup updatedSetup = res.readEntity(LearnerSetup.class);
        assertTrue(updatedSetup.isSaved());
    }

    private List<LearnerSetup> getAllSetups() {
        return learnerSetupApi.getAll(project.getId(), jwt)
                .readEntity(new GenericType<List<LearnerSetup>>(){
                });
    }

    private void compareTo(LearnerSetup ls1, LearnerSetup ls2) {
        assertNotNull(ls2.getId());
        assertNotNull(ls2.getWebDriver());
        assertNotNull(ls2.getAlgorithm());
        assertNotNull(ls2.getEquivalenceOracle());
        assertTrue(ls2.isSaved());

        assertEquals(ls1.getName(), ls2.getName());
        assertEquals(ls1.isEnableCache(), ls2.isEnableCache());
        assertEquals(ls1.getPreSymbol().getSymbol().getId(), ls2.getPreSymbol().getSymbol().getId());
        for (ParameterizedSymbol ps: ls1.getSymbols()) {
            assertEquals(1, ls2.getSymbols().stream()
                    .filter(s -> s.getSymbol().getId().equals(ps.getSymbol().getId()))
                    .count());
        }
    }

    private LearnerSetup createDefaultLearnerSetup() {
        final LearnerSetup ls = new LearnerSetup();
        ls.setProject(project);
        ls.setEnvironments(project.getEnvironments());
        ls.setEnableCache(true);
        ls.setName("testSetup");
        ls.setAlgorithm(new TTT());
        ls.setWebDriver(new HtmlUnitDriverConfig());
        ls.setEquivalenceOracle(new MealyRandomWordsEQOracleProxy());
        ls.setPreSymbol(new ParameterizedSymbol(symbols.get(0)));
        ls.setSymbols(symbols.stream()
                .map(ParameterizedSymbol::new)
                .collect(Collectors.toList()));
        return ls;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static abstract class IgnoreLearnerResultFieldsMixin {
        @JsonIgnore abstract void setStatistics(Statistics statistics);
        @JsonIgnore @JsonProperty("error") abstract void setError(Boolean error);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static abstract class IgnoreLearnerResultStepFieldsMixin {
        @JsonIgnore abstract void setStatistics(Statistics statistics);
        @JsonIgnore @JsonProperty("error") abstract void setError(boolean error);
    }
}
