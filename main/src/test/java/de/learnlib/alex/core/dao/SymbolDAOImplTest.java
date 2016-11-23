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

import de.learnlib.alex.actions.WaitAction;
import de.learnlib.alex.actions.WebSymbolActions.ClearAction;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.repositories.ProjectRepository;
import de.learnlib.alex.core.repositories.SymbolActionRepository;
import de.learnlib.alex.core.repositories.SymbolGroupRepository;
import de.learnlib.alex.core.repositories.SymbolRepository;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;


@RunWith(MockitoJUnitRunner.class)
public class SymbolDAOImplTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final long GROUP_ID = 84L;
    private static final long SYMBOL_ID = 168L;

    private static final int SYMBOL_LIST_SIZE = 5;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private SymbolGroupRepository symbolGroupRepository;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private SymbolActionRepository symbolActionRepository;

    private SymbolDAO symbolDAO;

    @Before
    public void setUp() {
        symbolDAO = new SymbolDAOImpl(projectRepository, symbolGroupRepository, symbolRepository, symbolActionRepository);
    }

    @Test
    public void shouldCreateAValidSymbol() {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID))
                                                                                                     .willReturn(group);

        symbolDAO.create(symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToCreateASymbolsWithADuplicateNameOrAbbreviationWithinOneProject() {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("Test");
        symbol.setAbbreviation("test");
        //
        given(symbolRepository.countSymbolsWithSameNameOrAbbreviation(null, USER_ID, PROJECT_ID, "Test", "test"))
                .willReturn(1L);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolCreationGracefully() {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);

        symbolDAO.create(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupCreationGracefully() {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        ConstraintViolationException constraintViolationException;
        constraintViolationException = new ConstraintViolationException("Project is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException;
        transactionSystemException = new TransactionSystemException("Spring TransactionSystemException",
                                                                    rollbackException);

        symbolDAO.create(symbol); // should fail
    }

    @Test
    public void shouldGetAllRequestedSymbolsByIdRevPairs() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        List<Symbol> symbols = createWebSymbolTestList(user, project, group);
        //
        List<Long> ids = new LinkedList<>();
        ids.add(symbols.get(0).getId());
        ids.add(symbols.get(2).getId());
        ids.add(symbols.get(3).getId());
        //
        given(symbolRepository.findByIds(USER_ID, PROJECT_ID, ids)).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getByIds(user, project.getId(), ids);

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetNoSymbolIfIdRevParisIsEmpty() throws NotFoundException {
        User user = new User();
        //
        Project project = new Project();
        //
        List<Long> ids = Collections.emptyList();

        List<Symbol> symbolsFromDB = symbolDAO.getByIds(user, project.getId(), ids);

        assertEquals(0, symbolsFromDB.size());
    }

    @Test
    public void shouldGetAllVisibleSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        List<Symbol> symbols = createTestSymbolLists(user, project, group);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(symbolRepository.findAll(USER_ID, PROJECT_ID, new Boolean[] {false})).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId(),
                                                                        SymbolVisibilityLevel.VISIBLE);

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetAllSymbolsIncludingHiddenOnes() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        List<Symbol> symbols = createTestSymbolLists(user, project, group);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(symbolRepository.findAll(USER_ID, PROJECT_ID, new Boolean[] {true, false})).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId(),
                                                                        SymbolVisibilityLevel.ALL);

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetAllSymbolsOfAGroup() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        List<Symbol> symbols = createTestSymbolLists(user, project, group);
        //
        given(symbolRepository.findAll(USER_ID, PROJECT_ID, GROUP_ID, new Boolean[] {true, false})).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId(), group.getId(),
                                                                        SymbolVisibilityLevel.ALL);

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetTheRightSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setId(SYMBOL_ID);
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

        Symbol symb2 = symbolDAO.get(user, symbol.getProjectId(), symbol.getId());

        assertEquals(symbol, symb2);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfSymbolNotFound() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);

        symbolDAO.get(user, symbol.getProjectId(), -1L); // should fail
    }

    @Test
    public void shouldUpdateASymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
