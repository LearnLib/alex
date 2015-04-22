package de.learnlib.alex.integrationtests;


import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolTest;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.util.automata.equivalence.DeterministicEquivalenceTest;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.SimpleAlphabet;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class LearnerTestHelper {

    private static final int TIME_TO_WAIT_BETWEEN_POLLS = 2000; // two seconds

    private String learnerUrl;

    public LearnerTestHelper(String learnerUrl) {
        this.learnerUrl = learnerUrl;
    }

    public Symbol addSymbol(Client client, Project project, String json) throws IOException {
        String path = "/projects/" + project.getId() + "/symbols";
        Response response = client.target(learnerUrl + path).request().post(Entity.json(json));
        String responseJSON = response.readEntity(String.class);
        System.out.println("web symbol in response: " + responseJSON);

        assertEquals(responseJSON, Response.Status.CREATED.getStatusCode(), response.getStatus());
        return WebSymbolTest.readSymbol(responseJSON);
    }

    public String createIdRevisionPairListAsJSON(Symbol... symbols) {
        StringBuilder builder = new StringBuilder();

        for (Symbol symbol : symbols) {
            builder.append("{");
            builder.append("\"id\":" + symbol.getId() + ",");
            builder.append("\"revision\": " + symbol.getRevision());
            builder.append("},");
        }

        builder.setLength(builder.length() - 1); // remove last ','

        return builder.toString();
    }

    public Alphabet createTestAlphabet(Symbol... symbols) {
        Alphabet sigma = new SimpleAlphabet<>();
        for (Symbol symbol : symbols) {
            sigma.add(symbol.getAbbreviation() + " " + symbol.getIdRevisionPair());
        }
        return sigma;
    }

    public void waitForLearner(Client client) throws InterruptedException {
        String path = "/learner/active";
//        Response response = client.target(learnerUrl + path).request().get();
//        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
//        assertEquals("{\"active\": true}", response.readEntity(String.class));

        String responseAsJSON;
        do {
            Thread.sleep(TIME_TO_WAIT_BETWEEN_POLLS);
            Response response = client.target(learnerUrl + path).request().get();
            responseAsJSON = response.readEntity(String.class);
        } while (responseAsJSON.startsWith("{\"active\":true"));
    }

    @Deprecated
    public boolean hypothesisIsEqualToTheExpectedOne(CompactMealyMachineProxy hypothesis,
                                                     Alphabet<String> testAlphabet, String type) {
        Word<String> separatingWord = getSeparatingWord(hypothesis, testAlphabet, type);

        System.out.println("separatingWord: " + separatingWord);

        return separatingWord == null;
    }

    public Word<String> getSeparatingWord(CompactMealyMachineProxy hypothesis, Alphabet<String> testAlphabet,
                                          String type) {
        MealyMachine expectedMealy = getExpectedHypothesis(type).createMealyMachine(testAlphabet);
        MealyMachine actualMealy = hypothesis.createMealyMachine(testAlphabet);

        return DeterministicEquivalenceTest.findSeparatingWord(expectedMealy, actualMealy, testAlphabet);
    }


    private CompactMealyMachineProxy getExpectedHypothesis(String type) {
        CompactMealyMachineProxy mealy = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            String expectedHypothesis = getExpectedHypothesisAsJSON(type);
            mealy = mapper.readValue(expectedHypothesis, CompactMealyMachineProxy.class);
        } catch (IOException e) {
            e.printStackTrace();
            fail();
        }

        return mealy;
    }

    private String getExpectedHypothesisAsJSON(String type) {
        try {
            Path path = Paths.get(System.getProperty("user.dir")
                    + "/src/test/resources/integrationtest/expected_hypothesis_" + type + ".json");
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            return lines.get(0);
        } catch (IOException e) {
            e.printStackTrace();
            fail();
            return "";
        }
    }

}
