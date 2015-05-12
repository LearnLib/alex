package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ProjectTest;
import de.learnlib.alex.core.entities.Symbol;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class WebSymbolIT {

    private static final String BASE_URL = "http://localhost:8080/rest";

    private static Project project;

    @BeforeClass
    public static void beforeClass() throws IOException {
        String projectName = "WebSymbol IT Project";
        String json =  "{\"name\": \"" + projectName + "\", \"baseUrl\": \"http://localhost:8080\"}";
        Client client = ClientBuilder.newClient();
        Response response = client.target(BASE_URL + "/projects").request().post(Entity.json(json));

        project = ProjectTest.readProject(response.readEntity(String.class));
    }

    @AfterClass
    public static void afterClass() {
        Client client = ClientBuilder.newClient();
        client.target(BASE_URL + "/projects/" + project.getId()).request().delete();
    }

    @Test
    public void validCRUD() {
        Client client = ClientBuilder.newClient();

        String symbolName = "IT Web Symbol - CRUD";
        String symbolAbbr = "itwebsymbcrud";
        String json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName
                        + "\", \"abbreviation\": \"" + symbolAbbr + "\", "
                        + "\"actions\": [{\"type\": \"wait\", \"duration\": 1000}] }";

        // create
        String path = "/projects/" + project.getId() + "/symbols";
        Response response = client.target(BASE_URL + path).request().post(
                                Entity.entity(json, MediaType.APPLICATION_JSON));
        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        Symbol symbol = response.readEntity(Symbol.class);
        assertTrue(project.getId() > 0);
        assertEquals(Long.valueOf(1), symbol.getRevision());
        assertEquals(symbolName, symbol.getName());
        assertEquals(symbolAbbr, symbol.getAbbreviation());
        assertNotNull(symbol.getActions());
        assertEquals(1, symbol.getActions().size());

        // and a second on
        json = "{\"project\": " + project.getId() + ", \"name\": \"" + symbolName + "2"
                + "\", \"abbreviation\": \"" + symbolAbbr + "2\", "
                + "\"actions\": [{\"type\": \"wait\", \"duration\": 1000}] }";
        client.target(BASE_URL + path).request().post(Entity.entity(json, MediaType.APPLICATION_JSON));

        // read all
        path = "/projects/" + project.getId() + "/symbols/";
        response = client.target(BASE_URL + path).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> symbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, symbols.size()); // the 2 created symbols
        assertTrue(project.getId() > 0);
        symbol = symbols.get(0);
        assertNotNull(symbol);
        assertEquals(Long.valueOf(1), symbol.getRevision());
        assertEquals(symbolName, symbol.getName());
        assertEquals(symbolAbbr, symbol.getAbbreviation());

        // read
        path = "/projects/" + project.getId() + "/symbols/" + symbol.getId();
        response = client.target(BASE_URL + path).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        symbol = response.readEntity(Symbol.class);
        assertTrue(project.getId() > 0);
        assertEquals(Long.valueOf(1), symbol.getRevision());
        assertEquals(symbolName, symbol.getName());
        assertEquals(symbolAbbr, symbol.getAbbreviation());
        assertNotNull(symbol.getActions());
        assertEquals(1, symbol.getActions().size());

        // update
        json = "{\"project\": " + project.getId() + ", \"id\": " + symbol.getId()
                + ", \"revision\": " + symbol.getRevision() + ", \"group\": 0, \"name\": \"" + symbolName
                + " updated\", \"abbreviation\": \"" + symbolAbbr + "n\","
                + " \"actions\": ["
                    + "{\"type\": \"web_click\"},"
                    + "{\"type\": \"wait\", \"duration\": 1000}"
                + "]}";
        path = "/projects/" + project.getId() + "/symbols/" + symbol.getId();
        response = client.target(BASE_URL + path).request().put(Entity.entity(json, MediaType.APPLICATION_JSON));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        // test the returned Symbol
        symbol = response.readEntity(Symbol.class);
        assertEquals(symbolName + " updated", symbol.getName());
        assertEquals(symbolAbbr + "n", symbol.getAbbreviation());
        assertNotNull(symbol.getActions());
        assertEquals(2, symbol.getActions().size());
        // get all the Symbols to check
        path = "/projects/" + project.getId() + "/symbols/";
        response = client.target(BASE_URL + path).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        symbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, symbols.size()); // update == create a new symbol with a higher revision & hide the old one
        symbol = symbols.get(0); // 1st symbol, 2nd revision
        System.out.println("############");
        System.out.println(symbol);
        System.out.println(symbol.getActions());
        System.out.println("############");
        assertEquals(2, symbol.getActions().size());

        // delete
        path = "/projects/" + project.getId() + "/symbols/" + symbol.getId() + "/hide";
        response = client.target(BASE_URL + path).request().post(null);
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        path = "/projects/" + project.getId() + "/symbols/" + symbol.getId();
        response = client.target(BASE_URL + path).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
    }

}
