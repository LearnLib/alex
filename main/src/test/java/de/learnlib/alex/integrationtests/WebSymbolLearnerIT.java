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
import net.automatalib.words.Word;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@Ignore
public class WebSymbolLearnerIT {

    private static final int MAX_TIME_TO_WAIT_FOR_LEARNER = 300000; // five minutes !!

    private static final String BASE_LEARNER_URL = "http://localhost:8080/rest";
    private static final String BASE_TEST_URL = "file://" + System.getProperty("user.dir")
                                                + "/src/test/resources/integrationtest";

    private LearnerTestHelper testHelper;
    private Client client;
    private Project project;
    private String resetSymbolIdAndRevisionAsJSON;
    private String symbolsIdAndRevisionAsJSON;
    private Alphabet<String> testAlphabet;

    public WebSymbolLearnerIT() {
        this.testHelper = new LearnerTestHelper(BASE_LEARNER_URL);
    }

    @Before
    public void setUp() throws IOException {
        client = ClientBuilder.newClient();

        // create project
        String projectName = "WebSymbolLearn IT Project";
        String json = "{\"name\": \"" + projectName + "\","
                    + "\"baseUrl\": \"" + BASE_TEST_URL + "\"}";
        Response response = client.target(BASE_LEARNER_URL + "/projects").request().post(
                Entity.entity(json, MediaType.APPLICATION_JSON));
        project = ProjectTest.readProject(response.readEntity(String.class));

        // create the reset symbol
        json = "{\"project\": " + project.getId() + ", \"name\": \"Reset\", \"abbreviation\": \"reset\","
             + "\"actions\": ["
                + "{\"type\": \"web_goto\", \"url\": \"/test_app.html\"}"
             + "]}";
        Symbol resetSymbol = testHelper.addSymbol(client, project, json);
        resetSymbolIdAndRevisionAsJSON = testHelper.createIdRevisionPairListAsJSON(resetSymbol);

        // create symbols
        Symbol[] symbols = new Symbol[4];

        // symbol 1
        String symbolName = "WebSymbolLearnerIT Web Symbol 1";
        String symbolAbbr = "learnweb1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"web_checkForText\", \"value\": \"Lorem Ipsum\"}"
                + "]}";
        symbols[0] = testHelper.addSymbol(client, project, json);

        // symbol 2
        symbolName = "WebSymbolLearnerIT Web Symbol 2";
        symbolAbbr = "learnweb2";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                + "{\"type\": \"web_click\", \"node\" : \"#link\"}"
                + "]}";
        symbols[1] = testHelper.addSymbol(client, project, json);

        // symbol 3
        symbolName = "WebSymbolLearnerIT Web Symbol 3";
        symbolAbbr = "learnweb3";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
//                + "{\"type\": \"web_click\", \"node\" : \"#link2\"}"
                    + "{\"type\": \"web_clickLinkByText\", \"value\" : \"The next awesome link\"}"
                + "]}";
        symbols[2] = testHelper.addSymbol(client, project, json);

        // symbol 4 - the 'included' one
        symbolName = "WebSymbolLearnerIT Web Symbol 4";
        symbolAbbr = "learnweb4";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"web_checkForText\", \"value\": \".*Test App - Page [0-9].*\","
                        + "\"regexp\": true}"
                + "]}";
        Symbol symbolToExecute = testHelper.addSymbol(client, project, json);

        // symbol 5 - the actual symbol
        symbolName = "WebSymbolLearnerIT Web Symbol 5";
        symbolAbbr = "learnweb5";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"executeSymbol\", \"symbolToExecute\":"
                        + testHelper.createIdRevisionPairListAsJSON(symbolToExecute) + "}"
                + "]}";
        symbols[3] = testHelper.addSymbol(client, project, json);

        // remember symbol references
        symbolsIdAndRevisionAsJSON = testHelper.createIdRevisionPairListAsJSON(symbols);

        // remember alphabet
        testAlphabet = testHelper.createTestAlphabet(symbols);
    }

    @After
    public void tearDown() {
        client.target(BASE_LEARNER_URL + "/projects/" + project.getId()).request().delete();
        resetSymbolIdAndRevisionAsJSON = null;
        symbolsIdAndRevisionAsJSON = null;
        testAlphabet = null;
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void simpleLearnProcess() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "],"
                    + "\"resetSymbol\": " + resetSymbolIdAndRevisionAsJSON + ", \"eqOracle\":"
                        + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                    + "\"algorithm\": \"TTT\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = response.readEntity(LearnerResult.class);

        Word<String> separatingWord = testHelper.getSeparatingWord(result.getHypothesis(), testAlphabet, "web");
        assertTrue("The hypothesis is not correct: " + separatingWord, separatingWord == null);
        assertTrue(result.getStatistics().getDuration() > 0);
        assertTrue(result.getStatistics().getEqsUsed() > 0);
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void learnProcessInSteps() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "],"
                    + "\"resetSymbol\": " + resetSymbolIdAndRevisionAsJSON + ", \"eqOracle\":"
                        + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                    + "\"maxAmountOfStepsToLearn\": 1, \"algorithm\": \"TTT\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // resume learning
        path = "/learner/resume/" + project.getId() + "/1";
        json = "{\"maxAmountOfStepsToLearn\": 1, \"eqOracle\":"
                + "{\"type\": \"complete\", \"minDepth\": 1, \"maxDepth\": 3}}";
        response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = response.readEntity(LearnerResult.class);

        Word<String> separatingWord = testHelper.getSeparatingWord(result.getHypothesis(), testAlphabet, "web");
        assertTrue("The hypothesis is not correct: " + separatingWord, separatingWord == null);
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void learnProcessInStepsWithManualCounterExample() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "],"
                    + "\"resetSymbol\": " + resetSymbolIdAndRevisionAsJSON + ", \"eqOracle\":"
                        + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                    + "\"maxAmountOfStepsToLearn\": 1, \"algorithm\": \"TTT\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // resume learning
        path = "/learner/resume/" + project.getId() + "/1";
        json = "{\"maxAmountOfStepsToLearn\": 0, \"eqOracle\":"
                + "{\"type\": \"sample\", \"counterExamples\": [["
                    + "{\"input\": \"learnweb2\", \"output\": \"OK\"}"
                + "], ["
                    + "{\"input\": \"learnweb2\", \"output\": \"OK\"},"
                    + "{\"input\": \"learnweb2\", \"output\": \"OK\"},"
                    + "{\"input\": \"learnweb3\", \"output\": \"OK\"}"
                + "]]}}";
        response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = response.readEntity(LearnerResult.class);

        Word<String> separatingWord = testHelper.getSeparatingWord(result.getHypothesis(), testAlphabet, "web");
        assertTrue("The hypothesis is not correct: " + separatingWord, separatingWord == null);
    }

}
