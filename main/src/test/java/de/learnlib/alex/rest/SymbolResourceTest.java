package de.learnlib.alex.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.FakeAuthenticationFilter;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
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
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SymbolResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = FakeAuthenticationFilter.FAKE_USER_ID;
    private static final long PROJECT_TEST_ID = 10;
    private static final long SYMBOL_TEST_ID = 1;
    private static final long SYMBOL_TEST_REV = 3;

    @Mock
    private UserDAO userDAO;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private CounterDAO counterDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private FileDAO fileDAO;

    @Mock
    private Learner learner;

    private User user;
    private Project project;
    private SymbolGroup group;

    private Symbol symbol;
    private Symbol symbol2;
    private List<Symbol> symbols;
    private List<IdRevisionPair> idRevisionPairs;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new ALEXTestApplication(userDAO, projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, fileDAO, learner, SymbolResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        user = new User();
        user.setId(USER_TEST_ID);
        given(userDAO.getById(USER_TEST_ID)).willReturn(user);

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        project.setUser(user);
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID)).willReturn(project);

        group = new SymbolGroup();
        group.setName("Symbol Resource Test Group");

        symbol = new Symbol();
        symbol.setId(SYMBOL_TEST_ID);
        symbol.setRevision(1L);
        symbol.setName("Symbol Resource Test Symbol");
        symbol.setAbbreviation("srts");
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);

        symbol2 = new Symbol();
        symbol2.setId(SYMBOL_TEST_ID + 1);
        symbol2.setRevision(1L);
        symbol2.setName("Symbol Resource Test Symbol 2");
        symbol2.setAbbreviation("srts 2");
        symbol2.setUser(user);
        symbol2.setProject(project);
        symbol2.setGroup(group);

        symbols = new LinkedList<>();
        symbols.add(symbol);
        symbols.add(symbol2);

        idRevisionPairs = new LinkedList<>();
        idRevisionPairs.add(symbol.getIdRevisionPair());
        idRevisionPairs.add(symbol2.getIdRevisionPair());
    }

    @Test
    public void shouldCreateValidSymbol() throws IOException {
        symbol.setProject(null);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request().post(Entity.json(json));

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals("http://localhost:9998/projects/10/symbols/1", response.getHeaderString("Location"));
        symbol.setProject(project);
        verify(symbolDAO).create(symbol);
    }

    @Test
    public void shouldCreateValidSymbolWithoutProjectOrRevision() throws IOException, NotFoundException {
        String json = "{\"abbreviation\":\"srts\",\"actions\":[],\"id\":1,"
                + "\"name\":\"Symbol Resource Test Symbol\"}";

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request().post(Entity.json(json));
        given(symbolDAO.getWithLatestRevision(user, 0L, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateSymbolWithCorrectProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request().post(Entity.json(json));
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        verify(symbolDAO).create(symbol);
    }

    @Test
    public void shouldNotCreateASymbolWithAnWrongProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        symbol.setProjectId(PROJECT_TEST_ID + 1);
        String json = mapper.writeValueAsString(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request().post(Entity.json(json));
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).create(symbol);
    }

    @Test
    public void shouldReturn400IfSymbolCouldNotBeCreated() {
        willThrow(new ValidationException()).given(symbolDAO).create(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols").request().post(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateValidSymbols() throws IOException {
        // given
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        // when
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request().post(Entity.json(json));

        // then
        assertSymbolListCreation(response);
    }

    @Test
    public void shouldCreateValidSymbolsWithoutProjectOrRevision() throws IOException {
        // given
        symbol.setProject(null);
        symbol2.setRevision(0L);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        // when
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request().post(Entity.json(json));

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
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request().post(Entity.json(json));
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        // then
        assertSymbolListCreation(response);
    }

    @Test
    public void shouldNotCreateASymbolsWithAnWrongProject() throws IOException, NotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        symbol.setProjectId(PROJECT_TEST_ID + 1);
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() { }).writeValueAsString(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request().post(Entity.json(json));
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).create(symbols);
    }

    @Test
    public void shouldReturn400IfSymbolsCouldNotBeCreated() throws JsonProcessingException {
        willThrow(new ValidationException()).given(symbolDAO).create(symbols);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithType(new TypeReference<List<Symbol>>() {
        }).writeValueAsString(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch").request().post(Entity.json(json));

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
        symbols.remove(symbol2);
        given(symbolDAO.getAllWithLatestRevision(user, PROJECT_TEST_ID, SymbolVisibilityLevel.VISIBLE))
                .willReturn(symbols);

        Response response = target("/projects/" + project.getId() + "/symbols").request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "[{\"abbreviation\":\"srts\",\"actions\":[],\"group\":0,"
                + "\"hidden\":false,\"id\":1,\"name\":\"Symbol Resource Test Symbol\","
                + "\"project\":10,\"revision\":1,\"user\":" + USER_TEST_ID + "}]";
        assertEquals(expectedJSON, response.readEntity(String.class));
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).getAllWithLatestRevision(user, project.getId(), SymbolVisibilityLevel.VISIBLE);
    }

    @Test
    public void shouldReturnAllSymbolsIncludingHiddenOnes() throws NotFoundException {
        symbols.remove(symbol2);
        given(symbolDAO.getAllWithLatestRevision(user, PROJECT_TEST_ID, SymbolVisibilityLevel.ALL))
                .willReturn(symbols);

        Response response = target("/projects/" + project.getId() + "/symbols").queryParam("visibility", "all")
                            .request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "[{\"abbreviation\":\"srts\",\"actions\":[],\"group\":0,"
                                + "\"hidden\":false,\"id\":1,\"name\":\"Symbol Resource Test Symbol\","
                                + "\"project\":10,\"revision\":1,\"user\":" + USER_TEST_ID + "}]";
        assertEquals(expectedJSON, response.readEntity(String.class));
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).getAllWithLatestRevision(user, project.getId(), SymbolVisibilityLevel.ALL);
    }

    @Test
    public void shouldGetTheRightSymbol() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        verify(symbolDAO).getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldReturn404WhenSymbolNotFound() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willThrow(NotFoundException.class);
        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID).request().get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldGetTheRightSymbolWithAllRevisions() throws NotFoundException {
        given(symbolDAO.getWithAllRevisions(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/complete";
        Response response = target(path).request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() {
        });
        assertEquals(2, responseSymbols.size());
        verify(symbolDAO).getWithAllRevisions(user, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldReturn404WhenSymbolWithAllRevisionCanNotBeFound() throws NotFoundException {
        given(symbolDAO.getWithAllRevisions(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/complete";
        Response response = target(path).request().get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).getWithAllRevisions(user, PROJECT_TEST_ID, SYMBOL_TEST_ID);
    }

    @Test
    public void shouldGetTheRightSymbolWithRevision() throws NotFoundException {
        given(symbolDAO.get(user, PROJECT_TEST_ID, SYMBOL_TEST_ID, SYMBOL_TEST_REV)).willReturn(symbol);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + ":" + SYMBOL_TEST_REV;
        Response response = target(path).request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(symbolDAO).get(user, PROJECT_TEST_ID, SYMBOL_TEST_ID, SYMBOL_TEST_REV);
    }

    @Test
    public void shouldUpdateTheRightSymbol() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId();
        Response response = target(path).request().put(Entity.json(symbol));
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        verify(symbolDAO).update(symbol);
    }

    @Test
    public void shouldFailIfIdInUrlAndObjectAreDifferent() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + (symbol.getId() + 1);
        Response response = target(path).request().put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbol);
    }

    @Test
    public void shouldFailIfProjectsInUrlAndObjectAreDifferent() throws NotFoundException {
        String path = "/projects/" + (PROJECT_TEST_ID + 1) + "/symbols/" + symbol.getId();
        Response response = target(path).request().put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbol);
    }

    @Test
    public void shouldReturn404OnUpdateWhenSymbolNotFound() throws NotFoundException {
        willThrow(NotFoundException.class).given(symbolDAO).update(symbol);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID;
        Response response = target(path).request().put(Entity.json(symbol));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn400OnUpdateWhenSymbolIsInvalid() throws NotFoundException {
        willThrow(new ValidationException()).given(symbolDAO).update(symbol);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID;
        Response response = target(path).request().put(Entity.json(symbol));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldUpdateMultipleSymbolsAtOnce() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId();
        Response response = target(path).request().put(Entity.json(symbols));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        assertEquals("2", response.getHeaderString("X-Total-Count"));
        verify(symbolDAO).update(symbols);
    }

    @Test
    public void shouldNotUpdateMultipleSymbolsIfIdsDoNotMatch() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId();
        Response response = target(path).request().put(Entity.json(symbols));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).update(symbols);
    }

    @Test
    public void shouldGetSymbolsByAListOfIdRevisionPairs() throws NotFoundException {
        given(symbolDAO.getAll(user, PROJECT_TEST_ID, idRevisionPairs)).willReturn(symbols);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/symbols/batch/1:1,2:1").request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() {});
        assertEquals(2, responseSymbols.size());
        assertEquals(responseSymbols.get(0).getIdRevisionPair(), idRevisionPairs.get(0));
        assertEquals(responseSymbols.get(1).getIdRevisionPair(), idRevisionPairs.get(1));

        verify(symbolDAO).getAll(user, PROJECT_TEST_ID, idRevisionPairs);
    }

    @Test
    public void shouldResponseWith404IfIdRevisionPairsContainsUnexistantSymbolIds() throws NotFoundException {
        given(symbolDAO.getAll(user, PROJECT_TEST_ID, idRevisionPairs)).willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/1:1,2:1";
        Response response = target(path).request().get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).getAll(user, PROJECT_TEST_ID, idRevisionPairs);
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(symbolDAO).getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID);
        verify(symbolDAO).move(symbol, group.getId());
    }

    @Test
    public void ensureThatMovingASymbolThatDoesNotExistsIsHandedProperly() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).move(symbol, group.getId());
    }

    @Test
    public void ensureThatMovingASymbolIntoTheVoidIsHandedProperly() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, SYMBOL_TEST_ID)).willReturn(symbol);
        willThrow(NotFoundException.class).given(symbolDAO).move(symbol, group.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbol, group.getId());
    }

    @Test
    public void shouldMoveMultipleSymbols() throws NotFoundException {
        given(symbolDAO.getByIdsWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId(), symbol2.getId()))
                .willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbols, group.getId());
    }

    @Test
    public void ensureThatMovingSymbolsThatDoNotExistsIsHandedProperly() throws NotFoundException {
        given(symbolDAO.getByIdsWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId(), symbol2.getId()))
                .willThrow(NotFoundException.class);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO, never()).move(symbols, group.getId());
    }

    @Test
    public void ensureThatMovingMultipleSymbolsIntoTheVoidIsHandedProperly() throws NotFoundException {
        given(symbolDAO.getByIdsWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId(), symbol2.getId()))
                .willReturn(symbols);
        willThrow(NotFoundException.class).given(symbolDAO).move(symbols, group.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + "," + symbol2.getId()
                    + "/moveTo/" + group.getId();
        Response response = target(path).request().put(Entity.json(""));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(symbolDAO).move(symbols, group.getId());
    }

    @Test
    public void shouldHideASymbol() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/hide";
        Response response = target(path).request().post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        Symbol responseSymbol = response.readEntity(Symbol.class);
        assertEquals(symbol, responseSymbol);
        verify(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID, symbol.getId());
    }

    @Test
    public void shouldHideMultipleSymbols() throws NotFoundException {
        given(symbolDAO.getByIdsWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId(), symbol2.getId()))
                .willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/"
                    + symbol.getId() + "," + symbol2.getId() + "/hide";
        Response response = target(path).request().post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, responseSymbols.size());
        verify(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID, symbol.getId(), symbol2.getId());
    }

    @Test
    public void shouldReturn404OnHideWhenSymbolNotFound() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);
        willThrow(new NotFoundException()).given(symbolDAO).hide(USER_TEST_ID, PROJECT_TEST_ID, SYMBOL_TEST_ID);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/hide";
        Response response = target(path).request().post(null);

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatInvalidIdsToHideAreHandledProperly() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/,,,/hide";
        Response response = target(path).request().post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).hide(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(Long[].class));
    }

    @Test
    public void ensureThatInvalidIdsToHideAreHandledProperly2() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/foobar/hide";
        Response response = target(path).request().post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).hide(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(Long[].class));
    }

    @Test
    public void shouldShowASymbol() throws NotFoundException {
        given(symbolDAO.getWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId())).willReturn(symbol);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + symbol.getId() + "/show";
        Response response = target(path).request().post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        Symbol responseSymbol = response.readEntity(Symbol.class);
        assertEquals(symbol, responseSymbol);
        verify(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID, symbol.getId());
    }

    @Test
    public void shouldShowMultipleSymbols() throws NotFoundException {
        given(symbolDAO.getByIdsWithLatestRevision(user, PROJECT_TEST_ID, symbol.getId(), symbol2.getId()))
                .willReturn(symbols);

        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/batch/" + symbol.getId() + ","
                                                                         + symbol2.getId() + "/show";
        Response response = target(path).request().post(null);

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        List<Symbol> responseSymbols = response.readEntity(new GenericType<List<Symbol>>() { });
        assertEquals(2, responseSymbols.size());
        verify(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID, symbol.getId(), symbol2.getId());
    }

    @Test
    public void shouldReturn404OnShowWhenSymbolNotFound() throws NotFoundException {
        willThrow(new NotFoundException()).given(symbolDAO).show(USER_TEST_ID, PROJECT_TEST_ID, SYMBOL_TEST_ID);
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/" + SYMBOL_TEST_ID + "/show";
        Response response = target(path).request().post(null);

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatInvalidIdsToShowAreHandledProperly() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/,,,/show";
        Response response = target(path).request().post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).show(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(Long[].class));
    }

    @Test
    public void ensureThatInvalidIdsToShowAreHandledProperly2() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/symbols/foobar/show";
        Response response = target(path).request().post(null);
        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());

        verify(symbolDAO, never()).show(eq(USER_TEST_ID), eq(PROJECT_TEST_ID), any(Long[].class));
    }

}
