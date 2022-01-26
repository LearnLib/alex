/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;

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
import de.learnlib.alex.data.repositories.SymbolPSymbolStepRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionResultRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.RollbackException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

@ExtendWith(MockitoExtension.class)
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
    private SymbolPSymbolStepRepository symbolPSymbolStepRepository;

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

    @Mock
    private TestDAO testDAO;

    @Mock
    private LearnerSetupDAO learnerSetupDAO;

    private SymbolDAO symbolDAO;

    @BeforeEach
    public void setUp() {
        symbolDAO = new SymbolDAO(projectRepository, projectDAO, symbolGroupRepository, symbolRepository,
                symbolActionRepository, symbolGroupDAO, symbolParameterRepository, symbolStepRepository,
                parameterizedSymbolDAO, parameterizedSymbolRepository, symbolPSymbolStepRepository,
                testCaseStepRepository, testExecutionResultRepository, projectEnvironmentRepository,
                objectMapper, symbolParameterDAO, symbolPresenceService, testDAO, learnerSetupDAO);
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

    @Test
    public void shouldFailToCreateASymbolWithADuplicateNameWithinOneSymbolGroup() {
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
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolRepository.findOneByGroup_IdAndName(GROUP_ID, "Test")).willReturn(symbol2);

        assertThrows(ValidationException.class, () -> symbolDAO.create(user, PROJECT_ID, symbol));
    }

    @Test
    public void shouldGetAllRequestedSymbolsByIds() {
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

        assertEquals(symbols.size(), symbolsFromDB.size());
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetNoSymbolIfIdListIsEmpty() {
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

        assertEquals(symbols.size(), symbolsFromDB.size());
        for (Symbol s : symbolsFromDB) {
            assertTrue(symbols.contains(s));
        }
    }

    @Test
    public void shouldGetTheRightSymbol() {
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

    @Test
    public void shouldThrowAnExceptionIfSymbolNotFound() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);

        assertThrows(NotFoundException.class, () -> symbolDAO.get(user, symbol.getProjectId(), -1L));
    }

    @Test
    public void shouldUpdateASymbol() {
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

    @Test
    public void shouldFailToUpdateASymbolsWithADuplicateNameWithinOneProject() {
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
        given(symbolRepository.findOneByGroup_IdAndName(GROUP_ID, "Test")).willReturn(symbol2);

        assertThrows(ValidationException.class, () -> symbolDAO.update(user, PROJECT_ID, symbol));
    }

    @Test
    public void shouldHandleDataIntegrityViolationExceptionOnSymbolUpdateGracefully() {
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

        assertThrows(ValidationException.class, () -> symbolDAO.update(user, PROJECT_ID, symbol));
    }

    @Test
    public void shouldHandleTransactionSystemExceptionOnGroupUpdateGracefully() {
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

        assertThrows(ValidationException.class, () -> symbolDAO.update(user, PROJECT_ID, symbol));
    }

    @Test
    public void shouldMoveASymbol() {
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
        lenient().when(symbolGroupRepository.findById(GROUP_ID)).thenReturn(Optional.of(group1));
        lenient().when(symbolGroupRepository.findById(GROUP_ID + 1)).thenReturn(Optional.of(group2));
        given(symbolRepository.saveAll(symbols)).willReturn(symbols);

        symbolDAO.move(user, PROJECT_ID, SYMBOL_ID, GROUP_ID + 1);

        assertEquals(0, group1.getSymbols().size());
        assertEquals(1, group2.getSymbols().size());
        assertEquals(group2, symbol.getGroup());
    }

    @Test
    public void shouldMoveSymbols() {
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

        lenient().when(symbolGroupRepository.findById(GROUP_ID)).thenReturn(Optional.of(group1));
        lenient().when(symbolGroupRepository.findById(GROUP_ID + 1)).thenReturn(Optional.of(group2));
        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolRepository.findAllByIdIn(symbolIds)).willReturn(symbols);

        symbolDAO.move(user, PROJECT_ID, symbolIds, GROUP_ID + 1);

        assertEquals(0, group1.getSymbols().size());
        assertEquals(symbols.size(), group2.getSymbols().size());
        for (var symbol : symbols) {
            assertEquals(group2, symbol.getGroup());
        }
    }

    @Test
    public void ensureThatAnExceptionIsThrownWhileMovingSymbolsIfTheGroupDoesNotExist() {
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
        lenient().when(symbolGroupRepository.findById(GROUP_ID)).thenReturn(Optional.of(group));
        lenient().when(symbolGroupRepository.findById(-1L)).thenReturn(Optional.empty());

        doThrow(NotFoundException.class).when(symbolGroupDAO).checkAccess(user, project, null);

        assertThrows(NotFoundException.class, () -> symbolDAO.move(user, PROJECT_ID, symbolIds, -1L));
    }

    @Test
    public void shouldHideAValidSymbol() {
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
    public void shouldNotHideAnythingByInvalidID() {
        User user = new User();
        user.setId(USER_ID);

        List<Symbol> archivedSymbols = symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(-1L));
        assertTrue(archivedSymbols.isEmpty());
    }

    @Test
    public void shouldShowAValidSymbol() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setId(SYMBOL_ID);

        given(projectDAO.getByID(user, PROJECT_ID)).willReturn(project);
        given(symbolRepository.findById(SYMBOL_ID)).willReturn(Optional.of(symbol));

        symbolDAO.hide(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID));
        symbolDAO.show(user, PROJECT_ID, Collections.singletonList(SYMBOL_ID));

        assertFalse(symbol.isHidden());
    }

    @Test
    public void shouldNotShowAnythingByInvalidID() {
        User user = new User();
        user.setId(USER_ID);
        assertThrows(NotFoundException.class, () -> symbolDAO.show(user, PROJECT_ID, Collections.singletonList(-1L)));
    }

    private List<Symbol> createTestSymbolLists(User user, Project project, SymbolGroup group) {
        List<Symbol> symbols = new ArrayList<>();
        symbols.addAll(createWebSymbolTestList(project, group));
        symbols.addAll(createRESTSymbolTestList(project, group));

        for (int id = 0; id < symbols.size(); id++) {
            Symbol symbol = symbols.get(id);
            long symbolId = id;
            symbol.setId(symbolId);
        }

        return symbols;
    }

    private List<Symbol> createWebSymbolTestList(Project project, SymbolGroup group) {
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

    private List<Symbol> createRESTSymbolTestList(Project project, SymbolGroup group) {
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
