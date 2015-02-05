package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.IdRevisionPair;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
import de.learnlib.weblearner.entities.WebSymbolActions.CheckTextWebAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClearAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClickAction;
import de.learnlib.weblearner.entities.WebSymbolActions.FillAction;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.entities.WebSymbolActions.SubmitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WaitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WebSymbolAction;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class SymbolDAOImplTest {

    private static final int SYMBOL_COUNT = 5;

    private static ProjectDAO projectDAO;
    private static SymbolDAO symbolDAO;
    private Project project;
    private WebSymbol symbol;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        symbolDAO = new SymbolDAOImpl();
    }

    @Before
    public void setUp() {
        // create project
        project = new Project();
        project.setName("SymbolDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        projectDAO.create(project);

        // create symbol
        symbol = new WebSymbol();
        symbol.setProject(project);
        symbol.setName("SymbolDAOImplTest Symbol - Web ");
        symbol.setAbbreviation("webtest");

        WebSymbolAction a1 = new CheckTextWebAction();
        symbol.addAction(a1);
        WebSymbolAction a2 = new ClearAction();
        symbol.addAction(a2);
        ClickAction a3 = new ClickAction();
        a3.setUrl("http://example.com/");
        a3.setNode("#node-id");
        symbol.addAction(a3);
        WebSymbolAction a4 = new FillAction();
        symbol.addAction(a4);
        WebSymbolAction a5 = new GotoAction();
        symbol.addAction(a5);
        WebSymbolAction a6 = new SubmitAction();
        symbol.addAction(a6);
        WebSymbolAction a7 = new WaitAction();
        symbol.addAction(a7);
    }

    @After
    public void tearDown() {
        projectDAO.delete(project.getId());
    }

    @Test
    public void shouldCreateValidWebSymbol() {
        // given
        long idBefore = project.getNextSymbolId();

        // when
        symbolDAO.create(symbol);

        // then
        Symbol<?> symb2 = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symb2);
        assertTrue(symb2 instanceof WebSymbol);
        WebSymbol symb2Web = (WebSymbol) symb2;
        Project project2 = projectDAO.getByID(symb2.getProjectId());

        assertEquals(symbol.getName(), symb2.getName());
        assertEquals(symbol.getAbbreviation(), symb2.getAbbreviation());
        assertEquals(symbol.getRevision(), symb2.getRevision());
        assertEquals(symbol.getProject(), symb2.getProject());
        assertEquals(project, project2);
        assertEquals(idBefore + 1, project2.getNextSymbolId());

        assertNotNull(symb2Web.getActions());
        assertEquals(symbol.getActions().size(), symb2Web.getActions().size());
        for (int i = 0; i < symbol.getActions().size(); i++) {
            WebSymbolAction expectedAction = symbol.getActions().get(i);
            WebSymbolAction actualAction = symb2Web.getActions().get(i);
            assertEquals(expectedAction, actualAction);
        }
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolsWithID() {
        symbol.setId(1L);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolsWithRev() {
        symbol.setId(0L);
        symbol.setRevision(1L);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolsWithoutProject() {
        symbol.setProject(null);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolsWithoutName() {
        symbol.setName("");

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolsWithNotUniqueName() {
        symbolDAO.create(symbol);
        Symbol<?> symb2 = new WebSymbol();
        symb2.setProject(symbol.getProject());
        symb2.setName(symbol.getName());

        symbolDAO.create(symb2); // should fail
    }

    @Test
    public void shouldBeAllowedToHaveTheSameNameAndAbbreviationInDifferentProjects() {
        Symbol<?> symb2 = new WebSymbol();
        symb2.setProject(project);
        symb2.setName(symbol.getName());
        symb2.setAbbreviation(symbol.getAbbreviation());

        symbolDAO.create(symb2);
        Symbol<?> symb2FromDB = symbolDAO.get(project.getId(), symb2.getId(), symb2.getRevision());
        assertNotNull(symb2FromDB);
        assertEquals(symb2.getProject(), symb2FromDB.getProject());
        assertEquals(symb2.getName(), symb2FromDB.getName());
        assertEquals(symb2.getAbbreviation(), symb2FromDB.getAbbreviation());
        assertEquals(symb2.getRevision(), symb2FromDB.getRevision());
    }

    @Test
    public void shouldGetAllSymbol() {
        List<Symbol<?>> symbols = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol<?> s = new WebSymbol();
            s.setProject(project);
            project.getSymbols().add(s);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.setAbbreviation("web_all_" + i);
            ((WebSymbol) s).addAction(new WaitAction());
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                WebSymbolAction newAction = new ClearAction();
                ((WebSymbol) s).addAction(newAction);
                symbolDAO.update(s);
            }
            symbols.add(s);
        }
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol<?> s = new RESTSymbol();
            s.setProject(project);
            project.getSymbols().add(s);
            s.setName("Test Symbol - Get All REST No. " + i);
            s.setAbbreviation("rest_all_" + i);
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                symbolDAO.update(s);
            }
            symbols.add(s);
        }

        List<Symbol<?>> symbolsFromDB = symbolDAO.getAll(project.getId());

        assertEquals(symbols.size() + 2, symbolsFromDB.size()); // +2 -> reset symbol

        for (Symbol<?> x : symbols) {
            int index = symbolsFromDB.indexOf(x);
            assertTrue(index > -1);
            if (x instanceof WebSymbol) {
                WebSymbol webSymbolInDb = (WebSymbol) symbolsFromDB.get(index);
                assertEquals(((WebSymbol) x).getActions().size(), webSymbolInDb.getActions().size());
            }
        }
    }

    @Test
    public void shouldGetAllRequestedSymbols() {
        List<Symbol<?>> symbols = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol<?> s = new WebSymbol();
            s.setProject(project);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.setAbbreviation("web_all_" + i);
            ((WebSymbol) s).addAction(new WaitAction());
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                symbolDAO.update(s);
            }

            symbols.add(s);
        }

        List<IdRevisionPair> pairs = new LinkedList<>();
        pairs.add(new IdRevisionPair(symbols.get(0).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(2).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(3).getId(), 2));

        List<Symbol<?>> symbolsFromDB = symbolDAO.get(project.getId(), pairs);
        assertEquals(3, symbolsFromDB.size());
        for (Symbol<?> aSymbolFromDB : symbolsFromDB) {
            WebSymbol symbolFromDB = (WebSymbol) aSymbolFromDB;
            assertEquals(1, symbolFromDB.getActions().size());
        }
    }

    @Test
    public void shouldGetOnlySymbolsWithTheRequestedType() {
        List<Symbol<?>> symbols = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol<?> s = new WebSymbol();
            s.setProject(project);
            s.setName("Test Symbol - Get Type Web No. " + i);
            s.setAbbreviation("web_typ_" + i);
            ((WebSymbol) s).addAction(new WaitAction());
            symbolDAO.create(s);
            symbols.add(s);
        }
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol<?> s = new RESTSymbol();
            s.setProject(project);
            s.setName("Test Symbol - Get Type REST No. " + i);
            s.setAbbreviation("rest_typ_" + i);
            symbolDAO.create(s);
        }

        List<Symbol<?>> webSymbols = symbolDAO.getAll(project.getId(), WebSymbol.class);
        assertNotNull(webSymbols);
        for (Symbol<?> x : webSymbols) {
            assertTrue(x instanceof WebSymbol);
        }
        for (Symbol<?> x : symbols) {
            assertTrue(webSymbols.contains(x));
            if (x instanceof WebSymbol) {
                assertEquals(1, ((WebSymbol) x).getActions().size());
            }
        }

        List<Symbol<?>> restSymbols = symbolDAO.getAll(project.getId(), RESTSymbol.class);
        assertNotNull(restSymbols);
        for (Symbol<?> x : restSymbols) {
            assertTrue(x instanceof RESTSymbol);
        }
    }

    @Test
    public void shouldGetTheRightSymbol() {
        symbolDAO.create(symbol);
        Symbol<?> symb2 = symbolDAO.get(symbol.getProjectId(), symbol.getId());

        assertEquals(symbol, symb2);
    }

    @Test
    public void shouldReturnNullIfSymbolNotFound() {
        Symbol<?> symb2 = symbolDAO.get(symbol.getProjectId(), -1);

        assertNull(symb2);
    }

    @Test
    public void shouldReturnNullIfSymbolIsDeleted() {
        symbolDAO.create(symbol);
        symbolDAO.delete(symbol.getProjectId(), symbol.getId());

        Symbol<?> symb2 = symbolDAO.get(symbol.getProjectId(), symbol.getId());
        assertNull(symb2);
    }

    @Test
    public void shouldUpdateValidWebSymbol() {
        symbolDAO.create(symbol);
        long oldRevision = symbol.getRevision();

        symbol.setName("Test Symbol - Updated Valid Name");
        symbolDAO.update(symbol);

        Symbol<?> symb2 = symbolDAO.get(symbol.getProject().getId(), symbol.getId());
        assertEquals(symbol.getId(), symb2.getId());
        assertEquals(oldRevision + 1, symb2.getRevision());
        assertEquals(symbol.getName(), symb2.getName());

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Symbol<?>> symbolsInDB = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("project.id", symbol.getProjectId()))
                                            .add(Restrictions.eq("id", symbol.getId()))
                                            .add(Restrictions.eq("revision", symbol.getRevision()))
                                            .list();

        assertNotNull(symbolsInDB);
        assertEquals(1, symbolsInDB.size());

        HibernateUtil.commitTransaction();
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateInvalidWebSymbol() {
        symbolDAO.create(symbol);
        symbol.setName("");

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailOnUpdateByInvalidID() {
        symbolDAO.create(symbol);
        symbol.setId(-1);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    // The Symbol ID contains the Project -> No Project == Invalid ID
    public void shouldFailOnUpdateWithoutProject() {
        symbolDAO.create(symbol);
        symbol.setProject(null);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateWebSymbolWithoutUniqueName() {
        symbolDAO.create(symbol);
        Symbol<?> symb2 = new WebSymbol();
        symb2.setProject(project);
        symb2.setName("Test Symbol - Update Without Unique Name");
        symb2.setAbbreviation("upd_uni_na");
        symbolDAO.create(symb2);

        symb2.setName(symbol.getName());

        symbolDAO.update(symb2); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotAllowUpdateFromOldRevision() {
        symbolDAO.create(symbol);
        Symbol<?> symb2 = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());
        Symbol<?> symb3 = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());

        symb2.setName(symb2.getName() + " 2");
        symbolDAO.update(symb2);

        symb3.setName(symb3.getName() + " 3");
        symbolDAO.update(symb3);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotUpdateTheNameToResetSymbol() {
        symbolDAO.create(symbol);

        symbol.setName("Reset");
        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotUpdateANameChangeForResetSymbols() {
        Symbol<?> resetSymbol = getResetSymbol();

        resetSymbol.setName("Not Reset");
        symbolDAO.update(resetSymbol); // should fail
    }

    @Test
    public void shouldDeleteAValidSymbolWithoutRevision() {
        symbolDAO.create(symbol);
        symbolDAO.delete(symbol.getProject().getId(), symbol.getId());

        Symbol<?> symb2 = symbolDAO.get(symbol.getProject().getId(), symbol.getId());
        assertNull(symb2);

        Symbol<?> symb3 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symb3);
        assertTrue(symb3.isDeleted());
    }

    @Test
    public void shouldDeleteAValidSymbolWithRevision() {
        symbolDAO.create(symbol);
        symbolDAO.delete(symbol.getProject().getId(), symbol.getId(), symbol.getRevision());

        Symbol<?> symb2 = symbolDAO.get(symbol.getProject().getId(), symbol.getId());
        assertNull(symb2);

        Symbol<?> symb3 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symb3);
        assertTrue(symb3.isDeleted());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteAnythingByInvalidID() {
        symbolDAO.create(symbol);
        symbolDAO.delete(project.getId(), -1L);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteAnythingByInvalidRevision() {
        symbolDAO.create(symbol);
        symbolDAO.delete(project.getId(), symbol.getId(), -1L);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteAResetSymbol() {
        Symbol<?> resetSymbol = getResetSymbol();
        symbolDAO.delete(project.getId(), resetSymbol.getId()); // should fail
    }

    private Symbol<?> getResetSymbol() {
        List<Symbol<?>> symbols = symbolDAO.getAll(project.getId());
        for (Symbol<?> s : symbols) {
            if (s.getName().equals("Reset")) {
                return s;
            }
        }
        return null;
    }

}
