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

package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ProjectTest;
import de.learnlib.alex.core.entities.Symbol;
import net.automatalib.words.Alphabet;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;

public class MixedLearnerIT extends JerseyTest {

    private static final int MAX_TIME_TO_WAIT_FOR_LEARNER = 180000; // three minutes !!

    private static final String BASE_LEARNER_URL = "http://localhost:8080/rest";
    private static final String BASE_TEST_URL = "http://localhost:9998/";

    private LearnerTestHelper testHelper;
    private Client client;
    private Project project;
    private String resetSymbolIdAndRevisionAsJSON;
    private String symbolsIdAndRevisionAsJSON;
    private Alphabet<String> testAlphabet;

    public static class RESTTestApplication extends ResourceConfig {
        public RESTTestApplication() {
            super(RESTTestResource.class, WebTestResource.class);
        }
    }

    public MixedLearnerIT() {
        this.testHelper = new LearnerTestHelper(BASE_LEARNER_URL);
    }

    @Override
    protected Application configure() {
        RESTTestApplication testApplication = new RESTTestApplication();
        return testApplication;
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        client = ClientBuilder.newClient();

        // create project
        String projectName = "RestSymbolLearn IT Project";
        String json = "{\"name\": \"" + projectName + "\","
                    + "\"baseUrl\": \"" + BASE_TEST_URL + "\"}";
        Response response = client.target(BASE_LEARNER_URL + "/projects").request().post(Entity.json(json));
        project = ProjectTest.readProject(response.readEntity(String.class));

        // create the reset symbol
        json = "{\"project\": " + project.getId() + ", \"name\": \"Reset\", \"abbreviation\": \"reset\","
             + "\"actions\": ["
                + "{\"type\": \"web_goto\", \"url\": \"/web/reset\"},"
                + "{\"type\": \"rest_call\", \"method\" : \"GET\", \"url\": \"/rest/reset\"},"
                + "{\"type\": \"incrementCounter\", \"name\" : \"theCounter\"}"
             + "]}";
        Symbol resetSymbol = testHelper.addSymbol(client, project, json);
        resetSymbolIdAndRevisionAsJSON = testHelper.createIdRevisionPairListAsJSON(resetSymbol);

        // create symbols
        Symbol[] symbols = new Symbol[2];

        // rest symbol 1
        String symbolName = "MixedLearnerIT REST Symbol 1";
        String symbolAbbr = "learnrest1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"rest_call\", \"method\" : \"GET\", \"url\": \"/test\"},"
                    + "{\"type\": \"rest_checkStatus\", \"status\" : 200},"
                    + "{\"type\": \"incrementCounter\", \"name\" : \"theCounter\"}"
                + "]}";
        symbols[0] = testHelper.addSymbol(client, project, json);

        // web symbol 1
        symbolName = "MixedLearnerIT Web Symbol 1";
        symbolAbbr = "learnweb1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"web_goto\", \"url\": \"/web/page1\"},"
                    + "{\"type\": \"web_checkForText\", \"value\": \"Lorem Ipsum\"}"
                + "]}";
        symbols[1] = testHelper.addSymbol(client, project, json);

        // remember symbol references
        symbolsIdAndRevisionAsJSON = testHelper.createIdRevisionPairListAsJSON(symbols);

        // remember alphabet
        testAlphabet = testHelper.createTestAlphabet(symbols);
    }

    @After
    @Override
    public void tearDown() throws Exception {
        client.target(BASE_LEARNER_URL + "/projects/" + project.getId()).request().delete();
        resetSymbolIdAndRevisionAsJSON = null;
        symbolsIdAndRevisionAsJSON = null;
        testAlphabet = null;

        super.tearDown();
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void simpleLearnProcess() throws Exception {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "],"
                    + "\"resetSymbol\": " + resetSymbolIdAndRevisionAsJSON + ", \"eqOracle\":"
                        + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                    + "\"algorithm\": \"DISCRIMINATION_TREE\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = response.readEntity(LearnerResult.class);
    }

}
