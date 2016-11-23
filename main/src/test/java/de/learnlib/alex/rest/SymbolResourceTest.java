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

package de.learnlib.alex.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.validation.ValidationException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SymbolResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = 1;
    private static final long PROJECT_TEST_ID = 10;
    private static final long SYMBOL_TEST_ID = 1;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolDAO symbolDAO;

    private User admin;
    private String adminToken;

    private Project project;
    private SymbolGroup group;

    private Symbol symbol;
    private Symbol symbol2;
    private List<Symbol> symbols;
    private List<Long> ids;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(SymbolResource.class);
        admin = testApplication.getAdmin();
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(projectDAO).to(ProjectDAO.class);
                bind(symbolDAO).to(SymbolDAO.class);
            }
        });
        return testApplication;
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        project.setUser(admin);
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID)).willReturn(project);

        group = new SymbolGroup();
        group.setId(0L);
        group.setName("Symbol Resource Test Group");

        symbol = new Symbol();
        symbol.setId(SYMBOL_TEST_ID);
        symbol.setName("Symbol Resource Test Symbol");
        symbol.setAbbreviation("srts");
        symbol.setUser(admin);
        symbol.setProject(project);
        symbol.setGroup(group);

        symbol2 = new Symbol();
        symbol2.setId(SYMBOL_TEST_ID + 1);
        symbol2.setName("Symbol Resource Test Symbol 2");
        symbol2.setAbbreviation("srts 2");
        symbol2.setUser(admin);
        symbol2.setProject(project);
        symbol2.setGroup(group);

        symbols = new LinkedList<>();
        symbols.add(symbol);
        symbols.add(symbol2);

        ids = new LinkedList<>();
        ids.add(symbol.getId());
        ids.add(symbol2.getId());
    }

    @Test
    public void shouldCreateValidSymbol() throws IOException {
        symbol.setProject(null);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request()
                                .header("Authorization", adminToken).post(Entity.json(json));

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals("http://localhost:9998/projects/10/symbols/1", response.getHeaderString("Location"));
        symbol.setProject(project);
        verify(symbolDAO).create(symbol);
    }

    @Test
    public void shouldCreateValidSymbolWithoutProject() throws IOException, NotFoundException {
        String json = "{\"abbreviation\":\"srts\",\"actions\":[],\"id\":1,"
                + "\"name\":\"Symbol Resource Test Symbol\"}";

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request()
                                .header("Authorization", adminToken).post(Entity.json(json));
        given(symbolDAO.get(admin, 0L, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateSymbolWithCorrectProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request()
                                .header("Authorization", adminToken).post(Entity.json(json));
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        verify(symbolDAO).create(symbol);
    }

    @Test
    public void shouldNotCreateASymbolWithAnWrongProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        symbol.setProjectId(PROJECT_TEST_ID + 1);
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request()
                                .header("Authorization", adminToken).post(Entity.json(json));
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).create(symbol);
    }

    @Test
    public void shouldReturn400IfSymbolCouldNotBeCreated() {
        willThrow(new ValidationException()).given(symbolDAO).create(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request()
                                .header("Authorization", adminToken).post(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateValidSymbols() throws IOException {
        // given
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        // when
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request()
                                .header("Authorization", adminToken).post(Entity.json(json));

        // then
        assertSymbolListCreation(response);
    }

    @Test
    public void shouldCreateValidSymbolsWithoutProject() throws IOException {
        // given
        symbol.setProject(null);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        // when
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request()
                                .header("Authorization", adminToken).post(Entity.json(json));

        // then
        symbol.setProject(project);
        assertSymbolListCreation(response);
    }

    @Test
    public void shouldCreateSymbolsWithCorrectProject() throws IOException, NotFoundException {
        // given
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() {
        }).writeValueAsString(symbols);

        // when
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request()
                                .header("Authorization", adminToken).post(Entity.json(json));
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        // then
        assertSymbolListCreation(response);
    }

    @Test
    public void shouldNotCreateASymbolsWithAnWrongProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        symbol.setProjectId(PROJECT_TEST_ID + 1);
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request()
                                .header("Authorization", adminToken).post(Entity.json(json));
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).create(symbols);
    }

    @Test
    public void shouldReturn400IfSymbolsCouldNotBeCreated() throws JsonProcessingException {
        willThrow(new ValidationException()).given(symbolDAO).create(symbols);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() {
        }).writeValueAsString(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request()
                                .header("Authorization", adminToken).post(Entity.json(json));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    private void assertSymbolListCreation(Response response) {
        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(symbol, responseSymbols.get(0));
        assertEquals(symbol2, responseSymbols.get(1));
        verify(symbolDAO).create(symbols);
    }

    @Test
    public void shouldReturnAllSymbolsThatAreVisible() throws NotFoundException {
        symbol.setSymbolId(SYMBOL_TEST_ID);
        symbol2.setSymbolId(SYMBOL_TEST_ID + 1);
        symbols.remove(symbol2);
        given(symbolDAO.getAll(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.VISIBLE))
                .willReturn(symbols);

        Response response = target("/projects/" + project.getId() + "/symbols").request()
                                .header("Authorization", adminToken).get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "[{\"abbreviation\":\"srts\",\"actions\":[],\"group\":0,"
                + "\"hidden\":false,\"id\":1,\"name\":\"Symbol Resource Test Symbol\","
                + "\"project\":10,\"user\":" + USER_TEST_ID + "}]";
        assertEquals(expectedJSON, response.readEntity(String.class));
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).getAll(admin, project.getId(), SymbolVisibilityLevel.VISIBLE);
    }

    @Test
    public void shouldReturnAllSymbolsIncludingHiddenOnes() throws NotFoundException {
        symbol.setSymbolId(SYMBOL_TEST_ID);
        symbol2.setSymbolId(SYMBOL_TEST_ID + 1);
        symbols.remove(symbol2);
        given(symbolDAO.getAll(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL))
                .willReturn(symbols);

        Response response = target("/projects/" + project.getId() + "/symbols").queryParam("visibility", "all")
                            .request().header("Authorization", adminToken).get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "[{\"abbreviation\":\"srts\",\"actions\":[],\"group\":0,"
                                + "\"hidden\":false,\"id\":1,\"name\":\"Symbol Resource Test Symbol\","
                                + "\"project\":10,\"user\":" + USER_TEST_ID + "}]";
        assertEquals(expectedJSON, response.readEntity(String.class));
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).getAll(admin, project.getId(), SymbolVisibilityLevel.ALL);
    }

    @Test
    public void shouldGetTheRightSymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID).request()
                                .header("Authorization", adminToken).get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        verify(symbolDAO).get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldReturn404WhenSymbolNotFound() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID))
                .willThrow(NotFoundException.class);
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID).request()
                                .header("Authorization", adminToken).get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldUpdateTheRightSymbol() throws NotFoundException {
        symbol.setUser(null);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbol));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        symbol.setUser(admin); // the user is provided over the auth token.
        verify(symbolDAO).update(symbol);
    }

    @Test
    public void shouldFailIfIdInUrlAndObjectAreDifferent() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + (symbol.getId() + 1);
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbol);
    }

    @Test
    public void shouldFailIfProjectsInUrlAndObjectAreDifferent() throws NotFoundException {
        String path = "/projects/" + (PROJECT_TEST_ID + 1) + "/symbols/" + symbol.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbol);
    }

    @Test
    public void shouldReturn404OnUpdateWhenSymbolNotFound() throws NotFoundException {
        symbol.setUser(null);

        willThrow(NotFoundException.class).given(symbolDAO).update(symbol);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID;
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbol));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn400OnUpdateWhenSymbolIsInvalid() throws NotFoundException {
        willThrow(new ValidationException()).given(symbolDAO).update(symbol);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID;
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldUpdateMultipleSymbolsAtOnce() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbols));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        assertEquals("2", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).update(symbols);
    }

    @Test
    public void shouldNotUpdateMultipleSymbolsIfIdsDoNotMatch() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(symbols));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbols);
    }

    @Test
    public void shouldGetSymbolsByAListOfIds() throws NotFoundException {
        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, ids)).willReturn(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch/1,2").request()
                                .header("Authorization", adminToken).get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, responseSymbols.size());
        assertEquals(responseSymbols.get(0).getId(), ids.get(0));
        assertEquals(responseSymbols.get(1).getId(), ids.get(1));

        verify(symbolDAO).getByIds(admin, PROJECT_TEST_ID, ids);
    }

    @Test
    public void shouldResponseWith404IfIdsContainNonexistentSymbolIds() throws NotFoundException {
        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, ids)).willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/1,2";
        Response response = target(path).request().header("Authorization", adminToken).get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).getByIds(admin, PROJECT_TEST_ID, ids);
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(symbolDAO).get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID);
        verify(symbolDAO).move(symbol, group.getId());
    }

    @Test
    public void ensureThatMovingASymbolThatDoesNotExistsIsHandedProperly() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID))
                .willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).move(symbol, group.getId());
    }

    @Test
    public void ensureThatMovingASymbolIntoTheVoidIsHandedProperly() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);
        willThrow(NotFoundException.class).given(symbolDAO).move(symbol, group.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbol, group.getId());
    }

    @Test
    public void shouldMoveMultipleSymbols() throws NotFoundException {
        List<Long> symbolIds = new ArrayList<>();
        symbolIds.add(symbol.getId());
        symbolIds.add(symbol2.getId());

        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL, symbolIds)).willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbols, group.getId());
    }

    @Test
    public void ensureThatMovingSymbolsThatDoNotExistsIsHandedProperly() throws NotFoundException {
        List<Long> symbolIds = new ArrayList<>();
        symbolIds.add(symbol.getId());
        symbolIds.add(symbol2.getId());

        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL, symbolIds))
                .willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).move(symbols, group.getId());
    }

    @Test
    public void ensureThatMovingMultipleSymbolsIntoTheVoidIsHandedProperly() throws NotFoundException {
        List<Long> symbolIds = new ArrayList<>();
        symbolIds.add(symbol.getId());
        symbolIds.add(symbol2.getId());

        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL, symbolIds)).willReturn(symbols);
        willThrow(NotFoundException.class).given(symbolDAO).move(symbols, group.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbols, group.getId());
    }

    @Test
    public void shouldHideASymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/hide";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        Symbol responseSymbol = response.readEntity(Symbol.class);
        assertEquals(symbol, responseSymbol);
        verify(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID, Collections.singletonList(symbol.getId()));
    }

    @Test
    public void shouldHideMultipleSymbols() throws NotFoundException {
        List<Long> symbolIds = new ArrayList<>();
        symbolIds.add(symbol.getId());
        symbolIds.add(symbol2.getId());

        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL, symbolIds)).willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/"
                    + symbol.getId() + "," + symbol2.getId() + "/hide";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, responseSymbols.size());
        verify(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID, symbolIds);
    }

    @Test
    public void shouldReturn404OnHideWhenSymbolNotFound() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);
        willThrow(new NotFoundException()).given(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID,
                Collections.singletonList(SYMBOL_TEST_ID));
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/hide";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatInvalidIdsToHideAreHandledProperly() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/,,,/hide";
        Response response = target(path).request().header("Authorization", adminToken).post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).hide(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(List.class));
    }

    @Test
    public void ensureThatInvalidIdsToHideAreHandledProperly2() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/foobar/hide";
        Response response = target(path).request().header("Authorization", adminToken).post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).hide(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(List.class));
    }

    @Test
    public void shouldShowASymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/show";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        Symbol responseSymbol = response.readEntity(Symbol.class);
        assertEquals(symbol, responseSymbol);
        verify(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID, Collections.singletonList(symbol.getId()));
    }

    @Test
    public void shouldShowMultipleSymbols() throws NotFoundException {
        List<Long> symbolIds = new ArrayList<>();
        symbolIds.add(symbol.getId());
        symbolIds.add(symbol2.getId());

        given(symbolDAO.getByIds(admin, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL, symbolIds)).willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + ","
                                                                         + symbol2.getId() + "/show";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, responseSymbols.size());
        verify(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID, symbolIds);
    }

    @Test
    public void shouldReturn404OnShowWhenSymbolNotFound() throws NotFoundException {
        willThrow(new NotFoundException()).given(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID,
                Collections.singletonList(SYMBOL_TEST_ID));
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/show";
        Response response = target(path).request().header("Authorization", adminToken).post(null);

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatInvalidIdsToShowAreHandledProperly() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/,,,/show";
        Response response = target(path).request().header("Authorization", adminToken).post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).show(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(List.class));
    }

    @Test
    public void ensureThatInvalidIdsToShowAreHandledProperly2() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/foobar/show";
        Response response = target(path).request().header("Authorization", adminToken).post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).show(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(List.class));
    }

}
