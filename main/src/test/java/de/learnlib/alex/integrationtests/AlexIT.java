package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ProjectTest;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@Ignore
public class AlexIT {

    private static final String BASE_URL = "http://localhost:8080/rest";
    private static final String PROJECT_NAME = "IT Project";

    private Client client;

    private String token;

    @Before
    public void setUp() {
        client = ClientBuilder.newClient();
    }

    @Test
    public void testWorkflow() throws Exception {
        login();
        createProject();
    }

    private void login() {
        String json =  "{\"email\": \"admin@alex.example\", \"password\": \"admin\"}";
        Response response = client.target(BASE_URL + "/users/login").request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        token = "Bearer " + response.readEntity(String.class).split("\"")[3];
        System.out.println("Token: " + token);
    }

    private void createProject() throws IOException {
        String json =  "{\"name\": \"" + PROJECT_NAME + "\", \"baseUrl\": \"http://example.com\"}";

        Response response = client.target(BASE_URL + "/projects").request().header("Authorization", token).post(Entity.json(json));
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        Project project = ProjectTest.readProject(response.readEntity(String.class));
        assertTrue(project.getId() > 0);
        assertEquals(PROJECT_NAME, project.getName());
        assertEquals("http://example.com", project.getBaseUrl());
        assertNotNull(project.getSymbols());
        assertEquals(0, project.getSymbolsSize()); // no symbol
    }
}
