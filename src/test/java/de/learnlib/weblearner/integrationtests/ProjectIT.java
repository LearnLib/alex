package de.learnlib.weblearner.integrationtests;

import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.ProjectTest;
import de.learnlib.weblearner.entities.Symbol;
import org.apache.xerces.xs.datatypes.ObjectList;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ProjectIT {

    private static final String BASE_URL = "http://localhost:8080/rest";

    @Test
    public void validCRUD() throws IOException {
        Client client = ClientBuilder.newClient();

        String projectName = "IT Project - CRUD";
        String json =  "{\"name\": \"" + projectName + "\", \"baseUrl\": \"http://example.com\"}";

        // create
        Response response = client.target(BASE_URL + "/projects").request().post(
                Entity.entity(json, MediaType.APPLICATION_JSON));
        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        Project project = ProjectTest.readProject(response.readEntity(String.class));
        assertTrue(project.getId() > 0);
        assertEquals(projectName, project.getName());
        assertEquals("http://example.com", project.getBaseUrl());
        assertNotNull(project.getSymbols());
        assertEquals(2, project.getSymbolsSize()); // only the 2 reset symbols

        // and an other one (with symbol)
        projectName = "IT Project - CRUD";
        json =  "{\"name\": \"" + projectName + " 2\", \"baseUrl\": \"http://example.com\"}";
        response = client.target(BASE_URL + "/projects").request().post(Entity.json(json));
        Project project2 = ProjectTest.readProject(response.readEntity(String.class));
        String symbolName = "IT Project 2 AbstractSymbol - CRUD";
        String symbolAbbr = "ip2scrud";
        json = "{\"type\": \"web\", \"project\": " + project2.getId() + ", \"name\": \"" + symbolName
                + "\", \"abbreviation\": \"" + symbolAbbr + "\", "
                + "\"actions\": [{\"type\": \"wait\", \"duration\": 1000}] }";
        String path = "/projects/" + project2.getId() + "/symbols";
        client.target(BASE_URL + path).request().post(Entity.json(json));

        response = client.target(BASE_URL + "/projects/" + project2.getId() + "/symbols").request().get();
        List<Symbol<?>> symbolsInDB = response.readEntity(new GenericType<List<Symbol<?>>>() { });
        assertEquals("Symbols of the project: " + symbolsInDB, 3, symbolsInDB.size());
        assertTrue("reset symbol was not set " + symbolsInDB, symbolsInDB.get(0).isResetSymbol());

        // read all
        response = client.target(BASE_URL + "/projects/").request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Project> projects = ProjectTest.readProjectList(response.readEntity(String.class));
        assertEquals("Projects in DB: " + projects, 2, projects.size());
        Project projectFromDB = projects.get(1);
        assertEquals(projectName + " 2", projectFromDB.getName());
        assertEquals(0, projectFromDB.getSymbolsSize());

        // read
        response = client.target(BASE_URL + "/projects/" + project.getId()).queryParam("embed", "symbols")
                            .request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        project = ProjectTest.readProject(response.readEntity(String.class));
        assertTrue(project.getId() > 0);
        assertEquals(projectName, project.getName());
        assertNotNull(project.getSymbols());
        assertEquals(2, project.getSymbolsSize()); // only the 2 reset symbols

        // update
        json = "{\"id\": " + project2.getId() + ", \"name\": \"" + projectName + " updated\""
                    + ", \"baseUrl\": \"http://example2.com\"}";
        response = client.target(BASE_URL + "/projects/" + project2.getId()).request().put(Entity.json(json));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        Project responseProject = ProjectTest.readProject(response.readEntity(String.class));
        assertEquals(projectName + " updated", responseProject.getName());
        assertEquals("http://example2.com", responseProject.getBaseUrl());

        response = client.target(BASE_URL + "/projects/" + project2.getId() + "/symbols").request().get();
        symbolsInDB = response.readEntity(new GenericType<List<Symbol<?>>>() { });
        assertEquals("Symbols of the project: " + symbolsInDB, 3, symbolsInDB.size());
        assertTrue("reset symbol was not set " + symbolsInDB.get(0) + " -> " + symbolsInDB,
                symbolsInDB.get(0).isResetSymbol());

        // delete
        response = client.target(BASE_URL + "/projects/" + project.getId()).request().delete();
        assertEquals(Status.NO_CONTENT.getStatusCode(), response.getStatus());
        response = client.target(BASE_URL + "/projects/" + project.getId()).request().get();
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

}
