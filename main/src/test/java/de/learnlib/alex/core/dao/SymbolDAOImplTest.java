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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.actions.ExecuteSymbolAction;
import de.learnlib.alex.actions.WaitAction;
import de.learnlib.alex.actions.WebSymbolActions.CheckTextWebAction;
import de.learnlib.alex.actions.WebSymbolActions.ClearAction;
import de.learnlib.alex.actions.WebSymbolActions.ClickAction;
import de.learnlib.alex.actions.WebSymbolActions.FillAction;
import de.learnlib.alex.actions.WebSymbolActions.GotoAction;
import de.learnlib.alex.actions.WebSymbolActions.SubmitAction;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
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
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class SymbolDAOImplTest {

    private static final int SYMBOL_COUNT = 5;

    private static UserDAO userDAO;
    private static ProjectDAO projectDAO;
    private static SymbolGroupDAOImpl symbolGroupDAO;
    private static SymbolDAO symbolDAO;

    private User user;
    private Project project;
    private SymbolGroup group;
    private Symbol symbol;
    private Symbol symbol2;
    private List<Symbol> symbols;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        projectDAO = new ProjectDAOImpl();
        symbolGroupDAO = new SymbolGroupDAOImpl();
        symbolDAO = new SymbolDAOImpl();
    }

    @Before
    public void setUp() {
        user = new User();
        user.setEmail("SymbolDAOIMplTest@alex.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);

        // create project
        project = new Project();
        project.setName("SymbolDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        project.setUser(user);
        projectDAO.create(project);

        // create group
        group = new SymbolGroup();
        group.setName("Symbol");
        group.setProject(project);
        group.setUser(user);
        symbolGroupDAO.create(group);

        // create symbol 1
        symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("SymbolDAOImplTest Symbol - Web ");
        symbol.setAbbreviation("webtest");

        CheckTextWebAction a1 = new CheckTextWebAction();
        a1.setValue("Lorem Ipsum");
        symbol.addAction(a1);
        ClearAction a2 = new ClearAction();
        a2.setNode("#node-id");
        symbol.addAction(a2);
        ClickAction a3 = new ClickAction();
        a3.setNode("#superlong > css trace .with-absolute ~no_meaning .at-all > .1234567890 > .1234567890 > .1234567890"
                           + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890"
                           + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890"
                           + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890"
                           + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890");
        symbol.addAction(a3);
        FillAction a4 = new FillAction();
        a4.setNode("#node-id");
        a4.setValue("Lorem Ipsum");
        symbol.addAction(a4);
        GotoAction a5 = new GotoAction();
        a5.setUrl("http://localhost");
        symbol.addAction(a5);
        SubmitAction a6 = new SubmitAction();
        a6.setNode("#node-id");
        symbol.addAction(a6);
        WaitAction a7 = new WaitAction();
        symbol.addAction(a7);
        ExecuteSymbolAction a8 = new ExecuteSymbolAction();
        a8.setSymbolToExecute(symbol);
        symbol.addAction(a8);

        // create symbol 2
        symbol2 = new Symbol();
        symbol2.setName("SymbolDAOImplTest Symbol - Web 2");
        symbol2.setAbbreviation("webtest2");
        symbol2.setProject(project);
        symbol2.setUser(user);

        // create symbol list
        symbols = new LinkedList<>();
        symbols.add(symbol);
        symbols.add(symbol2);
    }

    @After
    public void tearDown() throws NotFoundException {
        userDAO.delete(user.getId());
    }

    @Test
    public void shouldCreateValidWebSymbol() throws NotFoundException {
        // given
        long idBefore = project.getNextSymbolId();

        // when
        symbolDAO.create(symbol);

        // then
        Symbol symbolInDB = symbolDAO.get(user, project.getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symbolInDB);
        Project project2 = projectDAO.getByID(user.getId(), symbolInDB.getProjectId());

        assertEquals(symbol.getName(), symbolInDB.getName());
        assertEquals(symbol.getAbbreviation(), symbolInDB.getAbbreviation());
        assertEquals(symbol.getRevision(), symbolInDB.getRevision());
        assertEquals(group, symbol.getGroup());
        assertEquals(symbol.getProject(), symbolInDB.getProject());
        assertEquals(symbol.getUser(), symbolInDB.getUser());
        assertEquals(project, project2);
        assertEquals(Long.valueOf(idBefore + 1), project2.getNextSymbolId());

        assertNotNull(symbolInDB.getActions());
        assertEquals(symbol.getActions().size(), symbolInDB.getActions().size());
        for (int i = 0; i < symbol.getActions().size(); i++) {
            SymbolAction expectedAction = symbol.getActions().get(i);
            SymbolAction actualAction = symbolInDB.getActions().get(i);
            assertEquals(expectedAction, actualAction);
        }
    }

    @Test
    public void shouldCreateAValidSymbolWithoutAGroup() throws NotFoundException {
        // when
        symbolDAO.create(symbol2);

        // then
        Symbol symbolInDB = symbolDAO.get(user, project.getId(), symbol2.getId(), symbol2.getRevision());
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
            assertEquals(null, symbol.getId());
            assertEquals(null, symbol.getRevision());
        }

    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateWebSymbolWithNotUniqueName() {
        symbolDAO.create(symbol);
        Symbol symb2 = new Symbol();
        symb2.setProject(symbol.getProject());
        symb2.setUser(user);
        symb2.setName(symbol.getName());

        symbolDAO.create(symb2); // should fail
    }

    @Test
    public void shouldCreateValidWebSymbols() throws NotFoundException {
        // given
        long idBefore = project.getNextSymbolId();

        // when
        symbolDAO.create(symbols);

        // then
        Symbol symbolInDB = symbolDAO.get(user, project.getId(), symbol.getId(), symbol.getRevision());
        assertNotNull(symbolInDB);
        Symbol websymbolInDB = symbolInDB;
        Project project2 = projectDAO.getByID(user.getId(), symbolInDB.getProjectId());

        assertEquals(symbol.getName(), symbolInDB.getName());
        assertEquals(symbol.getAbbreviation(), symbolInDB.getAbbreviation());
        assertEquals(symbol.getRevision(), symbolInDB.getRevision());
        assertEquals(symbol.getProject(), symbolInDB.getProject());
        assertEquals(project, project2);
        assertEquals(Long.valueOf(idBefore + 2), project2.getNextSymbolId());

        assertNotNull(websymbolInDB.getActions());
        assertEquals(symbol.getActions().size(), websymbolInDB.getActions().size());
        for (int i = 0; i < symbol.getActions().size(); i++) {
            SymbolAction expectedAction = symbol.getActions().get(i);
            SymbolAction actualAction = websymbolInDB.getActions().get(i);
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
            assertEquals(idBefore, project.getNextSymbolId());
            assertEquals(Long.valueOf(1), symbol.getId());
            assertEquals(null, symbol.getRevision());
            assertEquals(null, symbol2.getId());
            assertEquals(null, symbol2.getRevision());
        }
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
            assertEquals(idBefore, project.getNextSymbolId());
            assertEquals(null, symbol.getId());
            assertEquals(Long.valueOf(1), symbol.getRevision());
            assertEquals(null, symbol2.getId());
            assertEquals(null, symbol2.getRevision());
        }
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
            assertEquals(idBefore, project.getNextSymbolId());
            assertEquals(null, symbol.getId());
            assertEquals(null, symbol.getRevision());
            assertEquals(null, symbol2.getId());
            assertEquals(null, symbol2.getRevision());
        }
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
            // creation failed -> success
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
        invalidSymbol.setAbbreviation("no_unique_name");
        invalidSymbol.setUser(user);
        invalidSymbol.setName(symbol.getName());
        symbolDAO.create(invalidSymbol);

        try {
            symbolDAO.create(symbols); // should fail
            fail("creation didn't fail.");
        } catch (ValidationException e) {
            // creation failed -> success
            assertEquals(idBefore, project.getNextSymbolId());
            assertEquals(null, symbol2.getId());
            assertEquals(null, symbol2.getRevision());
        }
    }

    @Test
    public void shouldBeAllowedToHaveTheSameNameAndAbbreviationInDifferentProjects() throws NotFoundException {
        Symbol symb2 = new Symbol();
        symb2.setProject(project);
        symb2.setUser(user);
        symb2.setName(symbol.getName());
        symb2.setAbbreviation(symbol.getAbbreviation());

        symbolDAO.create(symb2);
        Symbol symb2FromDB = symbolDAO.get(user, project.getId(), symb2.getId(), symb2.getRevision());
        assertNotNull(symb2FromDB);
        assertEquals(symb2.getProject(), symb2FromDB.getProject());
        assertEquals(symb2.getName(), symb2FromDB.getName());
        assertEquals(symb2.getAbbreviation(), symb2FromDB.getAbbreviation());
        assertEquals(symb2.getRevision(), symb2FromDB.getRevision());
    }

    @Test
    public void shouldGetAllRequestedSymbolsByIdRevPairs() throws NotFoundException {
        symbols = createWebSymbolTestList();

        List<IdRevisionPair> pairs = new LinkedList<>();
        pairs.add(new IdRevisionPair(symbols.get(0).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(2).getId(), 1));
        pairs.add(new IdRevisionPair(symbols.get(3).getId(), 2));

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId(), pairs);
        assertEquals(pairs.size(), symbolsFromDB.size());
        for (Symbol x : symbolsFromDB) {
            int index = symbolsFromDB.indexOf(x);
            assertTrue(x + " was not in the returned Symbols from the DB", index > -1);
            Symbol webSymbolInDb = symbolsFromDB.get(index);
            assertEquals(x.getActions().size(), webSymbolInDb.getActions().size());
        }
    }

    @Test
    public void shouldGetNoSymbolIfIdRevParisIsEmpty() throws NotFoundException {
        symbols = createWebSymbolTestList();
        List<IdRevisionPair> pairs = new LinkedList<>();

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId(), pairs);

        assertEquals(0, symbolsFromDB.size());
    }

    @Test
    public void shouldGetAllVisibleSymbols() throws NotFoundException {
        symbols = createTestSymbolLists();

        List<Symbol> symbolsFromDB = symbolDAO.getAllWithLatestRevision(user, project.getId(),
                                                                        SymbolVisibilityLevel.VISIBLE);

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
    public void shouldGetAllSymbolsIncludingHiddenOnes() throws NotFoundException {
        symbols = createTestSymbolLists();

        List<Symbol> symbolsFromDB = symbolDAO.getAllWithLatestRevision(user, project.getId(),
                                                                        SymbolVisibilityLevel.ALL);

        assertEquals(symbols.size(), symbolsFromDB.size());
        for (Symbol x : symbols) {
            int index = symbolsFromDB.indexOf(x);
            assertTrue(index > -1);
            Symbol webSymbolInDb = symbolsFromDB.get(index);
                assertEquals(x.getActions().size(), webSymbolInDb.getActions().size());
        }
    }

    @Test
    public void shouldGetAllSymbolsOfAGroup() throws NotFoundException {
        symbols = createTestSymbolLists();

        List<Symbol> symbolsFromDB = symbolDAO.getAllWithLatestRevision(user, project.getId(), group.getId(),
                                                                        SymbolVisibilityLevel.ALL);

        assertEquals(SYMBOL_COUNT + 1, symbolsFromDB.size()); // SYMBOL_COUNT are created in the test list + the symbol
    }

    @Test
    public void shouldGetTheRightSymbol() throws NotFoundException {
        symbolDAO.create(symbol);
        Symbol symb2 = symbolDAO.getWithLatestRevision(user, symbol.getProjectId(), symbol.getId());

        assertEquals(symbol, symb2);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfSymbolNotFound() throws NotFoundException {
        symbolDAO.getWithLatestRevision(user, symbol.getProjectId(), -1L);
    }

    @Test
    public void shouldGetAllRevisionOfASymbol() throws NotFoundException {
        symbols = createWebSymbolTestList();
        symbol = symbols.get(symbols.size() - 1);

        List<Symbol> symbolRevisionInDB = symbolDAO.getWithAllRevisions(user, symbol.getProjectId(), symbol.getId());
        assertEquals(2, symbolRevisionInDB.size());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfYouTryToGetAllRevisionOfANotExistingSymbol() throws NotFoundException {
        symbolDAO.getWithAllRevisions(user, symbol.getProjectId(), -1L);
    }

    @Test
    public void shouldUpdateValidWebSymbol() throws NotFoundException {
        symbolDAO.create(symbol);
        long oldRevision = symbol.getRevision();

        symbol.setName("Test Symbol - Updated Valid Name");
        symbolDAO.update(symbol);

        Symbol symbolInDB = symbolDAO.getWithLatestRevision(user, symbol.getProject().getId(), symbol.getId());
        assertEquals(symbol.getId(), symbolInDB.getId());
        assertEquals(Long.valueOf(oldRevision + 1), symbolInDB.getRevision());
        assertEquals(symbol.getName(), symbolInDB.getName());
        assertEquals(group, symbolInDB.getGroup());

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Symbol> symbolsInDB = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("project.id", symbol.getProjectId()))
                                            .add(Restrictions.eq("idRevisionPair.id", symbol.getId()))
                                            .add(Restrictions.eq("idRevisionPair.revision", symbol.getRevision()))
                                            .list();

        assertNotNull(symbolsInDB);
        assertEquals(1, symbolsInDB.size());

        HibernateUtil.commitTransaction();
    }

    @Test
    public void shouldUpdateTheSymbolGroup() throws NotFoundException {
        symbolDAO.create(symbol2);

        symbol2.setGroup(group);
        symbolDAO.update(symbol2);

        Symbol symbolInDB = symbolDAO.getWithLatestRevision(user, project.getId(), symbol2.getId());
        SymbolGroup defaultGroupInDB = symbolGroupDAO.get(user, project.getId(), project.getDefaultGroup().getId(),
                                                          SymbolGroupDAO.EmbeddableFields.ALL);
        SymbolGroup groupInDB = symbolGroupDAO.get(user, project.getId(), group.getId(),
                                                   SymbolGroupDAO.EmbeddableFields.ALL);
        assertEquals(groupInDB, symbolInDB.getGroup());
        assertEquals(0, defaultGroupInDB.getSymbolSize());
        assertEquals(2, groupInDB.getSymbolSize());
    }

    @Test
    public void shouldUpdateTheSymbolGroup2() throws NotFoundException {
        symbolDAO.create(symbol);

        symbol.setGroup(project.getDefaultGroup());
        symbolDAO.update(symbol);

        Symbol symbolInDB = symbolDAO.getWithLatestRevision(user, project.getId(), symbol.getId());
        SymbolGroup defaultGroupInDB = symbolGroupDAO.get(user, project.getId(), project.getDefaultGroup().getId(),
                                                          SymbolGroupDAO.EmbeddableFields.ALL);
        SymbolGroup groupInDB = symbolGroupDAO.get(user, project.getId(), group.getId(),
                                                   SymbolGroupDAO.EmbeddableFields.ALL);
        assertEquals(defaultGroupInDB, symbolInDB.getGroup());
        assertEquals(2, defaultGroupInDB.getSymbolSize());
        assertEquals(0, groupInDB.getSymbolSize());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateInvalidWebSymbol() throws NotFoundException {
        symbolDAO.create(symbol);
        symbol.setName("");

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailOnUpdateByInvalidID() throws NotFoundException {
        symbolDAO.create(symbol);
        symbol.setId(-1L);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = NotFoundException.class)
    // The Symbol ID contains the Project -> No Project == Invalid ID
    public void shouldFailOnUpdateWithoutProject() throws NotFoundException {
        symbolDAO.create(symbol);
        symbol.setProject(null);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateWebSymbolWithoutUniqueName() throws NotFoundException {
        symbolDAO.create(symbol);
        Symbol symb2 = new Symbol();
        symb2.setProject(project);
        symb2.setUser(user);
        symb2.setName("Test Symbol - Update Without Unique Name");
        symb2.setAbbreviation("upd_uni_na");
        symbolDAO.create(symb2);

        symb2.setName(symbol.getName());

        symbolDAO.update(symb2); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotAllowUpdateFromOldRevision() throws NotFoundException {
        symbolDAO.create(symbol);
        Symbol symb2 = symbolDAO.get(user, project.getId(), symbol.getId(), symbol.getRevision());
        Symbol symb3 = symbolDAO.get(user, project.getId(), symbol.getId(), symbol.getRevision());

        symb2.setName(symb2.getName() + " 2");
        symbolDAO.update(symb2);

        symb3.setName(symb3.getName() + " 3");
        symbolDAO.update(symb3);
    }

    @Test
    public void shouldDoBatchUpdate() throws NotFoundException {
        symbolDAO.create(symbols);
        symbol.setName(symbol.getName() + " - updated");
        symbol2.setName(symbol2.getName() + " - updated");

        symbolDAO.update(symbols);

        symbols = symbolDAO.getAllWithLatestRevision(user, project.getId(), SymbolVisibilityLevel.VISIBLE);
        assertEquals(symbol.getName(), symbols.get(0).getName());
        assertEquals(symbol2.getName(), symbols.get(1).getName());
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        symbolDAO.create(symbol2);

        symbolDAO.move(symbol2, group.getId());

        Symbol symbolInDB = symbolDAO.getWithLatestRevision(user, symbol2.getProjectId(), symbol2.getId());
        assertEquals(symbol2.getRevision(), symbolInDB.getRevision());
        assertEquals(group.getId(), symbolInDB.getGroupId());
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatAnExceptionIsThrownWhileMovingASymbolIfTheGroupDoesNotExist() throws NotFoundException {
        symbolDAO.create(symbol2);

        symbolDAO.move(symbol2, -1L); // should fail
    }

    @Test
    public void shouldMoveSymbols() throws NotFoundException {
        symbolDAO.create(symbols);
        List<Long> symbolsIds = new LinkedList<>();
        symbols.forEach(s -> symbolsIds.add(s.getId()));

        symbolDAO.move(symbols, group.getId());

        List<Symbol> symbolsInDB = symbolDAO.getByIdsWithLatestRevision(user, symbol2.getProjectId(),
                                                                       symbolsIds.toArray(new Long[symbolsIds.size()]));
        symbolsInDB.forEach(s -> {
            assertEquals(Long.valueOf(1L), s.getRevision());
            assertEquals(group.getId(), s.getGroupId());
        });
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatAnExceptionIsThrownWhileMovingSymbolsIfTheGroupDoesNotExist() throws NotFoundException {
        symbolDAO.create(symbols);
        List<Long> symbolsIds = new LinkedList<>();
        symbols.forEach(s -> symbolsIds.add(s.getId()));

        symbolDAO.move(symbols, -1L); // should fail
    }

    @Test
    public void shouldHideAValidSymbols() throws NotFoundException {
        symbolDAO.create(symbol);
        symbol.setName(symbol.getName() + " - updated");
        symbolDAO.update(symbol);

        symbolDAO.hide(user.getId(), project.getId(), symbol.getId());

        Symbol symbolRev1 = symbolDAO.get(user, project.getId(), symbol.getId(), 1L);
        assertNotNull(symbolRev1);
        assertTrue(symbolRev1.isHidden());

        Symbol symbolRev2 = symbolDAO.get(user, project.getId(), symbol.getId(), 2L);
        assertNotNull(symbolRev2);
        assertTrue(symbolRev2.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotHideAnythingByInvalidID() throws NotFoundException {
        symbolDAO.create(symbol);

        symbolDAO.hide(user.getId(), project.getId(), -1L); // should fail
    }

    @Test
    public void shouldShowAValidSymbols() throws NotFoundException {
        symbolDAO.create(symbol);
        symbol.setName(symbol.getName() + " - updated");
        symbolDAO.update(symbol);

        symbolDAO.hide(user.getId(), project.getId(), symbol.getId());
        symbolDAO.show(user.getId(), project.getId(), symbol.getId());

        Symbol symbolRev1 = symbolDAO.get(user, project.getId(), symbol.getId(), 1L);
        assertNotNull(symbolRev1);
        assertFalse(symbolRev1.isHidden());

        Symbol symbolRev2 = symbolDAO.get(user, project.getId(), symbol.getId(), 2L);
        assertNotNull(symbolRev2);
        assertFalse(symbolRev2.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotShowAnythingByInvalidID() throws NotFoundException {
        symbolDAO.create(symbol);

        symbolDAO.show(user.getId(), project.getId(), -1L); // should fail
    }

    private List<Symbol> createTestSymbolLists() throws NotFoundException {
        symbols = new LinkedList<>();
        symbols.addAll(createWebSymbolTestList());
        symbols.addAll(createRESTSymbolTestList());
        return symbols;
    }

    private List<Symbol> createWebSymbolTestList() throws NotFoundException {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            s.setUser(user);
            project.getSymbols().add(s);
            if (i % 2 == 0) {  // add every second symbol to another group
                s.setGroup(group);
            }
            s.setName("Test Symbol - Get All Web No. " + i);
            s.setAbbreviation("web_all_" + i);
            s.addAction(new WaitAction());
            if (i == SYMBOL_COUNT - 1) {
                s.setHidden(true);
            }
            symbolDAO.create(s);

            if (i > SYMBOL_COUNT / 2) {
                s.setName(s.getName() + " 2");
                ClearAction newAction = new ClearAction();
                newAction.setNode("#node-id");
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

    private List<Symbol> createRESTSymbolTestList() throws NotFoundException {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_COUNT; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            s.setUser(user);
            project.getSymbols().add(s);
            if (i % 2 == 0) { // add every second symbol to another group
                s.setGroup(group);
            }
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
