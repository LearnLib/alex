/*
 * Copyright 2015 - 2021 TU Dortmund
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
import com.fasterxml.jackson.core.JsonProcessingException;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.LearnerResultApi;
import de.learnlib.alex.integrationtests.resources.api.LearnerSetupApi;
import de.learnlib.alex.integrationtests.resources.api.LtsFormulaSuiteApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.learning.entities.LearnerOptions;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import static org.awaitility.Awaitility.await;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class LearnerSetupResourceIT extends AbstractResourceIT {

    private LearnerSetupApi learnerSetupApi;
    private LearnerResultApi learnerResultApi;
    private LtsFormulaSuiteApi ltsFormulaSuiteApi;

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
        ltsFormulaSuiteApi = new LtsFormulaSuiteApi(client, port);

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
    public void startLearningProcessFromSetupWithoutOptions() throws IOException {
        startLearningFromSetup(null, "testSetup");
    }

    @Test
    public void startLearningProcessFromSetupWithOptions() throws IOException {
        final String comment = "testComment";
        final LearnerOptions options = new LearnerOptions();
        options.setComment(comment);
        startLearningFromSetup(options, comment);
    }

    private void startLearningFromSetup(LearnerOptions options, String expectedComment) throws IOException {
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
        assertTrue(result.getStatus().equals(LearnerResult.Status.IN_PROGRESS)
                || result.getStatus().equals(LearnerResult.Status.PENDING));

        LearnerResult finalResult = result;
        await().atMost(10, TimeUnit.SECONDS).until(() -> {
            final var r = getLearnerResult(project.getId(), finalResult.getTestNo(), jwt);
            return r.getStatus().equals(LearnerResult.Status.FINISHED)
                    || r.getStatus().equals(LearnerResult.Status.ABORTED);
        });

        result = getLearnerResult(project.getId(), result.getTestNo(), jwt);

        assertEquals(LearnerResult.Status.FINISHED, result.getStatus());
        assertEquals(expectedComment, result.getComment());
        assertEquals(1, result.getSteps().size());
        assertEquals(1, result.getSteps().get(0).getHypothesis().getNodes().size());
        assertNotEquals(setup.getId(), result.getSetup().getId());
        assertFalse(result.isError());
    }

    private LearnerResult getLearnerResult(Long projectId, Long testNo, String jwt) throws JsonProcessingException {
        final Response res = learnerResultApi.get(projectId, testNo, jwt);
        return objectMapper.readValue(res.readEntity(String.class), LearnerResult.class);
    }

    @Test
    public void shouldNotCreateLearnerSetupWithoutPreSymbol() {
        LearnerSetup ls = createDefaultLearnerSetup();
        ls.setPreSymbol(null);

        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, getAllSetups().size());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void shouldNotCreateLearnerSetupWithoutAlphabet() {
        LearnerSetup ls = createDefaultLearnerSetup();
        ls.setSymbols(new ArrayList<>());

        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, getAllSetups().size());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void shouldCreateLearnerSetup() {
        final LearnerSetup ls = createDefaultLearnerSetup();
        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        final LearnerSetup createdSetup = res.readEntity(LearnerSetup.class);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(1, getAllSetups().size());
        assertNotNull(createdSetup.getModelCheckingConfig());
        compareTo(ls, createdSetup);
    }

    @Test
    public void shouldCreateLearnerSetupWithModelCheckingConfig() {
        final var fs1 = createFormulaSuite(project.getId(), "suite1", jwt);
        final var fs2 = createFormulaSuite(project.getId(), "suite2", jwt);

        final var ls = createDefaultLearnerSetup();
        ls.getModelCheckingConfig().getFormulaSuites().add(fs1);
        ls.getModelCheckingConfig().getFormulaSuites().add(fs2);

        final var res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());

        final var createdSetup = res.readEntity(LearnerSetup.class);
        final var config = createdSetup.getModelCheckingConfig();
        assertNotNull(config);
        assertEquals(2, config.getFormulaSuites().size());
        assertTrue(config.getFormulaSuites().stream().anyMatch(fs -> fs.getName().equals("suite1")));
        assertTrue(config.getFormulaSuites().stream().anyMatch(fs -> fs.getName().equals("suite2")));
    }

    @Test
    public void shouldUpdateModelCheckingConfigOfLearnerSetup() {
        final var fs1 = createFormulaSuite(project.getId(), "suite1", jwt);
        final var fs2 = createFormulaSuite(project.getId(), "suite2", jwt);

        final var ls = createDefaultLearnerSetup();
        ls.getModelCheckingConfig().getFormulaSuites().add(fs1);
        ls.getModelCheckingConfig().getFormulaSuites().add(fs2);

        final var res = learnerSetupApi.create(project.getId(), ls, jwt);
        final var createdSetup = res.readEntity(LearnerSetup.class);
        final var config = createdSetup.getModelCheckingConfig();

        // change properties and remove a suite
        config.setMinUnfolds(5);
        config.setMultiplier(0.5);
        config.getFormulaSuites().removeIf(fs -> fs.getName().equals("suite1"));

        // update
        final var res2 = learnerSetupApi.update(project.getId(), createdSetup.getId(), createdSetup, jwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        final var updatedSetup = res2.readEntity(LearnerSetup.class);
        final var updatedConfig = updatedSetup.getModelCheckingConfig();

        // verify updated properties
        assertNotNull(updatedConfig);
        assertEquals(5, (long) updatedConfig.getMinUnfolds());
        assertEquals(0.5, updatedConfig.getMultiplier(), 0.0);
        assertEquals(1, updatedConfig.getFormulaSuites().size());
        assertTrue(updatedConfig.getFormulaSuites().stream().noneMatch(fs -> fs.getName().equals("suite1")));
    }

    private LtsFormulaSuite createFormulaSuite(Long projectId, String name, String jwt) {
        final var fs = new LtsFormulaSuite();
        fs.setName(name);

        final var res = ltsFormulaSuiteApi.create(projectId, fs, jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());

        return res.readEntity(LtsFormulaSuite.class);
    }

    @Test
    public void shouldFailToCreateLearnerSetupWithoutModelCheckingConfig() {
        final LearnerSetup ls = createDefaultLearnerSetup();
        ls.setModelCheckingConfig(null);

        final Response res = learnerSetupApi.create(project.getId(), ls, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        assertEquals(0, getAllSetups().size());
    }

    @Test
    public void shouldDeleteLearnerSetup() {
        final LearnerSetup ls = learnerSetupApi.create(project.getId(), createDefaultLearnerSetup(), jwt)
                .readEntity(LearnerSetup.class);

        final Response res = learnerSetupApi.delete(project.getId(), ls.getId(), jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));
        assertEquals(0, getAllSetups().size());
    }

    @Test
    public void shouldCopyLearnerSetup() {
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
                .readEntity(new GenericType<>() {
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
        for (ParameterizedSymbol ps : ls1.getSymbols()) {
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
        final var webDriverConfig = new WebDriverConfig();
        webDriverConfig.setBrowser("chrome");
        ls.setWebDriver(webDriverConfig);
        ls.setEquivalenceOracle(new MealyRandomWordsEQOracleProxy());
        ls.setPreSymbol(new ParameterizedSymbol(symbols.get(0)));
        ls.setSymbols(symbols.stream()
                .map(ParameterizedSymbol::new)
                .collect(Collectors.toList()));
        return ls;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreLearnerResultFieldsMixin {
        @JsonIgnore
        abstract void setStatistics(Statistics statistics);

        @JsonIgnore
        @JsonProperty("error")
        abstract void setError(Boolean error);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreLearnerResultStepFieldsMixin {
        @JsonIgnore
        abstract void setStatistics(Statistics statistics);

        @JsonIgnore
        @JsonProperty("error")
        abstract void setError(boolean error);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreLearnerStatusFieldsMixin {
    }
}
