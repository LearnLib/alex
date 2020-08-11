/*
 * Copyright 2015 - 2020 TU Dortmund
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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.data.entities.actions.web.ClearAction;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.data.repositories.SymbolSymbolStepRepository;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionResultRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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
public class SymbolDAOTest {

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

    @Mock
    private SymbolStepRepository symbolStepRepository;

    @Mock
    private ParameterizedSymbolDAO parameterizedSymbolDAO;

    @Mock
    private SymbolSymbolStepRepository symbolSymbolStepRepository;

    @Mock
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    @Mock
    private TestCaseStepRepository testCaseStepRepository;

    @Mock
    private TestExecutionResultRepository testExecutionResultRepository;

    @Mock
    private ProjectEnvironmentRepository projectEnvironmentRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private SymbolParameterDAO symbolParameterDAO;

    @Mock
    private SymbolPresenceService symbolPresenceService;

    private SymbolDAO symbolDAO;

    @Before
    public void setUp() {
        symbolDAO = new SymbolDAO(projectRepository, projectDAO, symbolGroupRepository, symbolRepository,
                symbolActionRepository, symbolGroupDAO, symbolParameterRepository, symbolStepRepository,
                parameterizedSymbolDAO, parameterizedSymbolRepository, symbolSymbolStepRepository,
                testCaseStepRepository, testExecutionResultRepository, projectEnvironmentRepository,
                objectMapper, symbolParameterDAO, symbolPresenceService);
    }

    @Test
    public void shouldCreateAValidSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolRepository.save(symbol)).willReturn(symbol);

        symbolDAO.create(user, PROJECT_ID, symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToCreateASymbolsWithADuplicateNameWithinOneProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
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

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findOneByProject_IdAndName(PROJECT_ID, "Test")).willReturn(symbol2);

        symbolDAO.create(user, PROJECT_ID, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolCreationGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolRepository.save(symbol)).willThrow(DataIntegrityViolationException.class);

        symbolDAO.create(user, PROJECT_ID, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupCreationGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        ConstraintViolationException constraintViolationException;
        constraintViolationException = new ConstraintViolationException("Project is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException;
        transactionSystemException = new TransactionSystemException("Spring TransactionSystemException",
                rollbackException);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolRepository.save(symbol)).willThrow(transactionSystemException);

        symbolDAO.create(user, PROJECT_ID, symbol); // should fail
    }

    @Test
    public void shouldGetAllRequestedSymbolsByIdRevPairs() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.addOwner(user);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        List<Symbol> symbols = createWebSymbolTestList(project, group);

        List<Long> ids = new ArrayList<>();
        ids.add(symbols.get(0).getId());
        ids.add(symbols.get(2).getId());
        ids.add(symbols.get(3).getId());

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(ids)).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getByIds(user, project.getId(), ids);

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetNoSymbolIfIdRevParisIsEmpty() throws NotFoundException {
        User user = new User();
        Project project = new Project();
        List<Long> ids = Collections.emptyList();

        List<Symbol> symbolsFromDB = symbolDAO.getByIds(user, project.getId(), ids);

        assertEquals(0, symbolsFromDB.size());
    }

    @Test
    public void shouldGetAllVisibleSymbols() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        List<Symbol> symbols = createTestSymbolLists(user, project, group);

        given(symbolRepository.findAllByProject_Id(PROJECT_ID)).willReturn(symbols);

        List<Symbol> symbolsFromDB = symbolDAO.getAll(user, project.getId());

        assertThat(symbolsFromDB.size(), is(equalTo(symbols.size())));
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetTheRightSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.addOwner(user);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setId(SYMBOL_ID);
        symbol.setProject(project);
        symbol.setGroup(group);

        given(symbolRepository.findById(SYMBOL_ID)).willReturn(Optional.of(symbol));
        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));

        Symbol symb2 = symbolDAO.get(user, symbol.getProjectId(), symbol.getId());

        assertEquals(symbol, symb2);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfSymbolNotFound() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

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
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setId(42L);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findById(symbol.getId())).willReturn(Optional.of(symbol));
        given(symbolRepository.save(symbol)).willReturn(symbol);

        symbolDAO.update(user, PROJECT_ID, symbol);

        verify(symbolRepository).save(symbol);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToUpdateASymbolsWithADuplicateNameWithinOneProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
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

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findOneByProject_IdAndName(PROJECT_ID, "Test")).willReturn(symbol2);

        symbolDAO.update(user, PROJECT_ID, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setId(42L);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findById(symbol.getId())).willReturn(Optional.of(symbol));
        given(symbolRepository.save(symbol)).willThrow(DataIntegrityViolationException.class);

        symbolDAO.update(user, PROJECT_ID, symbol); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnGroupUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setId(42L);

        ConstraintViolationException constraintViolationException;
        constraintViolationException = new ConstraintViolationException("Project is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException;
        transactionSystemException = new TransactionSystemException("Spring TransactionSystemException",
                rollbackException);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findById(symbol.getId())).willReturn(Optional.of(symbol));
        given(symbolRepository.save(symbol)).willThrow(transactionSystemException);

        symbolDAO.update(user, PROJECT_ID, symbol); // should fail
    }

    @Test
    public void shouldMoveASymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
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

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(symbolIds)).willReturn(symbols);
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group1));
        given(symbolGroupRepository.findById(GROUP_ID + 1)).willReturn(Optional.of(group2));
        given(symbolRepository.saveAll(symbols)).willReturn(symbols);

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

        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group1));
        given(symbolGroupRepository.findById(GROUP_ID + 1)).willReturn(Optional.of(group2));
        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(symbolIds)).willReturn(symbols);

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

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(symbolIds)).willReturn(symbols);
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolGroupRepository.findById(-1L)).willReturn(Optional.empty());

        doThrow(NotFoundException.class).when(symbolGroupDAO).checkAccess(user, project, null);

        symbolDAO.move(user, PROJECT_ID, symbolIds, -1L); // should fail
    }

    @Test
    public void shouldHideAValidSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setId(42L);

        List<Symbol> symbols = Collections.singletonList(symbol);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(Collections.singletonList(SYMBOL_ID))).willReturn(symbols);
        given(symbolRepository.saveAll(symbols)).willReturn(symbols);

        Symbol archivedSymbol = symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID)).get(0);
        assertTrue(archivedSymbol.isHidden());
    }

    @Test
    public void shouldNotHideAnythingByInvalidID() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        List<Symbol> archivedSymbols = symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(-1L));
        assertTrue(archivedSymbols.isEmpty());
    }

    @Test
    public void shouldShowAValidSymbol() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        given(projectDAO.getByID(user, PROJECT_ID)).willReturn(project);
        given(symbolRepository.findById(SYMBOL_ID)).willReturn(Optional.of(symbol));

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
        List<Symbol> symbols = new ArrayList<>();
        symbols.addAll(createWebSymbolTestList(project, group));
        symbols.addAll(createRESTSymbolTestList(project, group));

        for (int id = 0; id < symbols.size(); id++) {
            Symbol symbol = symbols.get(id);
            long symbolId = (long) id;
            symbol.setId(symbolId);
        }

        return symbols;
    }

    private List<Symbol> createWebSymbolTestList(Project project, SymbolGroup group)
            throws NotFoundException {
        List<Symbol> returnList = new ArrayList<>();
        for (int i = 0; i < SYMBOL_LIST_SIZE; i++) {
            Symbol s = new Symbol();
            s.setProject(project);
            project.getSymbols().add(s);
            s.setId((long) i);
            s.setGroup(group);
            s.setName("Test Symbol - Get All Web No. " + i);
            s.getSteps().add(new SymbolActionStep(new WaitAction()));
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
                s.getSteps().add(new SymbolActionStep(newAction));
                if (i == SYMBOL_LIST_SIZE - 1) {
                    s.setHidden(true);
                }
            }
            returnList.add(s);
        }
        return returnList;
    }

    private List<Symbol> createRESTSymbolTestList(Project project, SymbolGroup group)
            throws NotFoundException {
        List<Symbol> returnList = new ArrayList<>();
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
