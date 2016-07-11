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
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.repositories.ProjectRepository;
import de.learnlib.alex.core.repositories.SymbolGroupRepository;
import de.learnlib.alex.core.repositories.SymbolRepository;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.ValidationExceptionHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Implementation of a SymbolDAO using Spring Data.
 */
@Service
public class SymbolDAOImpl implements SymbolDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The SymbolGroupRepository to use. Will be injected. */
    private SymbolGroupRepository symbolGroupRepository;

    /** The SymbolRepository to use. Will be injected. */
    private SymbolRepository symbolRepository;

    /**
     * Creates a new SymbolDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param symbolGroupRepository
     *         The SymbolGroupRepository to use.
     * @param symbolRepository
     *         The SymbolRepository to use.
     */
    @Inject
    public SymbolDAOImpl(ProjectRepository projectRepository, SymbolGroupRepository symbolGroupRepository,
                         SymbolRepository symbolRepository) {
        this.projectRepository = projectRepository;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;
    }

    @Override
    @Transactional
    public void create(Symbol symbol) throws ValidationException {
        LOGGER.traceEntry("create({})", symbol);
        try {
            // create the symbol
            createOne(symbol);
            setExecuteToSymbols(symbol);

        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol creation failed:", e);
            throw new ValidationException("Symbol could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Symbol creation failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Symbol was not created:", cve);
        } catch (javax.validation.ConstraintViolationException e) {
            symbol.setId(null);
            symbol.setRevision(null);
            throw ValidationExceptionHelper.createValidationException("Symbol was not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbol.setId(null);
            symbol.setRevision(null);
            throw new ValidationException("Symbol was not created: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbol.setId(null);
            symbol.setRevision(null);
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        } catch (NotFoundException e) {
            symbol.setId(null);
            symbol.setRevision(null);
            throw new ValidationException("Could not create a symbol because it has a reference to another"
                                                  + " unknown symbol.", e);
        }
        LOGGER.traceExit(symbol);
    }

    @Override
    @Transactional
    public void create(List<Symbol> symbols) throws ValidationException {
        try {
            // create the symbol
            symbols.forEach(this::createOne);

            // set execute symbols
            Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
            symbols.forEach(s -> symbolMap.put(s.getIdRevisionPair(), s));
            for (Symbol symbol : symbols) {
                setExecuteToSymbols(symbol, symbolMap);
            }

        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol creation failed:", e);
            throw new ValidationException("Symbol could not be created.", e);
        } catch (NotFoundException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not create a symbol because it has a reference to another"
                                                  + " unknown symbol.", e);
        } catch (javax.validation.ConstraintViolationException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw ValidationExceptionHelper.createValidationException("Symbols were not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Symbols were not created: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
    }

    private void createOne(Symbol symbol) {
        // new symbols should have a project, not an id and not a revision
        if (symbol.getProjectId() == null && symbol.getProject() == null) {
            throw new ValidationException("To create a symbols it must have a Project.");
        }

        if (symbol.getId() != null || symbol.getRevision() != null) {
            throw new ValidationException("To create a symbols it must not haven an ID or and revision");
        }

        Long userId    = symbol.getUserId();
        Long projectId = symbol.getProjectId();
        Long groupId   = symbol.getGroupId();

        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new ValidationException("The Project was not found and thus the Symbol was not created.");
        }

        SymbolGroup group = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(userId, projectId, groupId);
        if (group == null) {
            throw new ValidationException("The specified group was not found and thus the Symbol was not created.");
        }

        // get the current highest symbol id in the project and add 1 for the next id
        long id = project.getNextSymbolId();
        project.setNextSymbolId(id + 1);
        projectRepository.save(project);

        // set id, project id and revision and save the symbol
        symbol.setId(id);
        symbol.setRevision(1L);

        project.addSymbol(symbol);

        // add the symbol to its group
        group.addSymbol(symbol);

        beforeSymbolSave(symbol);

        symbolRepository.save(symbol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAll(User user, Long projectId, List<IdRevisionPair> idRevPairs) throws NotFoundException {
        // no DB interaction if no symbols are requested
        if (idRevPairs.isEmpty()) {
            return new LinkedList<>();
        }

        // get the symbols
        @SuppressWarnings("unchecked") // should return a list of Symbols
                List<Symbol> result = symbolRepository.findAll(user.getId(), projectId, idRevPairs);

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                + " with the group ids and revisions" + idRevPairs + ".");
        }

        // load the lazy relations
        result.forEach(s -> loadLazyRelations(this, s));
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(user.getId(), projectId);
        if (project == null) {
            throw new NotFoundException("Could not find the project with the id " + projectId + ".");
        }

        return symbolRepository.findAllWithHighestRevision(user.getId(), projectId, visibilityLevel.getCriterion());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId, Long groupId) throws NotFoundException {
        return getAllWithLatestRevision(user, projectId, groupId, SymbolVisibilityLevel.VISIBLE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId,
                                                 Long groupId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        List<Symbol> symbols = symbolRepository.findAllWithHighestRevision(user.getId(), projectId,
                                                                           groupId, visibilityLevel.getCriterion());

        if (symbols.isEmpty()) {
            return new LinkedList<>();
        }

        symbols.forEach(s -> Hibernate.initialize(s.getActions()));

        return symbols;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIdsWithLatestRevision(User user, Long projectId, Long... ids) throws NotFoundException {
        return getByIdsWithLatestRevision(user, projectId, SymbolVisibilityLevel.ALL, ids);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIdsWithLatestRevision(User user, Long projectId, SymbolVisibilityLevel visibilityLevel,
                                                   Long... ids) throws NotFoundException {
        // get latest revision
        List<Symbol> result = symbolRepository.findAllWithHighestRevision(user.getId(), projectId, ids);

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                     + " with the ids " + Arrays.toString(ids) + ".");
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Symbol get(User user, Long projectId, IdRevisionPair idRevisionPair) throws NotFoundException {
        return get(user, projectId, idRevisionPair.getId(), idRevisionPair.getRevision());
    }

    @Override
    @Transactional(readOnly = true)
    public Symbol get(User user, Long projectId, Long id, Long revision) throws NotFoundException {
        Symbol result = symbolRepository.findOne(user.getId(), projectId, id, revision);

        if (result == null) {
            throw new NotFoundException("Could not find a symbol in the project " + projectId + ","
                                                + " the id " + id + " and the revision " + revision + ".");
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Symbol getWithLatestRevision(User user, Long projectId, Long id) throws NotFoundException {
        return getByIdsWithLatestRevision(user, projectId, id).get(0);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getWithAllRevisions(User user, Long projectId, Long id) throws NotFoundException {
        List<Symbol> result = symbolRepository.findOne(user.getId(), projectId, id);

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                     + " with the id " + id + ".");
        }
        return result;
    }

    @Override
    @Transactional
    public void update(Symbol symbol) throws IllegalArgumentException, NotFoundException, ValidationException {
        // update
        try {
            update_(symbol);
            setExecuteToSymbols(symbol);

        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol update failed:", e);
            throw new ValidationException("Symbol could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Symbol update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Symbol could not be updated:", cve);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not update the Symbol because it is not valid.", e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (NotFoundException e) {
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    @Override
    @Transactional
    public void update(List<Symbol> symbols) throws IllegalArgumentException, NotFoundException, ValidationException {
        // update
        try {
            for (Symbol symbol : symbols) {
                update_(symbol);
            }

            Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
            symbols.forEach(s -> symbolMap.put(s.getIdRevisionPair(), s));
            for (Symbol symbol : symbols) {
                setExecuteToSymbols(symbol, symbolMap);
            }

            // error handling
        } catch (javax.validation.ConstraintViolationException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw ValidationExceptionHelper.createValidationException("Symbols were not updated:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Symbols were not updated: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not update the Symbols because one is not valid.", e);
        } catch (IllegalArgumentException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw e;
        } catch (NotFoundException e) {
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    private void update_(Symbol symbol) throws IllegalArgumentException, NotFoundException {
        // checks for valid symbol
        if (symbol.getProjectId() == null) {
            throw new NotFoundException("Update failed: Could not find the project with the id + "
                                                + symbol.getProjectId() + ".");
        }

        Symbol symbolInDB;
        try {
            symbolInDB = getWithLatestRevision(symbol.getUser(), symbol.getProjectId(), symbol.getId());
        } catch (NotFoundException e) {
            throw new NotFoundException("Update failed: Could not find the symbols with the id " + symbol.getId()
                                                + " in the project " + symbol.getProjectId() + ".");
        }

        // only allow update form the latest revision
        if (!Objects.equals(symbol.getRevision(), symbolInDB.getRevision())) {
            throw new IllegalArgumentException("Update failed: You used an old revision for the symbol "
                                                       + symbol.getId() + " in the project "
                                                       + symbol.getProjectId() + ".");
        }

        SymbolGroup oldGroup = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(symbol.getUserId(),
                                                                                        symbol.getProjectId(),
                                                                                        symbolInDB.getGroupId());

        SymbolGroup newGroup = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(symbol.getUserId(),
                                                                                        symbol.getProjectId(),
                                                                                        symbol.getGroupId());

        // count revision up
        symbol.setSymbolId(0L);
        symbol.setRevision(symbol.getRevision() + 1);
        symbol.setGroup(newGroup);

        beforeSymbolSave(symbol);

        symbolRepository.save(symbol);

        // update group
        if (!newGroup.equals(oldGroup)) {
            List<Symbol> symbols = symbolRepository.findOne(symbol.getUserId(),
                                                            symbol.getProjectId(),
                                                            symbol.getId());
            symbols.remove(symbol);

            symbols.forEach(newGroup::addSymbol);
        }
    }

    @Override
    @Transactional
    public void move(Symbol symbol, Long newGroupId) throws NotFoundException {
        try {
            move_(symbol, newGroupId);
        } catch (NotFoundException e) {
            throw e;
        }
    }

    @Override
    @Transactional
    public void move(List<Symbol> symbols, Long newGroupId) throws NotFoundException  {
        try {
            for (Symbol s : symbols) {
                move_(s, newGroupId);
            }
        } catch (NotFoundException e) {
            throw e;
        }
    }

    private void move_(Symbol symbol, Long newGroupId) throws NotFoundException {
        SymbolGroup oldGroup = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(symbol.getUserId(),
                                                                                        symbol.getProjectId(),
                                                                                        symbol.getGroupId());

        SymbolGroup newGroup = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(symbol.getUserId(),
                                                                                        symbol.getProjectId(),
                                                                                        newGroupId);

        if (newGroup == null) {
            throw new NotFoundException("The group with the id " + newGroupId + " does not exist!");
        }

        if (!newGroup.equals(oldGroup)) {
            List<Symbol> symbols = symbolRepository.findOne(symbol.getUserId(),
                                                            symbol.getProjectId(),
                                                            symbol.getId());
            symbols.forEach(newGroup::addSymbol);
        }
    }

    @Override
    @Transactional
    public void hide(Long userId, Long projectId, Long... ids) throws NotFoundException {
        // update
        try {
            for (Long id : ids) {
                List<Symbol> symbols = getSymbols(userId, projectId, id);

                hideSymbols(symbols);
            }
        } catch (NotFoundException e) {
            throw  e;
        }
    }

    private void hideSymbols(List<Symbol> symbols) {
        for (Symbol symbol : symbols) {
            loadLazyRelations(this, symbol);

            symbol.setHidden(true);
            symbolRepository.save(symbol);
        }
    }

    @Override
    @Transactional
    public void show(Long userId, Long projectId, Long... ids) throws NotFoundException {
        // update
        try {
            for (Long id : ids) {
                List<Symbol> symbols = getSymbols(userId, projectId, id);
                showSymbols(symbols);
            }
        } catch (IllegalArgumentException e) {
            throw  e;
        }
    }

    private void showSymbols(List<Symbol> symbols) {
        for (Symbol symbol : symbols) {
            symbol.setHidden(false);
            symbolRepository.save(symbol);
        }
    }

    private List<Symbol> getSymbols(Long userId, Long projectId, Long symbolId)
            throws NotFoundException {
        List<Symbol> symbols = symbolRepository.findOne(userId, projectId, symbolId);

        if (symbols.size() == 0) {
            throw new NotFoundException("Could not mark the symbol as hidden because it was not found.");
        }

        return symbols;
    }

    /**
     * Sets references to related entities to all actions of a symbol.
     *
     * @param symbol
     *         The symbol.
     */
    public void beforeSymbolSave(Symbol symbol) {
        for (int i = 0; i < symbol.getActions().size(); i++) {
            SymbolAction action = symbol.getActions().get(i);
            action.setId(null);
            action.setUser(symbol.getUser());
            action.setProject(symbol.getProject());
            action.setSymbol(symbol);
            action.setNumber(i);
        }
    }

    private void setExecuteToSymbols(Symbol symbol) throws NotFoundException {
        Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
        symbolMap.put(symbol.getIdRevisionPair(), symbol);
        setExecuteToSymbols(symbol, symbolMap);
    }

    private void setExecuteToSymbols(Symbol symbol, Map<IdRevisionPair, Symbol> allSymbols)
            throws NotFoundException {
        for (SymbolAction action : symbol.getActions()) {
            if (action instanceof ExecuteSymbolAction) {
                ExecuteSymbolAction executeSymbolAction = (ExecuteSymbolAction) action;
                IdRevisionPair idAndRevision = executeSymbolAction.getSymbolToExecuteAsIdRevisionPair();

                Symbol symbolToExecute = allSymbols.get(idAndRevision);

                if (symbolToExecute == null) { // it was not in the set of all symbols
                    symbolToExecute = symbolRepository.findOne(action.getUser().getId(), action.getProject().getId(),
                                                               idAndRevision.getId(), idAndRevision.getRevision());
                }

                if (symbolToExecute == null) {
                    throw new NotFoundException("Could not find the symbol with the id "
                                                    + idAndRevision.getId() + " and the revision "
                                                    + idAndRevision.getRevision() + ", but it was referenced");
                }
                executeSymbolAction.setSymbolToExecute(symbolToExecute);
            }
        }
    }

    /**
     * Use Hibernate to populate all fields of a Symbol, including all references to other entities.
     *
     * @param symbolDAO
     *         The SymbolDAO to use.
     * @param symbol
     *         The Symbol to populate.
     */
    public static void loadLazyRelations(SymbolDAO symbolDAO, Symbol symbol) {
        Hibernate.initialize(symbol.getUser());
        Hibernate.initialize(symbol.getGroup());

        Hibernate.initialize(symbol.getActions());
        symbol.getActions().stream().filter(a -> a instanceof ExecuteSymbolAction).forEach(a -> {
            ExecuteSymbolAction action = (ExecuteSymbolAction) a;

            if (action.isUseLatestRevision()) {
                try {
                    Symbol symbolToExecute = symbolDAO.getWithLatestRevision(symbol.getUser(), symbol.getProjectId(),
                                                                action.getSymbolToExecuteAsIdRevisionPair().getId());
                    action.setSymbolToExecute(symbolToExecute);
                } catch (NotFoundException e) {
                    LOGGER.warn("While loading the lazy relation for the symbol '" + symbol + "': Could not find the"
                                + "latest revision of the symbol to execute '" + action.getSymbolToExecute() + "'.");
                    action.setSymbolToExecute(null);
                }
            }

            Symbol symbolToExecute = action.getSymbolToExecute();

            if (symbolToExecute != null
                    && (!Hibernate.isInitialized(symbolToExecute)
                            || !Hibernate.isInitialized(symbolToExecute.getActions()))) {
                Hibernate.initialize(symbolToExecute);
                Hibernate.initialize(symbolToExecute.getActions());
                loadLazyRelations(symbolDAO, symbolToExecute);
            }
        });
    }

}
