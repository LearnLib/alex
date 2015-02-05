package de.learnlib.weblearner.integrationtests;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.weblearner.entities.Symbol;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
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
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class RESTSymbolLearnerIT extends JerseyTest {

    private static final int MAX_TIME_TO_WAIT_FOR_LEARNER = 180000; // three minutes !!
    private static final int TIME_TO_WAIT_BETWEEN_POLLS = 2000; // three minutes !!

    private static final String BASE_LEARNER_URL = "http://localhost:8080/rest";
    private static final String BASE_TEST_URL = "http://localhost:9998/test";

    private LearnerTestHelper testHelper;
    private Client client;
    private Project project;
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

    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
        client = ClientBuilder.newClient();

        // create project
        String projectName = "RestSymbolLearn IT Project";
        String json =  "{\"name\": \"" + projectName + "\","
                        + "\"baseUrl\": \"" + BASE_TEST_URL + "\"}";
        Response response = client.target(BASE_LEARNER_URL + "/projects").request().post(Entity.json(json));
        project = response.readEntity(Project.class);

        // modify reset symbol
        String path = BASE_LEARNER_URL + "/projects/" + project.getId() + "/symbols/2";
        response = client.target(path).request().get();
        RESTSymbol resetSymbol = (RESTSymbol) response.readEntity(Symbol.class);
        List<RESTSymbolAction> restActions = resetSymbol.getActions();
        ((CallAction) restActions.get(0)).setUrl("/reset");
        client.target(path).request().put(Entity.json(resetSymbol));

        // create symbols
        // symbol 1
        String symbolName = "RESTSymbolLearnerIT REST Symbol 1";
        String symbolAbbr = "learnrest1";
        json = "{\"type\": \"rest\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"call\", \"method\" : \"GET\", \"url\": \"/\"},"
                    + "{\"type\": \"checkStatus\", \"status\" : 200}"
                + "]}";
        Symbol<?> symbol1 = testHelper.addSymbol(client, project, json);

        // symbol 2
        symbolName = "RESTSymbolLearnerIT REST Symbol 2";
        symbolAbbr = "learnrest2";
        json = "{\"type\": \"rest\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"call\", \"method\" : \"GET\", \"url\": \"/entity\"},"
                    + "{\"type\": \"checkAttributeValue\", \"attribute\" : \"field1\", \"value\": \"Hello\"}"
                + "]}";
        Symbol<?> symbol2 = testHelper.addSymbol(client, project, json);

        // remember symbol references
        symbolsIdAndRevisionAsJSON = "{\"id\": " + symbol1.getId() + ", \"revision\": " + symbol1.getRevision() + "},"
                                   + "{\"id\": " + symbol2.getId() + ", \"revision\": " + symbol2.getRevision() + "}";

        // remember alphabet
        testAlphabet = new SimpleAlphabet<>();
        testAlphabet.add(symbol1.getAbbreviation());
        testAlphabet.add(symbol2.getAbbreviation());
    }

    @Override
    @After
    public void tearDown() {
        client.target(BASE_LEARNER_URL + "/projects/" + project.getId()).request().delete();
        symbolsIdAndRevisionAsJSON = null;
        testAlphabet = null;
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void simpleLearnProcess() throws Exception {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "], \"eqOracle\":"
                        + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                        + "\"algorithm\": \"DHC\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        result.setJSON(resultAsJSON);
        assertTrue(testHelper.hypothesisIsEqualToTheExpectedOne(result.getHypothesis(), testAlphabet, "rest"));
    }

}
