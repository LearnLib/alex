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
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolPSymbolStep;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.entities.actions.misc.CreateLabelAction;
import de.learnlib.alex.data.entities.actions.misc.JumpToLabelAction;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.web.GotoAction;
import de.learnlib.alex.data.entities.export.SymbolImportConflictResolutionStrategy;
import de.learnlib.alex.data.entities.export.SymbolsImportableEntity;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.data.repositories.SymbolSymbolStepRepository;
import de.learnlib.alex.data.utils.SymbolOutputMappingUtils;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionResultRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import net.automatalib.graphs.base.compact.CompactSimpleGraph;
import net.automatalib.util.graphs.scc.SCCs;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of a SymbolDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class SymbolDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The format for archived symbols. */
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd-HH:mm:ss");

    private final ProjectRepository projectRepository;
    private final ProjectDAO projectDAO;
    private final SymbolGroupDAO symbolGroupDAO;
    private final SymbolGroupRepository symbolGroupRepository;
    private final SymbolRepository symbolRepository;
    private final SymbolActionRepository symbolActionRepository;
    private final SymbolParameterRepository symbolParameterRepository;
    private final SymbolStepRepository symbolStepRepository;
    private final ParameterizedSymbolDAO parameterizedSymbolDAO;
    private final SymbolSymbolStepRepository symbolSymbolStepRepository;
    private final ParameterizedSymbolRepository parameterizedSymbolRepository;
    private final TestCaseStepRepository testCaseStepRepository;
    private final TestExecutionResultRepository testExecutionResultRepository;
    private final ProjectEnvironmentRepository projectEnvironmentRepository;
    private final ObjectMapper objectMapper;
    private final SymbolParameterDAO symbolParameterDAO;
    private final SymbolPresenceService symbolPresenceService;

    @Autowired
    public SymbolDAO(ProjectRepository projectRepository, ProjectDAO projectDAO,
                     SymbolGroupRepository symbolGroupRepository, SymbolRepository symbolRepository,
                     SymbolActionRepository symbolActionRepository, SymbolGroupDAO symbolGroupDAO,
                     SymbolParameterRepository symbolParameterRepository, SymbolStepRepository symbolStepRepository,
                     ParameterizedSymbolDAO parameterizedSymbolDAO,
                     ParameterizedSymbolRepository parameterizedSymbolRepository,
                     SymbolSymbolStepRepository symbolSymbolStepRepository,
                     TestCaseStepRepository testCaseStepRepository,
                     TestExecutionResultRepository testExecutionResultRepository,
                     ProjectEnvironmentRepository projectEnvironmentRepository,
                     ObjectMapper objectMapper,
                     @Lazy SymbolParameterDAO symbolParameterDAO,
                     @Lazy SymbolPresenceService symbolPresenceService) {
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
        this.symbolSymbolStepRepository = symbolSymbolStepRepository;
        this.testCaseStepRepository = testCaseStepRepository;
        this.testExecutionResultRepository = testExecutionResultRepository;
        this.projectEnvironmentRepository = projectEnvironmentRepository;
        this.objectMapper = objectMapper;
        this.symbolParameterDAO = symbolParameterDAO;
        this.symbolPresenceService = symbolPresenceService;
    }

    public List<Symbol> importSymbols(User user, Project project, List<Symbol> symbols, Map<String, SymbolImportConflictResolutionStrategy> conflictResolutions) {
        final List<Symbol> importedSymbols = new ArrayList<>();

        for (Symbol symbol: symbols) {
            if (!symbolExistsInProject(project, symbol)) {
                importedSymbols.add(create(user, project.getId(), symbol));
            } else {
                if (!conflictResolutions.containsKey(symbol.getName())) {
                    throw new ValidationException("Symbol " + symbol.getName() + " exists but no conflict resolution strategy is specified.");
                }

                switch (conflictResolutions.get(symbol.getName())) {
                    case KEEP_NEW:
                        importedSymbols.add(mergeSymbolWithExisting(user, project, symbol));
                        break;
                    case KEEP_BOTH:
                        importedSymbols.add(renameAndCreateSymbol(user, project, symbol));
                        break;
                    case KEEP_EXISTING:
                        // do nothing
                        continue;
                    default:
                        throw new ValidationException("Invalid conflict resolution strategy.");
                }
            }
        }

        importedSymbols.forEach(SymbolDAO::loadLazyRelations);
        return importedSymbols;
    }

    public Symbol create(User user, Long projectId, Symbol symbol) {
        LOGGER.traceEntry("create({})", symbol);
        try {
            final Symbol createdSymbol = createOne(user, projectId, symbol);
            final Map<Long, List<SymbolStep>> symbolStepMap = new HashMap<>();
            symbolStepMap.put(createdSymbol.getId(), symbol.getSteps());
            saveSymbolSteps(projectId, Collections.singletonList(createdSymbol), symbolStepMap);
            return createdSymbol;
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol creation failed:", e);
            throw new ValidationException("Symbol could not be created.", e);
        } catch (TransactionSystemException | org.hibernate.exception.ConstraintViolationException | javax.validation.ConstraintViolationException e) {
            throw new ValidationException("Symbol could not be created created: ", e);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        } finally {
            LOGGER.traceExit(symbol);
        }
    }

    public List<Symbol> importSymbols(User user, Long projectId, SymbolsImportableEntity symbolsImportableEntity) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        try {
            final Map<String, SymbolImportConflictResolutionStrategy> conflictResolutions = symbolsImportableEntity.getConflictResolutions();
            final Symbol[] symbols = objectMapper.readValue(symbolsImportableEntity.getSymbols().toString(), Symbol[].class);
            return importSymbols(user, project, Arrays.asList(symbols), conflictResolutions);
        } catch (IOException e) {
            throw new ValidationException("Failed to parse input data.");
        }
    }

    private Symbol mergeSymbolWithExisting(User user, Project project, Symbol symbol) {
        final Symbol symbolInDb = symbolRepository.findOneByProject_IdAndName(project.getId(), symbol.getName());
        symbol.setId(symbolInDb.getId());
        symbol.setProject(symbolInDb.getProject());
        final Symbol updatedSymbol = update(user, project.getId(), symbol);

        // delete removed inputs
        for (SymbolInputParameter input: updatedSymbol.getInputs()) {
            if (symbol.findInputByNameAndType(input.getName(), input.getParameterType()) == null) {
                symbolParameterDAO.delete(user, project.getId(), updatedSymbol.getId(), input.getId());
            }
        }

        // delete removed outputs
        for (SymbolOutputParameter output: updatedSymbol.getOutputs()) {
            if (symbol.findOutputByNameAndType(output.getName(), output.getParameterType()) == null) {
                symbolParameterDAO.delete(user, project.getId(), updatedSymbol.getId(), output.getId());
            }
        }

        // add new inputs
        for (SymbolInputParameter input: symbol.getInputs()) {
            if (updatedSymbol.findInputByNameAndType(input.getName(), input.getParameterType()) == null) {
                symbolParameterDAO.create(user, project.getId(), updatedSymbol.getId(), input);
            }
        }

        // add new outputs
        for (SymbolOutputParameter output: symbol.getOutputs()) {
            if (updatedSymbol.findOutputByNameAndType(output.getName(), output.getParameterType()) == null) {
                symbolParameterDAO.create(user, project.getId(), updatedSymbol.getId(), output);
            }
        }

        return symbolRepository.findById(updatedSymbol.getId()).orElse(null);
    }

    private Symbol renameAndCreateSymbol(User user, Project project, Symbol symbol) {
        int i = 1;
        String name = symbol.getName();
        while (symbolRepository.findOneByProject_IdAndName(project.getId(), name) != null) {
            name = symbol.getName() + " (" + i + ")";
            i++;
        }

        symbol.setName(name);
        symbol.setProject(project);
        return create(user, project.getId(), symbol);
    }

    private boolean symbolExistsInProject(Project project, Symbol symbol) {
        return symbolRepository.findOneByProject_IdAndName(project.getId(), symbol.getName()) != null;
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
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbols creation failed:", e);
            throw new ValidationException("Symbols could not be created.", e);
        } catch (javax.validation.ConstraintViolationException | org.hibernate.exception.ConstraintViolationException e) {
            throw new ValidationException("Symbols were not created: ", e);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not create symbols because at least one was invalid.", e);
        }
    }

    private Symbol createOne(User user, Long projectId, Symbol symbol) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        symbol.setProject(project);

        // make sure the name of the symbol is unique
        if (symbolRepository.findOneByProject_IdAndName(projectId, symbol.getName()) != null) {
            throw new ValidationException("To create a symbol its name must be unique.");
        }

        final SymbolGroup group;
        if (symbol.getGroup() == null || symbol.getGroup().getId() == null) {
            group = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(projectId); // default group
        } else {
            group = symbolGroupRepository.findById(symbol.getGroup().getId()).orElse(null);
            symbolGroupDAO.checkAccess(user, project, group);
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
        symbolToCreate.setlastUpdatedBy(user);
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

    public void saveSymbolSteps(Long projectId, List<Symbol> createdSymbols, Map<Long, List<SymbolStep>> symbolStepMap) {
        final List<Symbol> allSymbols = symbolRepository.findAllByProject_Id(projectId);
        final Map<String, Symbol> symbolMap = new HashMap<>();
        allSymbols.forEach(symbol -> symbolMap.put(symbol.getName(), symbol));

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
                    final String symbolname = symbolStep.getPSymbol().getSymbol().getName();
                    final Symbol symbol = symbolMap.get(symbolname);
                    if (symbol == null) {
                        throw new NotFoundException("The symbol with the name " + symbolname + " does not exist.");
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
            LOGGER.info("Symbol update failed:", e);
            throw new ValidationException("Symbol could not be updated.", e);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not update the symbol because it is not valid.", e);
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

        for (String label: labelsToJumpTo) {
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

    private Symbol doUpdate(User user, Long projectId, Symbol symbol) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project, symbol);

        // check lock status
        this.symbolPresenceService.checkSymbolLockStatus(projectId, symbol.getId(), user.getId());

        // make sure the name of the symbol is unique
        final Symbol symbolWithSameName = symbolRepository.findOneByProject_IdAndName(projectId, symbol.getName());
        if (symbolWithSameName != null && !symbolWithSameName.getId().equals(symbol.getId())) {
            throw new ValidationException("To update a symbol its name must be unique.");
        }

        checkLabelsConsistency(symbol);
        checkIfOutputMappingNamesAreUnique(symbol);

        // update meta info
        Symbol symbolInDb = symbolRepository.findById(symbol.getId()).orElse(null);
        symbolInDb.setName(symbol.getName());
        symbolInDb.setDescription(symbol.getDescription());
        symbolInDb.setExpectedResult(symbol.getExpectedResult());
        symbolInDb.setUpdatedOn(ZonedDateTime.now());
        symbolInDb.setlastUpdatedBy(user);
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
        final Map<String, Integer> map = new HashMap<>();

        final CompactSimpleGraph<Void> graph = new CompactSimpleGraph<>();
        symbols.forEach(symbol -> {
            final int state = graph.addNode();
            map.put(symbol.getName(), state);
        });

        for (final Symbol symbol : symbols) {
            for (final SymbolStep step : symbol.getSteps()) {
                if (step instanceof SymbolPSymbolStep) {
                    final SymbolPSymbolStep symbolStep = (SymbolPSymbolStep) step;
                    final Symbol target = symbolStep.getPSymbol().getSymbol();
                    graph.connect(map.get(symbol.getName()), map.get(target.getName()));

                    // fail fast if a symbol references itself
                    if (symbol.getName().equals(target.getName())) {
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

        // check symbol lock status
        for (Long symbolId : ids) {
            this.symbolPresenceService.checkSymbolLockStatus(projectId, symbolId, user.getId());
        }

        for (Long id : ids) {
            Symbol symbol = get(user, project, id);
            symbol.setHidden(false);
            symbolRepository.save(symbol);
        }
    }

    public void delete(User user, Long projectId, Long symbolId) {
        final Symbol symbol = get(user, projectId, symbolId);

        // check symbol lock status
        this.symbolPresenceService.checkSymbolLockStatusStrict(projectId, symbolId, user.getId());

        if (!symbol.isHidden()) {
            throw new ValidationException("Symbol has to be archived first.");
        }

        long r1 = parameterizedSymbolRepository.countAllBySymbol_Id(symbolId);
        long r2 = symbolSymbolStepRepository.countAllByPSymbol_Symbol_Id(symbolId);
        long r3 = testCaseStepRepository.countAllByPSymbol_Symbol_Id(symbolId);
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
        for (Long id: symbolIds) {
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