//        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID)).willReturn(group);
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willReturn(symbol);

        symbolDAO.update(symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToUpdateASymbolsWithADuplicateNameOrAbbreviationWithinOneProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("Test");
        symbol.setAbbreviation("test");
        //
        given(symbolRepository.countSymbolsWithSameNameOrAbbreviation(symbol.getId(), USER_ID,
                                                                      PROJECT_ID, "Test", "test"))
                .willReturn(1L);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
//        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID)).willReturn(group);
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willThrow(DataIntegrityViolationException.class);

        symbolDAO.update(symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        ConstraintViolationException constraintViolationException;
        constraintViolationException = new ConstraintViolationException("Project is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException;
        transactionSystemException = new TransactionSystemException("Spring TransactionSystemException",
                                                                    rollbackException);
        //
//        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID)).willReturn(group);
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willThrow(transactionSystemException);

        symbolDAO.update(symbol); // should fail
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group1 = new SymbolGroup();
        group1.setGroupId(GROUP_ID);
        group1.setId(GROUP_ID);
        SymbolGroup group2 = new SymbolGroup();
        group1.setGroupId(GROUP_ID + 1);
        group2.setId(GROUP_ID + 1);
        //
        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID))
                                                                                                    .willReturn(group1);
        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID + 1))
                                                                                                    .willReturn(group2);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group1);
        symbol.setId(SYMBOL_ID);
        //
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

        symbolDAO.move(symbol, GROUP_ID + 1);

        assertThat(group1.getSymbolSize(), is(equalTo(0)));
        assertThat(group2.getSymbolSize(), is(equalTo(1)));
        assertThat(symbol.getGroup(), is(equalTo(group2)));
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatAnExceptionIsThrownWhileMovingASymbolIfTheGroupDoesNotExist() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);

        symbolDAO.move(symbol, -1L); // should fail
    }

    @Test
    public void shouldMoveSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group1 = new SymbolGroup();
        group1.setGroupId(GROUP_ID);
        group1.setId(GROUP_ID);
        SymbolGroup group2 = new SymbolGroup();
        group1.setGroupId(GROUP_ID + 1);
        group2.setId(GROUP_ID + 1);
        //
        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID))
                                                                                                    .willReturn(group1);
        given(symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(USER_ID, PROJECT_ID, GROUP_ID + 1))
                                                                                                    .willReturn(group2);
        //
        List<Symbol> symbols = createTestSymbolLists(user, project, group1);
        //
        symbols.forEach(s -> {
            given(symbolRepository.findOne(USER_ID, PROJECT_ID, s.getId())).willReturn(s);
        });

        symbolDAO.move(symbols, GROUP_ID + 1);

        assertThat(group1.getSymbolSize(), is(equalTo(0)));
        assertThat(group2.getSymbolSize(), is(equalTo(symbols.size())));
        symbols.forEach(s -> assertThat(s.getGroup(), is(equalTo(group2))));
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatAnExceptionIsThrownWhileMovingSymbolsIfTheGroupDoesNotExist() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        List<Symbol> symbols = createTestSymbolLists(user, project, group);
        //
        List<Long> symbolsIds = new LinkedList<>();
        symbols.forEach(s -> symbolsIds.add(s.getId()));

        symbolDAO.move(symbols, -1L); // should fail
    }

    @Test
    public void shouldHideAValidSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

        symbolDAO.hide(USER_ID, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        assertTrue(symbol.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotHideAnythingByInvalidID() throws NotFoundException {
        symbolDAO.hide(USER_ID, PROJECT_ID, Collections.singletonList(-1L)); // should fail
    }

    @Test
    public void shouldShowAValidSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setUser(user);
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(symbolRepository.findOne(USER_ID, PROJECT_ID, SYMBOL_ID)).willReturn(symbol);
        //
        symbolDAO.hide(USER_ID, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        symbolDAO.show(USER_ID, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        assertFalse(symbol.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotShowAnythingByInvalidID() throws NotFoundException {
        symbolDAO.show(USER_ID, PROJECT_ID, Collections.singletonList(-1L)); // should fail
    }

    private List<Symbol> createTestSymbolLists(User user, Project project, SymbolGroup group) throws NotFoundException {
        List<Symbol> symbols = new LinkedList<>();
        symbols.addAll(createWebSymbolTestList(user, project, group));
        symbols.addAll(createRESTSymbolTestList(user, project, group));

        for (int id = 0; id < symbols.size(); id++) {
            Symbol symbol = symbols.get(id);
            long symbolId = (long) id;

            symbol.setSymbolId(symbolId);
            symbol.setId(symbolId);
        }

        return symbols;
    }

    private List<Symbol> createWebSymbolTestList(User user, Project project, SymbolGroup group)
            throws NotFoundException {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_LIST_SIZE; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            s.setUser(user);
            project.getSymbols().add(s);
            s.setId((long) i);
            s.setGroup(group);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.setAbbreviation("web_all_" + i);
            s.addAction(new WaitAction());
            if (i == SYMBOL_LIST_SIZE - 1) {
                s.setHidden(true);
            }

            if (i > SYMBOL_LIST_SIZE / 2) {
                s.setName(s.getName() + " 2");
                ClearAction newAction = new ClearAction();
                newAction.setNode("#node-id");
                s.addAction(newAction);
                if (i == SYMBOL_LIST_SIZE - 1) {
                    s.setHidden(true);
                }
            }
            returnList.add(s);
        }
        return returnList;
    }

    private List<Symbol> createRESTSymbolTestList(User user, Project project, SymbolGroup group)
            throws NotFoundException {
        List<Symbol> returnList = new LinkedList<>();
        for (int i = 0; i < SYMBOL_LIST_SIZE; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            s.setUser(user);
            project.getSymbols().add(s);
            s.setGroup(group);
            s.setName("Test Symbol - Get All REST No. " + i);
            s.setAbbreviation("rest_all_" + i);

            if (i > SYMBOL_LIST_SIZE / 2) {
                s.setName(s.getName() + " 2");
            }
            returnList.add(s);
        }
        return returnList;
    }

}
