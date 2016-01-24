package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ProjectTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class AlexIT {

    private static final String BASE_URL = "http://localhost:8080/rest";
    private static final String PROJECT_NAME = "IT Project";
    private static final String PROJECT_URL  = "http://localhost:8080/rest";
    private static final int TIME_TO_WAIT_BETWEEN_POLLS = 2000; // two seconds

    private Client client;

    private String token;

    private Long projectId;

    @Before
    public void setUp() {
        client = ClientBuilder.newClient();
        login();
        projectId = null;
    }

    @Test
    public void testWorkflow() throws Exception {
        createProject();
        createSymbols();
        learn();
        //deleteProject();
    }

    private void login() {
        String json =  "{\"email\": \"admin@alex.example\", \"password\": \"admin\"}";
        Response response = client.target(BASE_URL + "/users/login").request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        token = "Bearer " + response.readEntity(String.class).split("\"")[3];
        System.out.println("Token: " + token);
    }

    private void createProject() throws IOException {
        String json =  "{\"name\": \"" + PROJECT_NAME + "\", \"baseUrl\": \"" + PROJECT_URL + "\"}";

        Response response = client.target(BASE_URL + "/projects").request().header("Authorization", token).post(Entity.json(json));
        String projectAsString = response.readEntity(String.class);
        System.out.println(" -> " + projectAsString);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());

        Project project = ProjectTest.readProject(projectAsString);
        projectId = project.getId();
        assertTrue(projectId > 0);
        assertEquals(PROJECT_NAME, project.getName());
        assertEquals(PROJECT_URL, project.getBaseUrl());
        assertNotNull(project.getSymbols());
        assertEquals(0, project.getSymbolsSize()); // no symbol
    }

    private void createSymbols() throws IOException {
        // read the symbols from a file
        Path path = Paths.get(System.getProperty("user.dir") + "/src/test/resources/integrationtest/Symbols.json");
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        StringBuilder stringBuffer = new StringBuilder();
        lines.forEach(stringBuffer::append);
        String json = stringBuffer.toString();
        json = json.replaceAll("%%PROJECT_PATH%%",
                               "file://" + System.getProperty("user.dir")+ "/src/test/resources/integrationtest");

        System.out.println("Symbols:" + json);

        // actually create the symbol
        String url = BASE_URL + "/projects/" + projectId + "/symbols/batch";
        Response response = client.target(url).request().header("Authorization", token).post(Entity.json(json));
        String responseBody = response.readEntity(String.class);
        System.out.println(" -> " + responseBody);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
    }

    private void learn() throws InterruptedException {
        String url = BASE_URL + "/learner/start/" + projectId;
        String json = "{\"algorithm\":\"TTT\", \"browser\":\"htmlunitdriver\", \"eqOracle\": "
                            + "{\"type\": \"random_word\", \"minLength\": 1, \"maxLength\": 20, \"maxNoOfTests\" : 40},"
                        + "\"maxAmountOfStepsToLearn\": -1,"
                        + "\"resetSymbol\": {\"id\": 1, \"revision\": 1},"
                        + "\"symbols\":["
                            + "{\"id\":  3, \"revision\": 1},"
                            + "{\"id\":  4, \"revision\": 1},"
                            + "{\"id\":  5, \"revision\": 1},"
                            + "{\"id\":  6, \"revision\": 1},"
                            + "{\"id\":  7, \"revision\": 1},"
                            + "{\"id\":  8, \"revision\": 1},"
                            + "{\"id\":  9, \"revision\": 1},"
                            + "{\"id\": 10, \"revision\": 1}"
                        + "]}";
        Response response = client.target(url).request().header("Authorization", token).post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        String responseAsJSON;
        do {
            Thread.sleep(TIME_TO_WAIT_BETWEEN_POLLS);
            response = client.target(BASE_URL + "/learner/active").request().header("Authorization", token).get();
            responseAsJSON = response.readEntity(String.class);
            System.out.println("isActive: " + responseAsJSON);
        } while (responseAsJSON.startsWith("{\"active\":true"));

        url = BASE_URL +  "/learner/status";
        response = client.target(url).request().header("Authorization", token).get();
        System.out.println(response.readEntity(String.class));
    }

    private void deleteProject() {
        Response response = client.target(BASE_URL + "/projects/" + projectId).request().header("Authorization", token).delete();

        if (projectId != null) {
            assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        }
    }
}
