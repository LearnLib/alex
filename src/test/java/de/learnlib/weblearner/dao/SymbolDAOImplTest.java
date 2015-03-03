package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.IdRevisionPair;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.entities.SymbolVisibilityLevel;
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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class SymbolDAOImplTest {

    private static final int SYMBOL_COUNT = 5;

    private static ProjectDAO projectDAO;
    private static SymbolGroupDAOImpl symbolGroupDAO;
    private static SymbolDAO symbolDAO;

    private Project project;
    private SymbolGroup group;
    private Symbol symbol;
    private Symbol symbol2;
    private List<Symbol> symbols;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        symbolGroupDAO = new SymbolGroupDAOImpl();
        symbolDAO = new SymbolDAOImpl(symbolGroupDAO);
    }

    @Before
    public void setUp() {
        // create project
        project = new Project();
        project.setName("SymbolDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        projectDAO.create(project);

        // create group
        group = new SymbolGroup();
        group.setName("Symbol");
        group.setProject(project);
        symbolGroupDAO.create(group);

        // create symbol 1
        symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
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

        // create symbol 2
        symbol2 = new Symbol();
        symbol2.setName("SymbolDAOImplTest Symbol - Web 2");
        symbol2.setAbbreviation("webtest2");
        symbol2.setProject(project);

        // create symbol list
        symbols = new LinkedList<>();
        symbols.add(symbol);
        symbols.add(symbol2);
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
        Symbol symbolInDB = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symbolInDB);
        assertTrue(symbolInDB instanceof Symbol);
        Symbol webSymbolInDB = symbolInDB;
        Project project2 = projectDAO.getByID(symbolInDB.getProjectId());

        assertEquals(symbol.getName(), symbolInDB.getName());
        assertEquals(symbol.getAbbreviation(), symbolInDB.getAbbreviation());
        assertEquals(symbol.getRevision(), symbolInDB.getRevision());
        assertEquals(group, symbol.getGroup());
        assertEquals(symbol.getProject(), symbolInDB.getProject());
        assertEquals(project, project2);
        assertEquals(new Long(idBefore + 1), project2.getNextSymbolId());

        assertNotNull(webSymbolInDB.getActions());
        assertEquals(symbol.getActions().size(), webSymbolInDB.getActions().size());
        for (int i = 0; i < symbol.getActions().size(); i++) {
            WebSymbolAction expectedAction = (WebSymbolAction) symbol.getActions().get(i);
            WebSymbolAction actualAction = (WebSymbolAction) webSymbolInDB.getActions().get(i);
            assertEquals(expectedAction, actualAction);
        }
    }

    @Test
    public void shouldCreateAValidSymbolWithoutAGroup() {
        // when
        symbolDAO.create(symbol2);

        // then
        Symbol symbolInDB = symbolDAO.get(project.getId(), symbol2.getId(), symbol2.getRevision());
        assertNotNull(symbolInDB);

        assertEquals(project.getDefaultGroup(), symbolInDB.getGroup());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolWithID() {
        symbol.setId(1L);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolWithRev() {
        symbol.setId(0L);
        symbol.setRevision(1L);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolWithoutProject() {
        symbol.setProject(null);

        symbolDAO.create(symbol); // should fail
    }

    @Test
    public void shouldNotCreateWebSymbolWithoutName() {
        symbol.setName("");

        try {
            symbolDAO.create(symbol); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            assertEquals(new Long(0), symbol.getId());
            assertEquals(new Long(0), symbol.getRevision());
        }

    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolWithNotUniqueName() {
        symbolDAO.create(symbol);
        Symbol symb2 = new Symbol();
        symb2.setProject(symbol.getProject());
        symb2.setName(symbol.getName());

        symbolDAO.create(symb2); // should fail
    }

    @Test
    public void shouldCreateValidWebSymbols() {
        // given
        long idBefore = project.getNextSymbolId();

        // when
        symbolDAO.create(symbols);

        // then
        Symbol symbolInDB = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symbolInDB);
        Symbol websymbolInDB = (Symbol) symbolInDB;
        Project project2 = projectDAO.getByID(symbolInDB.getProjectId());

        assertEquals(symbol.getName(), symbolInDB.getName());
        assertEquals(symbol.getAbbreviation(), symbolInDB.getAbbreviation());
        assertEquals(symbol.getRevision(), symbolInDB.getRevision());
        assertEquals(symbol.getProject(), symbolInDB.getProject());
        assertEquals(project, project2);
        assertEquals(new Long(idBefore + 2), project2.getNextSymbolId());

        assertNotNull(websymbolInDB.getActions());
        assertEquals(symbol.getActions().size(), websymbolInDB.getActions().size());
        for (int i = 0; i < symbol.getActions().size(); i++) {
            WebSymbolAction expectedAction = (WebSymbolAction) symbol.getActions().get(i);
            WebSymbolAction actualAction = (WebSymbolAction) websymbolInDB.getActions().get(i);
            assertEquals(expectedAction, actualAction);
        }
    }

    @Test
    public void shouldNotCreateWebSymbolsWithID() {
        // given
        Long idBefore = project.getNextSymbolId();
        symbol.setId(1L);

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            // creation failed -> success
        }
        assertEquals(idBefore, project.getNextSymbolId());
        assertEquals(new Long(1), symbol.getId());
        assertEquals(null, symbol.getRevision());
        assertEquals(null, symbol2.getId());
        assertEquals(null, symbol2.getRevision());
    }

    @Test
    public void shouldNotCreateWebSymbolsWithRev() {
        // given
        Long idBefore = project.getNextSymbolId();
        symbol.setRevision(1L);

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            // creation failed -> success
        }
        assertEquals(idBefore, project.getNextSymbolId());
        assertEquals(null, symbol.getId());
        assertEquals(new Long(1), symbol.getRevision());
        assertEquals(null, symbol2.getId());
        assertEquals(null, symbol2.getRevision());
    }

    @Test
    public void shouldNotCreateWebSymbolsWithoutProject() {
        // given
        Long idBefore = project.getNextSymbolId();
        symbol.setProject(null);

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            // creation failed -> success
        }
        assertEquals(idBefore, project.getNextSymbolId());
        assertEquals(null, symbol.getId());
        assertEquals(null, symbol.getRevision());
        assertEquals(null, symbol2.getId());
        assertEquals(null, symbol2.getRevision());
    }

    @Test
    public void shouldNotCreateWebSymbolsWithoutName() {
        // given
        Long idBefore = project.getNextSymbolId();
        symbol.setName("");

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            assertEquals(idBefore, project.getNextSymbolId());
            assertEquals(null, symbol.getId());
            assertEquals(null, symbol.getRevision());
            assertEquals(null, symbol2.getId());
            assertEquals(null, symbol2.getRevision());
        }
    }

    @Test
    public void shouldNotCreateWebSymbolsWithNotUniqueName() {
        // given
        Long idBefore = project.getNextSymbolId();
        Symbol invalidSymbol = new Symbol();
        invalidSymbol.setProject(symbol.getProject());
        invalidSymbol.setName(symbol.getName());
        symbolDAO.create(invalidSymbol);

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            // creation failed -> success
        }
        assertEquals(idBefore, project.getNextSymbolId());
        assertEquals(null, symbol2.getId());
        assertEquals(null, symbol2.getRevision());
    }

    @Test
    public void shouldBeAllowedToHaveTheSameNameAndAbbreviationInDifferentProjects() {
        Symbol symb2 = new Symbol();
        symb2.setProject(project);
        symb2.setName(symbol.getName());
        symb2.setAbbreviation(symbol.getAbbreviation());

        symbolDAO.create(symb2);
        Symbol symb2FromDB = symbolDAO.get(project.getId(), symb2.getId(), symb2.getRevision());
        assertNotNull(symb2FromDB);
        assertEquals(symb2.getProject(), symb2FromDB.getProject());
        assertEquals(symb2.getName(), symb2FromDB.getName());
        assertEquals(symb2.getAbbreviation(), symb2FromDB.getAbbreviation());
        assertEquals(symb2.getRevision(), symb2FromDB.getRevision());
    }

    @Test
    public void shouldGetAllRequestedSymbolsByIdRevPairs() {
        symbols = createWebSymbolTestList();

        List<IdRevisionPair> pairs = new LinkedList<>();
        pairs.add(new IdRevisionPair(symbols.get(0).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(2).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(3).getId(), 2));

        List<Symbol> symbolsFromDB = symbolDAO.getAll(project.getId(), pairs);
        assertEquals(3, symbolsFromDB.size());
        for (Symbol x : symbolsFromDB) {
            int index = symbolsFromDB.indexOf(x);
            assertTrue(x + " was not in the returned Symbols from the DB", index > -1);
            Symbol webSymbolInDb = symbolsFromDB.get(index);
            assertEquals(x.getActions().size(), webSymbolInDb.getActions().size());
        }
    }

    @Test
    public void shouldGetNoSymbolIfIdRevParisIsEmpty() {
        symbols = createWebSymbolTestList();
        List<IdRevisionPair> pairs = new LinkedList<>();

        List<Symbol> symbolsFromDB = symbolDAO.getAll(project.getId(), pairs);

        assertEquals(0, symbolsFromDB.size());
    }

    @Test
    public void shouldGetAllVisibleSymbols() {
        symbols = createTestSymbolLists();

        List<Symbol> symbolsFromDB = symbolDAO.getAllWithLatestRevision(project.getId(), SymbolVisibilityLevel.VISIBLE);

        assertEquals(symbols.size() - 1, symbolsFromDB.size()); // -1: hidden
        for (Symbol x : symbols) {
            if (!x.isHidden()) {
                int index = symbolsFromDB.indexOf(x);
                assertTrue(index > -1);
                Symbol webSymbolInDb = symbolsFromDB.get(index);
                assertEquals(x.getActions().size(), webSymbolInDb.getActions().size());
            }
        }
    }

    @Test
    public void shouldGetAllSymbolsIncludingHiddenOnes() {
        symbols = createTestSymbolLists();

        List<Symbol> symbolsFromDB = symbolDAO.getAllWithLatestRevision(project.getId(), SymbolVisibilityLevel.ALL);

        assertEquals(symbols.size(), symbolsFromDB.size());
        for (Symbol x : symbols) {
            int index = symbolsFromDB.indexOf(x);
            assertTrue(index > -1);
            Symbol webSymbolInDb = symbolsFromDB.get(index);
                assertEquals(x.getActions().size(), webSymbolInDb.getActions().size());
        }
    }

    @Test
    public void shouldGetTheRightSymbol() {
        symbolDAO.create(symbol);
        Symbol symb2 = symbolDAO.getWithLatestRevision(symbol.getProjectId(), symbol.getId());

        assertEquals(symbol, symb2);
    }

    @Test
    public void shouldReturnNullIfSymbolNotFound() {
        Symbol symb2 = symbolDAO.getWithLatestRevision(symbol.getProjectId(), -1L);

        assertNull(symb2);
    }

    @Test
    public void shouldGetAllRevisionOfASymbol() {
        symbols = createWebSymbolTestList();
        symbol = symbols.get(symbols.size() - 1);

        List<Symbol> symbolRevisionInDB = symbolDAO.getWithAllRevisions(symbol.getProjectId(), symbol.getId());
        assertEquals(2, symbolRevisionInDB.size());
    }

    @Test
    public void shouldReturnAnEmptyListIfYouTryToGetAllRevisionOfANotExistingSymbol() {
        List<Symbol> symbolRevisionInDB = symbolDAO.getWithAllRevisions(symbol.getProjectId(), -1L);

        assertTrue(symbolRevisionInDB.isEmpty());
    }

    @Test
    public void shouldUpdateValidWebSymbol() {
        symbolDAO.create(symbol);
        long oldRevision = symbol.getRevision();

        symbol.setName("Test Symbol - Updated Valid Name");
        symbolDAO.update(symbol);

        Symbol symb2 = symbolDAO.getWithLatestRevision(symbol.getProject().getId(), symbol.getId());
        assertEquals(symbol.getId(), symb2.getId());
        assertEquals(new Long(oldRevision + 1), symb2.getRevision());
        assertEquals(symbol.getName(), symb2.getName());
        assertEquals(group, symb2.getGroup());

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Symbol> symbolsInDB = session.createCriteria(Symbol.class)
                                                .add(Restrictions.eq("project.id", symbol.getProjectId()))
                                                .add(Restrictions.eq("id", symbol.getId()))
                                                .add(Restrictions.eq("revision", symbol.getRevision()))
                                                .list();

        assertNotNull(symbolsInDB);
        assertEquals(1, symbolsInDB.size());

        HibernateUtil.commitTransaction();
    }

    @Test
    public void shouldUpdateTheSymbolGroup() {
        symbolDAO.create(symbol2);

        symbol2.setGroup(group);
        symbolDAO.update(symbol2);

        Symbol symbolInDB = symbolDAO.getWithLatestRevision(project.getId(), symbol2.getId());
        SymbolGroup defaultGroupInDB = symbolGroupDAO.get(project.getId(), project.getDefaultGroup().getId());
        SymbolGroup groupInDB = symbolGroupDAO.get(project.getId(), group.getId());
        assertEquals(groupInDB, symbolInDB.getGroup());
        assertEquals(0, defaultGroupInDB.getSymbolSize());
        assertEquals(2, groupInDB.getSymbolSize());
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
        symbol.setId(-1L);

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
        Symbol symb2 = new Symbol();
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
        Symbol symb2 = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());
        Symbol symb3 = symbolDAO.get(project.getId(), symbol.getId(), symbol.getRevision());

        symb2.setName(symb2.getName() + " 2");
        symbolDAO.update(symb2);

        symb3.setName(symb3.getName() + " 3");
        symbolDAO.update(symb3);
    }

    @Test
    public void shouldHideAValidSymbols() {
        symbolDAO.create(symbol);
        symbol.setName(symbol.getName() + " - updated");
        symbolDAO.update(symbol);

        symbolDAO.hide(symbol.getProject().getId(), symbol.getId());

        Symbol symbolRev1 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), 1L);
        assertNotNull(symbolRev1);
        assertTrue(symbolRev1.isHidden());

        Symbol symbolRev2 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), 2L);
        assertNotNull(symbolRev2);
        assertTrue(symbolRev2.isHidden());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotHideAnythingByInvalidID() {
        symbolDAO.create(symbol);
        symbolDAO.hide(project.getId(), -1L);
    }

    @Test
    public void shouldShowAValidSymbols() {
        symbolDAO.create(symbol);
        symbol.setName(symbol.getName() + " - updated");
        symbolDAO.update(symbol);

        symbolDAO.hide(symbol.getProject().getId(), symbol.getId());
        symbolDAO.show(symbol.getProject().getId(), symbol.getId());

        Symbol symbolRev1 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), 1L);
        assertNotNull(symbolRev1);
        assertFalse(symbolRev1.isHidden());

        Symbol symbolRev2 = symbolDAO.get(symbol.getProject().getId(), symbol.getId(), 2L);
        assertNotNull(symbolRev2);
        assertFalse(symbolRev2.isHidden());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotShowAnythingByInvalidID() {
        symbolDAO.create(symbol);
        symbolDAO.show(project.getId(), -1L);
    }

    private List<Symbol> createTestSymbolLists() {
        symbols = new LinkedList<>();
        symbols.addAll(createWebSymbolTestList());
        symbols.addAll(createRESTSymbolTestList());
        return symbols;
    }

    private List<Symbol> createWebSymbolTestList() {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            project.getSymbols().add(s);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.setAbbreviation("web_all_" + i);
            s.addAction(new WaitAction());
            if (i == SYMBOL_COUNT - 1) {
                s.setHidden(true);
            }
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                WebSymbolAction newAction = new ClearAction();
                s.addAction(newAction);
                if (i == SYMBOL_COUNT - 1) {
                    s.setHidden(true);
                }

                symbolDAO.update(s);
            }
            returnList.add(s);
        }
        return returnList;
    }

    private List<Symbol> createRESTSymbolTestList() {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            project.getSymbols().add(s);
            s.setName("Test Symbol - Get All REST No. " + i);
            s.setAbbreviation("rest_all_" + i);
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                symbolDAO.update(s);
            }
            returnList.add(s);
        }
        return returnList;
    }

}
