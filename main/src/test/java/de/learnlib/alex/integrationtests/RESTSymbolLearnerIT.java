package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ProjectTest;
import de.learnlib.alex.core.entities.Symbol;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
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
import static org.junit.Assert.assertTrue;

public class RESTSymbolLearnerIT extends JerseyTest {

    private static final int MAX_TIME_TO_WAIT_FOR_LEARNER = 180000; // three minutes !!
    private static final int SYMBOLS_AMOUNT = 3;
    private static final String BASE_LEARNER_URL = "http://localhost:8080/rest";
    private static final String BASE_TEST_URL = "http://localhost:9998/test";

    private LearnerTestHelper testHelper;
    private Client client;
    private Project project;
    private String resetSymbolIdAndRevisionAsJSON;
    private String symbolsIdAndRevisionAsJSON;
    private Alphabet<String> testAlphabet;

    public static class RESTTestApplication extends ResourceConfig {
        public RESTTestApplication() {
            super(RESTTestResource.class);
        }
    }

    public RESTSymbolLearnerIT() {
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
                + "{\"type\": \"rest_call\", \"method\" : \"GET\", \"url\": \"/reset\"}]}";
        Symbol resetSymbol = testHelper.addSymbol(client, project, json);
        resetSymbolIdAndRevisionAsJSON = testHelper.createIdRevisionPairListAsJSON(resetSymbol);

        // create test symbols
        Symbol[] symbols = new Symbol[SYMBOLS_AMOUNT];

        // symbol 1
        String symbolName = "RESTSymbolLearnerIT REST Symbol 1";
        String symbolAbbr = "learnrest1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"rest_call\", \"method\" : \"GET\", \"url\": \"/\", \"headers\": {"
                                + "\"X-CustomHeader\": \"Foo\""
                        + "}, \"cookies\": {"
                                + "\"MyCookie\": \"Bar\""
                        + "}},"
                    + "{\"type\": \"rest_checkStatus\", \"status\" : 200},"
                    + "{\"type\": \"rest_checkForText\", \"value\": \"Foo:Bar\"}"
                + "]}";
        symbols[0] = testHelper.addSymbol(client, project, json);

        // symbol 2
        symbolName = "RESTSymbolLearnerIT REST Symbol 2";
        symbolAbbr = "learnrest2";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"rest_call\", \"method\" : \"GET\", \"url\": \"/entity\"},"
                    + "{\"type\": \"rest_checkAttributeValue\", \"attribute\": \"field1\", \"value\": \"Hello\"}"
                + "]}";
        symbols[1] = testHelper.addSymbol(client, project, json);

        // symbol 3
        symbolName = "RESTSymbolLearnerIT REST Symbol 3";
        symbolAbbr = "learnrest3";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"rest_checkStatus\", \"status\" : 500, \"negated\": true}"
                + "]}";
        symbols[2] = testHelper.addSymbol(client, project, json);

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
                        + "\"resetSymbol\": " + resetSymbolIdAndRevisionAsJSON + " , \"eqOracle\":"
                            + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                            + "\"algorithm\": \"TTT\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        System.out.println(resultAsJSON);
        result.setJSON(resultAsJSON);

        Word<String> separatingWord = testHelper.getSeparatingWord(result.getHypothesis(), testAlphabet, "rest");
        assertTrue("The hypothesis is not correct: " + separatingWord, separatingWord == null);
    }

}
