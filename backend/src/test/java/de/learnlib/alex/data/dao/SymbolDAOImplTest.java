/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolVisibilityLevel;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.data.entities.actions.web.ClearAction;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
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
    private ProjectDAO projectDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolGroupRepository symbolGroupRepository;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private SymbolActionRepository symbolActionRepository;

    @Mock
    private SymbolParameterRepository symbolParameterRepository;

    private SymbolDAO symbolDAO;

    @Before
    public void setUp() {
        symbolDAO = new SymbolDAOImpl(projectRepository, projectDAO, symbolGroupRepository, symbolRepository,
                symbolActionRepository, symbolGroupDAO, symbolParameterRepository);
    }

    @Test
    public void shouldCreateAValidSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group);

        symbolDAO.create(user, symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToCreateASymbolsWithADuplicateNameWithinOneProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("Test");

        Symbol symbol2 = new Symbol();
        symbol2.setProject(project);
        symbol2.setGroup(group);
        symbol2.setName("Test");

        given(symbolRepository.getSymbolByName(PROJECT_ID, "Test")).willReturn(symbol2);

        symbolDAO.create(user, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolCreationGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group);
        given(symbolRepository.save(symbol)).willThrow(DataIntegrityViolationException.class);

        symbolDAO.create(user, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupCreationGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        ConstraintViolationException constraintViolationException;
        constraintViolationException = new ConstraintViolationException("Project is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException;
        transactionSystemException = new TransactionSystemException("Spring TransactionSystemException",
                rollbackException);

        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group);
        given(symbolRepository.save(symbol)).willThrow(transactionSystemException);

        symbolDAO.create(user, symbol); // should fail
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
        given(symbolRepository.findByIds(PROJECT_ID, ids)).willReturn(symbols);

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
        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolRepository.findAll(PROJECT_ID, new Boolean[]{false})).willReturn(symbols);

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
        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolRepository.findAll(PROJECT_ID, new Boolean[]{true, false})).willReturn(symbols);

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
        given(symbolRepository.findAll(PROJECT_ID, GROUP_ID, new Boolean[]{true, false})).willReturn(symbols);

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
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(symbolRepository.findOne(PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

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
        symbol.setProject(project);
        symbol.setGroup(group);

        symbolDAO.get(user, symbol.getProjectId(), -1L); // should fail
    }

    @Test
    public void shouldUpdateASymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(symbolRepository.findOne(PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willReturn(symbol);

        symbolDAO.update(user, symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToUpdateASymbolsWithADuplicateNameWithinOneProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setId(0L);
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("Test");

        Symbol symbol2 = new Symbol();
        symbol2.setId(1L);
        symbol2.setProject(project);
        symbol2.setGroup(group);
        symbol2.setName("Test");

        given(symbolRepository.getSymbolByName(PROJECT_ID, "Test")).willReturn(symbol2);

        symbolDAO.update(user, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(symbolRepository.findOne(PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willThrow(DataIntegrityViolationException.class);

        symbolDAO.update(user, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);
        //
        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        //
        Symbol symbol = new Symbol();
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
        given(symbolRepository.findOne(PROJECT_ID, symbol.getId())).willReturn(symbol);
        given(symbolRepository.save(symbol)).willThrow(transactionSystemException);

        symbolDAO.update(user, symbol); // should fail
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        SymbolGroup group1 = new SymbolGroup();
        group1.setId(GROUP_ID);

        SymbolGroup group2 = new SymbolGroup();
        group2.setId(GROUP_ID + 1);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group1);
        symbol.setId(SYMBOL_ID);

        List<Symbol> symbols = Collections.singletonList(symbol);
        List<Long> symbolIds = Collections.singletonList(symbol.getId());

        given(projectRepository.findOne(PROJECT_ID)).willReturn(project);
        given(symbolRepository.findByIds(PROJECT_ID, symbolIds)).willReturn(symbols);
        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group1);
        given(symbolGroupRepository.findOne(GROUP_ID + 1)).willReturn(group2);
        given(symbolRepository.save(symbols)).willReturn(symbols);

        symbolDAO.move(user, PROJECT_ID, SYMBOL_ID, GROUP_ID + 1);

        assertThat(group1.getSymbols().size(), is(equalTo(0)));
        assertThat(group2.getSymbols().size(), is(equalTo(1)));
        assertThat(symbol.getGroup(), is(equalTo(group2)));
    }

    @Test
    public void shouldMoveSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group1 = new SymbolGroup();
        group1.setId(GROUP_ID);

        SymbolGroup group2 = new SymbolGroup();
        group2.setId(GROUP_ID + 1);

        List<Symbol> symbols = createTestSymbolLists(user, project, group1);
        List<Long> symbolIds = symbols.stream().map(Symbol::getId).collect(Collectors.toList());

        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group1);
        given(symbolGroupRepository.findOne(GROUP_ID + 1)).willReturn(group2);
        given(projectRepository.findOne(PROJECT_ID)).willReturn(project);
        given(symbolRepository.findByIds(PROJECT_ID, symbolIds)).willReturn(symbols);

        symbolDAO.move(user, PROJECT_ID, symbolIds, GROUP_ID + 1);

        assertThat(group1.getSymbols().size(), is(equalTo(0)));
        assertThat(group2.getSymbols().size(), is(equalTo(symbols.size())));
        symbols.forEach(s -> assertThat(s.getGroup(), is(equalTo(group2))));
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatAnExceptionIsThrownWhileMovingSymbolsIfTheGroupDoesNotExist() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        List<Symbol> symbols = createTestSymbolLists(user, project, group);
        List<Long> symbolIds = symbols.stream().map(Symbol::getId).collect(Collectors.toList());

        given(projectRepository.findOne(PROJECT_ID)).willReturn(project);
        given(symbolRepository.findByIds(PROJECT_ID, symbolIds)).willReturn(symbols);
        given(symbolGroupRepository.findOne(GROUP_ID)).willReturn(group);
        given(symbolGroupRepository.findOne(-1L)).willReturn(null);

        doThrow(NotFoundException.class).when(symbolGroupDAO).checkAccess(user, project, null);

        symbolDAO.move(user, PROJECT_ID, symbolIds, -1L); // should fail
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
        symbol.setProject(project);
        symbol.setGroup(group);
        //
        given(symbolRepository.findOne(PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

        symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        assertTrue(symbol.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotHideAnythingByInvalidID() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(-1L)); // should fail
    }

    @Test
    public void shouldShowAValidSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.getUrls().add(new ProjectUrl());

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectDAO.getByID(USER_ID, PROJECT_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        given(symbolRepository.findOne(PROJECT_ID, SYMBOL_ID)).willReturn(symbol);

        symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID));
        symbolDAO.show(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        assertFalse(symbol.isHidden());
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotShowAnythingByInvalidID() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        symbolDAO.show(user, PROJECT_ID, Collections.singletonList(-1L)); // should fail
    }

    private List<Symbol> createTestSymbolLists(User user, Project project, SymbolGroup group) throws NotFoundException {
        List<Symbol> symbols = new LinkedList<>();
        symbols.addAll(createWebSymbolTestList(user, project, group));
        symbols.addAll(createRESTSymbolTestList(user, project, group));

        for (int id = 0; id < symbols.size(); id++) {
            Symbol symbol = symbols.get(id);
            long symbolId = (long) id;

            symbol.setUUID(UUID.randomUUID());
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
            project.getSymbols().add(s);
            s.setId((long) i);
            s.setGroup(group);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.addAction(new WaitAction());
            if (i == SYMBOL_LIST_SIZE - 1) {
                s.setHidden(true);
            }

            if (i > SYMBOL_LIST_SIZE / 2) {
                s.setName(s.getName() + " 2");
                WebElementLocator node = new WebElementLocator();
                node.setSelector("#node-id");
                node.setType(WebElementLocator.Type.CSS);

                ClearAction newAction = new ClearAction();
                newAction.setNode(node);
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
            project.getSymbols().add(s);
            s.setGroup(group);
            s.setName("Test Symbol - Get All REST No. " + i);

            if (i > SYMBOL_LIST_SIZE / 2) {
                s.setName(s.getName() + " 2");
            }
            returnList.add(s);
        }
        return returnList;
    }

}
