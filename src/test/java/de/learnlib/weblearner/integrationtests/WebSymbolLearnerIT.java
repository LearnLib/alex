package de.learnlib.weblearner.integrationtests;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WebSymbolAction;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class WebSymbolLearnerIT {

    private static final int MAX_TIME_TO_WAIT_FOR_LEARNER = 180000; // three minutes !!

    private static final String BASE_LEARNER_URL = "http://localhost:8080/rest";
    private static final String BASE_TEST_URL = "file://" + System.getProperty("user.dir")
                                                + "/src/test/resources/integrationtest";

    private LearnerTestHelper testHelper;
    private Client client;
    private Project project;
    private String symbolsIdAndRevisionAsJSON;
    private Alphabet<String> testAlphabet;

    public WebSymbolLearnerIT() {
        this.testHelper = new LearnerTestHelper(BASE_LEARNER_URL);
    }

    @Before
    public void setUp() {
        client = ClientBuilder.newClient();

        // create project
        String projectName = "WebSymbolLearn IT Project";
        String json =  "{\"name\": \"" + projectName + "\","
                        + "\"baseUrl\": \"" + BASE_TEST_URL + "\"}";
        Response response = client.target(BASE_LEARNER_URL + "/projects").request().post(
                Entity.entity(json, MediaType.APPLICATION_JSON));
        project = response.readEntity(Project.class);

        // modify reset symbol
        String path = BASE_LEARNER_URL + "/projects/" + project.getId() + "/symbols/1";
        response = client.target(path).request().get();
        WebSymbol resetSymbol = (WebSymbol) response.readEntity(Symbol.class);
        List<WebSymbolAction> actions = resetSymbol.getActions();
        ((GotoAction) actions.get(0)).setUrl("/test_app.html");
        client.target(path).request().put(Entity.json(resetSymbol));

        // create symbols
        // symbol 1
        String symbolName = "WebSymbolLearnerIT Web Symbol 1";
        String symbolAbbr = "learnweb1";
        json = "{\"type\": \"web\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                + "{\"type\": \"checkText\", \"value\": \"Lorem Ipsum\"}"
                + "]}";
        Symbol<?> symbol1 = testHelper.addSymbol(client, project, json);

        // symbol 2
        symbolName = "WebSymbolLearnerIT Web Symbol 2";
        symbolAbbr = "learnweb2";
        json = "{\"type\": \"web\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                + "{\"type\": \"click\", \"node\" : \"#link\"}"
                + "]}";
        Symbol<?> symbol2 = testHelper.addSymbol(client, project, json);

        // symbol 3
        symbolName = "WebSymbolLearnerIT Web Symbol 3";
        symbolAbbr = "learnweb3";
        json = "{\"type\": \"web\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                + "{\"type\": \"click\", \"node\" : \"#link2\"}"
                + "]}";
        Symbol<?> symbol3 = testHelper.addSymbol(client, project, json);

        // symbol 4
        symbolName = "WebSymbolLearnerIT Web Symbol 4";
        symbolAbbr = "learnweb4";
        json = "{\"type\": \"web\", \"project\": " + project.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", \"actions\": ["
                    + "{\"type\": \"checkText\", \"value\": \".*Test App - Page [0-9].*\","
                    + "\"regexp\": true}"
                + "]}";
        Symbol<?> symbol4 = testHelper.addSymbol(client, project, json);

        // remember symbol references
        symbolsIdAndRevisionAsJSON = "{\"id\": " + symbol1.getId() + ", \"revision\": " + symbol1.getRevision() + "},"
                                   + "{\"id\": " + symbol2.getId() + ", \"revision\": " + symbol2.getRevision() + "},"
                                   + "{\"id\": " + symbol3.getId() + ", \"revision\": " + symbol3.getRevision() + "},"
                                   + "{\"id\": " + symbol4.getId() + ", \"revision\": " + symbol4.getRevision() + "}";

        // remember alphabet
        testAlphabet = new SimpleAlphabet<>();
        testAlphabet.add(symbol1.getAbbreviation());
        testAlphabet.add(symbol2.getAbbreviation());
        testAlphabet.add(symbol3.getAbbreviation());
        testAlphabet.add(symbol4.getAbbreviation());
    }

    @After
    public void tearDown() {
        client.target(BASE_LEARNER_URL + "/projects/" + project.getId()).request().delete();
        symbolsIdAndRevisionAsJSON = null;
        testAlphabet = null;
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void simpleLearnProcess() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "], \"eqOracle\":"
                            + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                        + "\"algorithm\": \"DISCRIMINATION_TREE\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        result.setJSON(resultAsJSON);

        assertTrue(testHelper.hypothesisIsEqualToTheExpectedOne(result.getHypothesis(), testAlphabet, "web"));
        assertTrue(result.getDuration() > 0);
        assertTrue(result.getAmountOfResets() > 0);
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void learnProcessInSteps() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "], \"eqOracle\":"
                            + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                        + "\"maxAmountOfStepsToLearn\": 1, \"algorithm\": \"EXTENSIBLE_LSTAR\"}";
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
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        result.setJSON(resultAsJSON);

        assertTrue(testHelper.hypothesisIsEqualToTheExpectedOne(result.getHypothesis(), testAlphabet, "web"));
    }

    @Test(timeout = MAX_TIME_TO_WAIT_FOR_LEARNER)
    public void learnProcessInStepsWithManualCounterExample() throws InterruptedException {
        // start learning
        String path = "/learner/start/" + project.getId();
        String json = "{\"symbols\": [" + symbolsIdAndRevisionAsJSON + "], \"eqOracle\":"
                            + "{\"type\":\"complete\",\"minDepth\":1, \"maxDepth\": 3},"
                        + "\"maxAmountOfStepsToLearn\": 1, \"algorithm\": \"DHC\"}";
        Response response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // resume learning
        path = "/learner/resume/" + project.getId() + "/1";
        json = "{\"maxAmountOfStepsToLearn\": 0, \"eqOracle\":"
                + "{\"type\": \"sample\", \"counterExamples\": [{"
                    + "\"input\": [\"learnweb2\", \"learnweb2\", \"learnweb3\"],"
                    + "\"output\": [\"OK\", \"OK\", \"OK\"]}]"
                + "}}";
        response = client.target(BASE_LEARNER_URL + path).request().post(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        // active?
        testHelper.waitForLearner(client);

        // results
        path = "/learner/status";
        response = client.target(BASE_LEARNER_URL + path).request().get();
        LearnerResult result = new LearnerResult();
        String resultAsJSON = response.readEntity(String.class);
        result.setJSON(resultAsJSON);

        assertTrue(testHelper.hypothesisIsEqualToTheExpectedOne(result.getHypothesis(), testAlphabet, "web"));
    }

}
