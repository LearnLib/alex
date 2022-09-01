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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.EntityLockedException;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolPSymbolStep;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.entities.actions.misc.CreateLabelAction;
import de.learnlib.alex.data.entities.actions.misc.JumpToLabelAction;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.web.GotoAction;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolPSymbolStepRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.data.utils.SymbolOutputMappingUtils;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionResultRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import net.automatalib.graphs.base.compact.CompactSimpleGraph;
import net.automatalib.util.graphs.scc.SCCs;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Implementation of a SymbolDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class SymbolDAO {

    /** The format for archived symbols. */
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd-HH:mm:ss");

    private static final Logger logger = LoggerFactory.getLogger(SymbolDAO.class);

    private final ProjectRepository projectRepository;
    private final ProjectDAO projectDAO;
    private final SymbolGroupDAO symbolGroupDAO;
    private final SymbolGroupRepository symbolGroupRepository;
    private final SymbolRepository symbolRepository;
    private final SymbolActionRepository symbolActionRepository;
    private final SymbolParameterRepository symbolParameterRepository;
    private final SymbolStepRepository symbolStepRepository;
    private final ParameterizedSymbolDAO parameterizedSymbolDAO;
    private final SymbolPSymbolStepRepository symbolPSymbolStepRepository;
    private final ParameterizedSymbolRepository parameterizedSymbolRepository;
    private final TestCaseStepRepository testCaseStepRepository;
    private final TestExecutionResultRepository testExecutionResultRepository;
    private final ProjectEnvironmentRepository projectEnvironmentRepository;
    private final ObjectMapper objectMapper;
    private final SymbolParameterDAO symbolParameterDAO;
    private final SymbolPresenceService symbolPresenceService;
    private final TestDAO testDAO;
    private final LearnerSetupDAO learnerSetupDAO;

    @Autowired
    public SymbolDAO(ProjectRepository projectRepository, ProjectDAO projectDAO,
                     SymbolGroupRepository symbolGroupRepository, SymbolRepository symbolRepository,
                     SymbolActionRepository symbolActionRepository, SymbolGroupDAO symbolGroupDAO,
                     SymbolParameterRepository symbolParameterRepository, SymbolStepRepository symbolStepRepository,
                     ParameterizedSymbolDAO parameterizedSymbolDAO,
                     ParameterizedSymbolRepository parameterizedSymbolRepository,
                     SymbolPSymbolStepRepository symbolPSymbolStepRepository,
                     TestCaseStepRepository testCaseStepRepository,
                     TestExecutionResultRepository testExecutionResultRepository,
                     ProjectEnvironmentRepository projectEnvironmentRepository,
                     ObjectMapper objectMapper,
                     @Lazy SymbolParameterDAO symbolParameterDAO,
                     @Lazy SymbolPresenceService symbolPresenceService,
                     @Lazy TestDAO testDAO,
                     @Lazy LearnerSetupDAO learnerSetupDAO) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;
        this.symbolActionRepository = symbolActionRepository;
        this.symbolGroupDAO = symbolGroupDAO;
        this.symbolParameterRepository = symbolParameterRepository;
        this.symbolStepRepository = symbolStepRepository;
        this.parameterizedSymbolDAO = parameterizedSymbolDAO;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolPSymbolStepRepository = symbolPSymbolStepRepository;
        this.testCaseStepRepository = testCaseStepRepository;
        this.testExecutionResultRepository = testExecutionResultRepository;
        this.projectEnvironmentRepository = projectEnvironmentRepository;
        this.objectMapper = objectMapper;
        this.symbolParameterDAO = symbolParameterDAO;
        this.symbolPresenceService = symbolPresenceService;
        this.testDAO = testDAO;
        this.learnerSetupDAO = learnerSetupDAO;
    }

    public List<Symbol> importSymbols(
            User user,
            Project project,
            List<Symbol> symbols,
            Map<Long, Long> newSymbolIdToOldSymbolId
    ) {
        final List<Symbol> importedSymbols = new ArrayList<>();

        for (Symbol symbol : symbols) {
            var oldId = symbol.getId();
            symbol.setId(null);

            var createdSymbol = create(user, project.getId(), symbol);
            importedSymbols.add(createdSymbol);

            newSymbolIdToOldSymbolId.put(createdSymbol.getId(), oldId);
        }

        importedSymbols.forEach(SymbolDAO::loadLazyRelations);
        return importedSymbols;
    }

    public Symbol create(User user, Long projectId, Symbol symbol) {
        try {
            final Symbol createdSymbol = createOne(user, projectId, symbol);
            final Map<Long, List<SymbolStep>> symbolStepMap = new HashMap<>();
            symbolStepMap.put(createdSymbol.getId(), symbol.getSteps());
            saveSymbolSteps(projectId, Collections.singletonList(createdSymbol), symbolStepMap);
            return createdSymbol;
        } catch (Exception e) {
            logger.info("Symbol creation failed:", e);
            throw e;
        }
    }

    public List<Symbol> create(User user, Long projectId, List<Symbol> symbols) {
        try {
            final List<Symbol> createdSymbols = new ArrayList<>();
            final Map<Long, List<SymbolStep>> symbolStepMap = new HashMap<>();
            for (Symbol symbol : symbols) {
                final Symbol createdSymbol = createOne(user, projectId, symbol);
                createdSymbols.add(createdSymbol);
                symbolStepMap.put(createdSymbol.getId(), symbol.getSteps());
            }

            saveSymbolSteps(projectId, createdSymbols, symbolStepMap);
            return createdSymbols;
        } catch (Exception e) {
            logger.info("Symbols creation failed:", e);
            throw e;
        }
    }

    private Symbol createOne(User user, Long projectId, Symbol symbol) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        symbol.setProject(project);


        final SymbolGroup group;
        if (symbol.getGroup() == null || symbol.getGroup().getId() == null) {
            group = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(projectId); // default group
        } else {
            group = symbolGroupRepository.findById(symbol.getGroup().getId()).orElse(null);
            symbolGroupDAO.checkAccess(user, project, group);
        }

        // make sure the name of the symbol is unique within its group
        if (symbolRepository.findOneByGroup_IdAndName(group.getId(), symbol.getName()) != null) {
            throw new ValidationException("To create a symbol its name must be unique within its group.");
        }

        // create default symbols
        final Symbol symbolToCreate = new Symbol();
        symbolToCreate.setName(symbol.getName());
        symbolToCreate.setProject(project);
        symbolToCreate.setGroup(group);
        symbolToCreate.setDescription(symbol.getDescription());
        symbolToCreate.setExpectedResult(symbol.getExpectedResult());
        symbolToCreate.setHidden(symbol.isHidden());
        symbolToCreate.setSuccessOutput(symbol.getSuccessOutput());
        symbolToCreate.setLastUpdatedBy(user);
        group.getSymbols().add(symbolToCreate);
        project.getSymbols().add(symbolToCreate);

        // update related references
        Symbol createdSymbol = symbolRepository.save(symbolToCreate);
        symbolGroupRepository.save(group);
        projectRepository.save(project);

        // save input and output parameters
        createdSymbol.setInputs(symbol.getInputs());
        createdSymbol.setOutputs(symbol.getOutputs());
        createdSymbol.getInputs().forEach(input -> input.setSymbol(createdSymbol));
        createdSymbol.getOutputs().forEach(output -> output.setSymbol(createdSymbol));
        symbolParameterRepository.saveAll(createdSymbol.getInputs());
        symbolParameterRepository.saveAll(createdSymbol.getOutputs());

        return createdSymbol;
    }

    public void saveSymbolSteps(
            Long projectId,
            List<Symbol> createdSymbols,
            Map<Long, List<SymbolStep>> symbolStepMap
    ) {
        final List<Symbol> allSymbols = symbolRepository.findAllByProject_Id(projectId);
        final Map<Long, Symbol> symbolMap = new HashMap<>();
        allSymbols.forEach(symbol -> symbolMap.put(symbol.getId(), symbol));

        for (Symbol createdSymbol : createdSymbols) {
            createdSymbol.setSteps(symbolStepMap.get(createdSymbol.getId()));
            checkLabelsConsistency(createdSymbol);

            for (int i = 0; i < createdSymbol.getSteps().size(); i++) {
                final SymbolStep step = createdSymbol.getSteps().get(i);
                step.setPosition(i);
                step.setSymbol(createdSymbol);

                if (step instanceof SymbolActionStep) {
                    final SymbolActionStep actionStep = (SymbolActionStep) step;
                    actionStep.getAction().setSymbol(createdSymbol);
                    checkIfBaseUrlExists(projectId, actionStep.getAction());
                    symbolActionRepository.save(actionStep.getAction());
                } else if (step instanceof SymbolPSymbolStep) {
                    // first, set the reference to the corresponding symbol
                    final SymbolPSymbolStep symbolStep = (SymbolPSymbolStep) step;
                    final long symbolId = symbolStep.getPSymbol().getSymbol().getId();
                    final Symbol symbol = symbolMap.get(symbolId);
                    if (symbol == null) {
                        throw new NotFoundException("The symbol with the id " + symbolId + " does not exist.");
                    }
                    symbolStep.getPSymbol().setSymbol(symbol);

                    // then, set the referenced symbol parameters
                    final Map<String, SymbolParameter> parameterMap = new HashMap<>();
                    symbol.getInputs().forEach(input -> parameterMap.put(input.getName(), input));
                    symbolStep.getPSymbol().getParameterValues().forEach(pv -> {
                        pv.setParameter(parameterMap.get(pv.getParameter().getName()));
                    });

                    // finally, save the parameterized symbol
                    parameterizedSymbolDAO.create(symbolStep.getPSymbol());
                }
            }

            symbolStepRepository.saveAll(createdSymbol.getSteps());
        }
    }

    private void checkIfBaseUrlExists(Long projectId, SymbolAction action) {
        final String baseUrl;
        if (action instanceof CallAction) {
            baseUrl = ((CallAction) action).getBaseUrl();
        } else if (action instanceof GotoAction) {
            baseUrl = ((GotoAction) action).getBaseUrl();
        } else {
            return;
        }

        if (baseUrl == null || baseUrl.trim().equals("")) {
            throw new ValidationException("The base URL may not be empty.");
        }

        final ProjectEnvironment env = projectEnvironmentRepository.findAllByProject_Id(projectId).get(0);
        if (env.getUrls().stream().noneMatch(u -> u.getName().equals(baseUrl))) {
            throw new ValidationException("The URL '" + baseUrl + "' does not exist within the project.");
        }
    }

    public List<Symbol> getByIds(User user, Long projectId, List<Long> ids) {
        final Project project = projectRepository.findById(projectId).orElse(null);

        // get the symbols
        final List<Symbol> symbols = symbolRepository.findAllByIdIn(ids);
        for (Symbol symbol : symbols) {
            checkAccess(user, project, symbol);
        }

        // load the lazy relations
        symbols.forEach(SymbolDAO::loadLazyRelations);
        return symbols;
    }

    public List<Symbol> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<Symbol> symbols = symbolRepository.findAllByProject_Id(projectId);
        symbols.forEach(SymbolDAO::loadLazyRelations);
        return symbols;
    }

    public List<Symbol> getAll(User user, Long projectId, boolean hidden) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        return symbolRepository.findAllByProject_IdAndHidden(projectId, hidden).stream()
                .peek(SymbolDAO::loadLazyRelations)
                .toList();
    }

    public Symbol get(User user, Long projectId, Long id) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        return get(user, project, id);
    }

    public Symbol get(User user, Project project, Long symbolId) {
        final Symbol symbol = symbolRepository.findById(symbolId).orElse(null);
        checkAccess(user, project, symbol);
        loadLazyRelations(symbol);
        return symbol;
    }

    public Symbol update(User user, Long projectId, Symbol symbol) {
        try {
            return doUpdate(user, projectId, symbol);
        } catch (TransactionSystemException | DataIntegrityViolationException e) {
            logger.info("Symbol update failed:", e);
            throw new ValidationException("Symbol could not be updated.", e);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not update the symbol because it is not valid.", e);
        }
    }

    public List<Symbol> update(User user, Long projectId, List<Symbol> symbols) {
        try {
            final List<Symbol> updatedSymbols = new ArrayList<>();
            for (Symbol symbol : symbols) {
                updatedSymbols.add(doUpdate(user, projectId, symbol));
            }
            return updatedSymbols;
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not update the Symbols because one is not valid.", e);
        } catch (NotFoundException e) {
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    private void checkLabelsConsistency(Symbol symbol) {
        final List<String> labels = symbol.getSteps().stream()
                .filter(s -> s instanceof SymbolActionStep)
                .map(s -> ((SymbolActionStep) s).getAction())
                .filter(a -> a instanceof CreateLabelAction)
                .map(a -> ((CreateLabelAction) a).getLabel())
                .collect(Collectors.toList());

        if (labels.size() != new HashSet<>(labels).size()) {
            throw new ValidationException("The labels are not unique.");
        }

        final List<String> labelsToJumpTo = symbol.getSteps().stream()
                .filter(s -> s instanceof SymbolActionStep)
                .map(s -> ((SymbolActionStep) s).getAction())
                .filter(a -> a instanceof JumpToLabelAction)
                .map(a -> ((JumpToLabelAction) a).getLabel())
                .collect(Collectors.toList());

        for (String label : labelsToJumpTo) {
            if (!labels.contains(label)) {
                throw new ValidationException("Label " + label + " has not been created.");
            }
        }
    }

    private void checkIfOutputMappingNamesAreUnique(Symbol symbol) {
        final ArrayList<SymbolOutputMapping> oms = new ArrayList<>();
        symbol.getSteps().stream()
                .filter(s -> s instanceof SymbolPSymbolStep)
                .forEach(s -> oms.addAll(((SymbolPSymbolStep) s).getPSymbol().getOutputMappings()));

        SymbolOutputMappingUtils.checkIfMappedNamesAreUnique(oms);
    }

    private Symbol doUpdate(User user, Long projectId, Symbol symbol) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project, symbol);
        checkRunningProcesses(user, project, symbol);

        // check lock status
        this.symbolPresenceService.checkSymbolLockStatus(projectId, symbol.getId(), user.getId());

        // make sure the name of the symbol is unique within its group
        final Symbol symbolWithSameName = symbolRepository.findOneByGroup_IdAndName(symbol.getGroupId(), symbol.getName());
        if (symbolWithSameName != null && !symbolWithSameName.getId().equals(symbol.getId())) {
            throw new ValidationException("To update a symbol its name must be unique within its group.");
        }

        checkLabelsConsistency(symbol);
        checkIfOutputMappingNamesAreUnique(symbol);

        // update meta info
        Symbol symbolInDb = symbolRepository.findById(symbol.getId()).orElse(null);
        symbolInDb.setName(symbol.getName());
        symbolInDb.setDescription(symbol.getDescription());
        symbolInDb.setExpectedResult(symbol.getExpectedResult());
        symbolInDb.setUpdatedOn(ZonedDateTime.now());
        symbolInDb.setLastUpdatedBy(user);
        symbolInDb.setSuccessOutput(symbol.getSuccessOutput());

        // update steps
        if (symbol.getSteps().isEmpty()) {
            symbolActionRepository.deleteAllBySymbol_Id(symbol.getId());
            symbolStepRepository.deleteAllBySymbol_Id(symbol.getId());
            symbolInDb.getSteps().clear();
            symbolStepRepository.deleteAllBySymbol_Id(symbolInDb.getId());
        } else {
            final List<Long> idsOfStepsToKeep = symbol.getSteps().stream()
                    .filter(s -> s.getId() != null)
                    .map(SymbolStep::getId)
                    .collect(Collectors.toList());

            if (idsOfStepsToKeep.isEmpty()) {
                symbolStepRepository.deleteAllBySymbol_Id(symbolInDb.getId());
            } else {
                symbolStepRepository.deleteAllBySymbol_IdAndIdNotIn(symbolInDb.getId(), idsOfStepsToKeep);
            }

            symbolInDb.setSteps(symbol.getSteps());

            // update references, save action and parameterized symbols
            for (int i = 0; i < symbolInDb.getSteps().size(); i++) {
                final SymbolStep step = symbolInDb.getSteps().get(i);
                step.setPosition(i);
                step.setSymbol(symbolInDb);
                if (step instanceof SymbolActionStep) {
                    final SymbolActionStep actionStep = ((SymbolActionStep) step);
                    actionStep.getAction().setSymbol(symbolInDb);
                    symbolActionRepository.save(actionStep.getAction());
                } else if (step instanceof SymbolPSymbolStep) {
                    final SymbolPSymbolStep symbolStep = (SymbolPSymbolStep) step;
                    symbolStep.setPSymbol(parameterizedSymbolDAO.create(symbolStep.getPSymbol()));
                }
            }
            symbolStepRepository.saveAll(symbolInDb.getSteps());
        }

        beforeSymbolSave(symbolInDb);
        symbolInDb = symbolRepository.save(symbolInDb);
        checkForCycles(symbolInDb);

        return symbolInDb;
    }

    public Symbol move(User user, Long projectId, Long symbolId, Long newGroupId) {
        return move(user, projectId, Collections.singletonList(symbolId), newGroupId).get(0);
    }

    public List<Symbol> move(User user, Long projectId, List<Long> symbolIds, Long newGroupId) {

        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<Symbol> symbols = symbolRepository.findAllByIdIn(symbolIds);
        for (Symbol symbol : symbols) {
            checkAccess(user, project, symbol);

            // check symbol lock status
            this.symbolPresenceService.checkSymbolLockStatusStrict(projectId, symbol.getId(), user.getId());

            // make sure the name of the symbol is unique within the new group
            if (symbolRepository.findOneByGroup_IdAndName(newGroupId, symbol.getName()) != null) {
                throw new ValidationException("At least one symbols name is already present in the target group.");
            }
        }

        for (Symbol symbol : symbols) {
            final SymbolGroup oldGroup = symbolGroupRepository.findById(symbol.getGroupId()).orElse(null);
            final SymbolGroup newGroup = symbolGroupRepository.findById(newGroupId).orElse(null);
            symbolGroupDAO.checkAccess(user, project, newGroup);

            if (!newGroup.equals(oldGroup)) {
                oldGroup.getSymbols().remove(symbol);
                newGroup.addSymbol(symbol);

                symbolGroupRepository.save(oldGroup);
                symbolGroupRepository.save(newGroup);
            }
        }

        final List<Symbol> movedSymbols = symbolRepository.saveAll(symbols);
        movedSymbols.forEach(SymbolDAO::loadLazyRelations);
        return movedSymbols;
    }

    private void checkForCycles(Symbol symbol) {
        // is there a circular dependency between symbol steps?
        if (symbol.getSteps().stream()
                .filter(s -> s instanceof SymbolPSymbolStep)
                .collect(Collectors.toList()).size() > 0) {
            final List<Symbol> allSymbols = symbolRepository.findAllByProject_Id(symbol.getProject().getId());
            if (containsCycles(allSymbols)) {
                throw new ValidationException("Circular dependency found.");
            }
        }
    }

    private boolean containsCycles(List<Symbol> symbols) {
        final Map<Long, Integer> map = new HashMap<>();

        final CompactSimpleGraph<Void> graph = new CompactSimpleGraph<>();
        symbols.forEach(symbol -> {
            final int state = graph.addNode();
            map.put(symbol.getId(), state);
        });

        for (final Symbol symbol : symbols) {
            for (final SymbolStep step : symbol.getSteps()) {
                if (step instanceof SymbolPSymbolStep) {
                    final SymbolPSymbolStep symbolStep = (SymbolPSymbolStep) step;
                    final Symbol target = symbolStep.getPSymbol().getSymbol();
                    graph.connect(map.get(symbol.getId()), map.get(target.getId()));

                    // fail fast if a symbol references itself
                    if (symbol.getId().equals(target.getId())) {
                        return true;
                    }
                }
            }
        }

        final Set<Set<Integer>> computedSCCs =
                SCCs.collectSCCs(graph).stream().map(HashSet::new).collect(Collectors.toSet());

        return computedSCCs.stream()
                .filter(s -> s.size() > 1)
                .collect(Collectors.toSet())
                .size() > 0; // remove single component SCC
    }

    public List<Symbol> hide(User user, Long projectId, List<Long> ids) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<Symbol> symbols = symbolRepository.findAllByIdIn(ids);
        for (Symbol symbol : symbols) {
            checkAccess(user, project, symbol);
            checkRunningProcesses(user, project, symbol);

            // check symbol lock status
            this.symbolPresenceService.checkSymbolLockStatus(projectId, symbol.getId(), user.getId());
        }

        for (Symbol symbol : symbols) {
            symbol.setHidden(true);

            // rename the symbol so that there can be another new symbol with the name
            final Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            symbol.setName(symbol.getName() + "--" + DATE_FORMAT.format(timestamp));
        }

        final List<Symbol> archivedSymbols = symbolRepository.saveAll(symbols);
        archivedSymbols.forEach(SymbolDAO::loadLazyRelations);
        return archivedSymbols;
    }

    public void show(User user, Long projectId, List<Long> ids) {
        Project project = projectDAO.getByID(user, projectId); // access check

        // get symbols
        List<Symbol> symbols = ids.stream().map(id -> this.get(user, project, id)).collect(Collectors.toList());

        // check symbol lock status
        symbols.forEach(symbol -> {
            this.symbolPresenceService.checkSymbolLockStatus(projectId, symbol.getId(), user.getId());
            checkRunningProcesses(user, project, symbol);
        });

        symbols.forEach(symbol -> {
            symbol.setHidden(false);
            symbolRepository.save(symbol);
        });
    }

    public void delete(User user, Long projectId, Long symbolId) {
        final Symbol symbol = get(user, projectId, symbolId);

        // check symbol lock status
        this.symbolPresenceService.checkSymbolLockStatusStrict(projectId, symbolId, user.getId());

        if (!symbol.isHidden()) {
            throw new ValidationException("Symbol has to be archived first.");
        }

        long r1 = parameterizedSymbolRepository.countAllBySymbol_Id(symbolId);
        long r2 = symbolPSymbolStepRepository.countAllBypSymbol_Symbol_Id(symbolId);
        long r3 = testCaseStepRepository.countAllBypSymbol_Symbol_Id(symbolId);
        long r4 = testExecutionResultRepository.countAllBySymbol_Id(symbolId);

        long refCount = r1 + r2 + r3 + r4;
        if (refCount > 0) {
            throw new ValidationException("There are " + refCount + " references to this symbol.");
        } else {
            symbolActionRepository.deleteAllBySymbol_Id(symbolId);
            parameterizedSymbolRepository.deleteAll(symbol.getSteps().stream()
                    .filter(s -> s instanceof SymbolPSymbolStep)
                    .map(s -> ((SymbolPSymbolStep) s).getPSymbol())
                    .collect(Collectors.toList()));
            symbolRepository.deleteById(symbolId);
        }
    }

    public void delete(User user, Long projectId, List<Long> symbolIds) {
        for (Long id : symbolIds) {
            delete(user, projectId, id);
        }
    }

    /**
     * Sets references to related entities to all actions of a symbol.
     *
     * @param symbol
     *         The symbol.
     */
    public static void beforeSymbolSave(Symbol symbol) {
        symbol.getInputs().forEach(i -> i.setSymbol(symbol));
        symbol.getOutputs().forEach(o -> o.setSymbol(symbol));
    }

    public void checkRunningProcesses(User user, Project project, Symbol symbol) {
        if (this.getActiveSymbols(user, project).stream().anyMatch(s -> s.getId().equals(symbol.getId()))) {
            throw new EntityLockedException("The symbol is currently used in the active test or learning process.");
        }
    }

    public Set<Symbol> getActiveSymbols(User user, Project project) {
        Set<Symbol> result = new HashSet<>();

        // check running tests, ignore testSuites
        this.testDAO.getActiveTests(user, project).stream()
                .filter(t -> t instanceof TestCase)
                .flatMap(t -> Stream.of(
                        ((TestCase) t).getPreSteps(),
                        ((TestCase) t).getSteps(),
                        ((TestCase) t).getPostSteps()))
                .flatMap(List::stream)
                .map(TestCaseStep::getPSymbol)
                .filter(Objects::nonNull)
                .map(ParameterizedSymbol::getSymbol)
                .forEach(result::add);

        // check running learning processes
        this.learnerSetupDAO.getActiveLearnerSetups(user, project.getId()).forEach(learnerSetup -> {
            List<ParameterizedSymbol> postSymbolSingletonList = Optional.ofNullable(learnerSetup.getPostSymbol())
                    .map(List::of)
                    .orElse(Collections.emptyList());

            Stream.of(List.of(learnerSetup.getPreSymbol()), postSymbolSingletonList, learnerSetup.getSymbols())
                    .flatMap(List::stream)
                    .map(ParameterizedSymbol::getSymbol)
                    .forEach(result::add);
        });

        return result;
    }

    /**
     * Use Hibernate to populate all fields of a Symbol, including all references to other entities.
     *
     * @param symbol
     *         The Symbol to populate.
     */
    public static void loadLazyRelations(Symbol symbol) {
        Hibernate.initialize(symbol.getProject());
        Hibernate.initialize(symbol.getProject().getEnvironments());
        Hibernate.initialize(symbol.getGroup());
        Hibernate.initialize(symbol.getInputs());
        Hibernate.initialize(symbol.getOutputs());
        Hibernate.initialize(symbol.getSteps());
        symbol.getSteps().forEach(step -> {
            if (step instanceof SymbolPSymbolStep) {
                ParameterizedSymbolDAO.loadLazyRelations(((SymbolPSymbolStep) step).getPSymbol());
            }
        });
    }

    public void checkAccess(User user, Project project, Symbol symbol) {
        projectDAO.checkAccess(user, project);

        if (symbol == null) {
            throw new NotFoundException("The symbol does not exist.");
        }

        if (!symbol.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the symbol.");
        }
    }
}
