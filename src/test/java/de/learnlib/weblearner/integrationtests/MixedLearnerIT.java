package de.learnlib.weblearner.integrationtests;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.ProjectTest;
import de.learnlib.weblearner.entities.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.util.List;

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
                + "{\"type\": \"goto\", \"url\": \"/web/reset\"},"
                + "{\"type\": \"call\", \"method\" : \"GET\", \"url\": \"/rest/reset\"}"
             + "]}";
        Symbol resetSymbol = testHelper.addSymbol(client, project, json);
        resetSymbolIdAndRevisionAsJSON = testHelper.createIdRevsionPairListAsJSON(resetSymbol);

        // create symbols
        Symbol[] symbols = new Symbol[2];

        // rest symbol 1
        String symbolName = "MixedLearnerIT REST Symbol 1";
        String symbolAbbr = "learnrest1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"call\", \"method\" : \"GET\", \"url\": \"/test\"},"
                    + "{\"type\": \"checkStatus\", \"status\" : 200}"
                + "]}";
        symbols[0] = testHelper.addSymbol(client, project, json);

        // web symbol 1
        symbolName = "MixedLearnerIT Web Symbol 1";
        symbolAbbr = "learnweb1";
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"goto\", \"url\": \"/web/page1\"},"
                    + "{\"type\": \"checkText\", \"value\": \"Lorem Ipsum\"}"
                + "]}";
        symbols[1] = testHelper.addSymbol(client, project, json);

        // remember symbol references
        symbolsIdAndRevisionAsJSON = testHelper.createIdRevsionPairListAsJSON(symbols);

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
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        System.out.println("&&&&&&& " + resultAsJSON);
        result.setJSON(resultAsJSON);
    }

}
