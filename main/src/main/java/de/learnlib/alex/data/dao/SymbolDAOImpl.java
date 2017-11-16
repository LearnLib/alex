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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ValidationExceptionHelper;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolVisibilityLevel;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
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
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

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

    /** The SymbolActionRepository to use. Will be injected. */
    private SymbolActionRepository symbolActionRepository;

    /**
     * Creates a new SymbolDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param symbolGroupRepository
     *         The SymbolGroupRepository to use.
     * @param symbolRepository
     *         The SymbolRepository to use.
     * @param symbolActionRepository
     *         The SymbolActionRepository to use.
     */
    @Inject
    public SymbolDAOImpl(ProjectRepository projectRepository, SymbolGroupRepository symbolGroupRepository,
                         SymbolRepository symbolRepository, SymbolActionRepository symbolActionRepository) {
        this.projectRepository = projectRepository;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;
        this.symbolActionRepository = symbolActionRepository;
    }

    @Override
    @Transactional
    public void create(Symbol symbol) throws ValidationException {
        LOGGER.traceEntry("create({})", symbol);
        try {
            createOne(symbol);
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol creation failed:", e);
            throw new ValidationException("Symbol could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Symbol creation failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Symbol was not created:", cve);
        } catch (javax.validation.ConstraintViolationException e) {
            symbol.setId(null);
            throw ValidationExceptionHelper.createValidationException("Symbol was not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbol.setId(null);
            throw new ValidationException("Symbol was not created: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbol.setId(null);
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
        LOGGER.traceExit(symbol);
    }

    @Override
    @Transactional
    public void create(List<Symbol> symbols) throws ValidationException {
        try {
            symbols.forEach(this::createOne);
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol creation failed:", e);
            throw new ValidationException("Symbol could not be created.", e);
        } catch (javax.validation.ConstraintViolationException e) {
            symbols.forEach(s -> s.setId(null));
            throw ValidationExceptionHelper.createValidationException("Symbols were not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbols.forEach(s -> s.setId(null));
            throw new ValidationException("Symbols were not created: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbols.forEach(s -> s.setId(null));
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
    }

    private void createOne(Symbol symbol) {
        // new symbols should have a project and no id
        if (symbol.getProjectId() == null && symbol.getProject() == null) {
            throw new ValidationException("To create a symbol it must have a Project.");
        }

        if (symbol.getId() != null) {
            throw new ValidationException("To create a symbol it must not haven an ID");
        }

        // make sure the name of the symbol is unique
        if (symbolRepository.getSymbolByName(symbol.getUserId(), symbol.getProjectId(), symbol.getName()) != null) {
            throw new ValidationException("To create a symbol its name must be unique.");
        }

        Long userId = symbol.getUserId();
        Long projectId = symbol.getProjectId();
        Long groupId = symbol.getGroupId();

        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new ValidationException("The Project was not found and thus the Symbol was not created.");
        }

        SymbolGroup group = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(userId, projectId, groupId);
        if (group == null) {
            group = project.getDefaultGroup();
        }

        // get the current highest symbol id in the project and add 1 for the next id
        long id = project.getNextSymbolId();
        project.setNextSymbolId(id + 1);
        projectRepository.save(project);

        // set id, project id and save the symbol
        symbol.setId(id);
        project.addSymbol(symbol);

        // add the symbol to its group
        group.addSymbol(symbol);

        beforeSymbolSave(symbol);

        symbolRepository.save(symbol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIds(User user, Long projectId, List<Long> ids) throws NotFoundException {
        // no DB interaction if no symbols are requested
        if (ids.isEmpty()) {
            return new LinkedList<>();
        }

        // get the symbols
        List<Symbol> result = symbolRepository.findByIds(user.getId(), projectId, ids);
        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                + " with the ids.");
        }

        // load the lazy relations
        result.forEach(s -> loadLazyRelations(this, s));
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAll(User user, Long projectId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(user.getId(), projectId);
        if (project == null) {
            throw new NotFoundException("Could not find the project with the id " + projectId + ".");
        }

        List<Symbol> result = symbolRepository.findAll(user.getId(), projectId, visibilityLevel.getCriterion());

        result.forEach(s -> loadLazyRelations(this, s));

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAll(User user, Long projectId, Long groupId) throws NotFoundException {
        return getAll(user, projectId, groupId, SymbolVisibilityLevel.VISIBLE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAll(User user, Long projectId, Long groupId,
                               SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        List<Symbol> symbols = symbolRepository.findAll(user.getId(), projectId, groupId,
                                                        visibilityLevel.getCriterion());

        symbols.forEach(s -> loadLazyRelations(this, s));

        return symbols;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIds(User user, Long projectId, SymbolVisibilityLevel visibilityLevel,
                                                   List<Long> ids) throws NotFoundException {

        List<Symbol> result = symbolRepository.findByIds(user.getId(), projectId, ids);

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId + ".");
        }

        result.forEach(s -> loadLazyRelations(this, s));

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Symbol get(User user, Long projectId, Long id) throws NotFoundException {
        Symbol result = symbolRepository.findOne(user.getId(), projectId, id);

        if (result == null) {
            throw new NotFoundException("Could not find a symbol in the project " + projectId + ","
                    + " the id " + id + ".");
        }
        loadLazyRelations(this, result);

        return result;
    }

    @Override
    @Transactional
    public void update(Symbol symbol) throws IllegalArgumentException, NotFoundException, ValidationException {
        try {
            doUpdate(symbol);
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Symbol update failed:", e);
            throw new ValidationException("Symbol could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Symbol update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Symbol could not be updated:", cve);
        } catch (IllegalStateException e) {
            throw new ValidationException("Could not update the symbol because it is not valid.", e);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (NotFoundException e) {
            throw new NotFoundException("Could not update the symbol because it has not been found.", e);
        }
    }

    @Override
    @Transactional
    public void update(List<Symbol> symbols) throws IllegalArgumentException, NotFoundException, ValidationException {
        try {
            for (Symbol symbol : symbols) {
                doUpdate(symbol);
            }
        } catch (javax.validation.ConstraintViolationException e) {
            symbols.forEach(s -> s.setId(null));
            throw ValidationExceptionHelper.createValidationException("Symbols were not updated:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            symbols.forEach(s -> s.setId(null));
            throw new ValidationException("Symbols were not updated: " + e.getMessage(), e);
        } catch (IllegalStateException e) {
            symbols.forEach(s -> s.setId(null));
            throw new ValidationException("Could not update the Symbols because one is not valid.", e);
        } catch (IllegalArgumentException e) {
            symbols.forEach(s -> s.setId(null));
            throw e;
        } catch (NotFoundException e) {
            symbols.forEach(s -> s.setId(null));
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    private Symbol doUpdate(Symbol symbol) throws IllegalArgumentException, NotFoundException {
        // checks for valid symbol
        if (symbol.getProjectId() == null) {
            throw new NotFoundException("Update failed: Could not find the project with the id "
                                                + symbol.getProjectId() + ".");
        }

        // make sure the name of the symbol is unique
        Symbol symbol2 = symbolRepository.getSymbolByName(symbol.getUserId(), symbol.getProjectId(), symbol.getName());
        if (symbol2 != null && !symbol2.getId().equals(symbol.getId())) {
            throw new ValidationException("To update a symbol its name must be unique.");
        }

        try {
            Symbol symbolInDB = get(symbol.getUser(), symbol.getProjectId(), symbol.getId());
            symbol.setSymbolId(symbolInDB.getSymbolId());
            symbol.setProject(symbolInDB.getProject());
            symbol.setGroup(symbolInDB.getGroup());
            symbolActionRepository.delete(symbolInDB.getActions());
        } catch (NotFoundException e) {
            throw new NotFoundException("Update failed: Could not find the symbols with the id " + symbol.getId()
                                                + " in the project " + symbol.getProjectId() + ".");
        }

        beforeSymbolSave(symbol);
        return symbolRepository.save(symbol);
    }

    @Override
    @Transactional
    public void move(Symbol symbol, Long newGroupId) throws NotFoundException {
        move(Collections.singletonList(symbol), newGroupId);
    }

    @Override
    @Transactional
    public void move(List<Symbol> symbols, Long newGroupId) throws NotFoundException  {
        for (Symbol symbol : symbols) {
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
                Symbol s = symbolRepository.findOne(symbol.getUserId(), symbol.getProjectId(), symbol.getId());
                newGroup.addSymbol(s);
            }
        }
    }

    @Override
    @Transactional
    public void hide(Long userId, Long projectId, List<Long> ids) throws NotFoundException {
        for (Long id : ids) {
            Symbol symbol = getSymbol(userId, projectId, id);
            loadLazyRelations(this, symbol);
            symbol.setHidden(true);
            symbolRepository.save(symbol);
        }
    }

    @Override
    @Transactional
    public void show(Long userId, Long projectId, List<Long> ids) throws NotFoundException {
        for (Long id : ids) {
            Symbol symbol = getSymbol(userId, projectId, id);
            symbol.setHidden(false);
            symbolRepository.save(symbol);
        }
    }

    private Symbol getSymbol(Long userId, Long projectId, Long symbolId) throws NotFoundException {
        Symbol symbol = symbolRepository.findOne(userId, projectId, symbolId);

        if (symbol == null) {
            throw new NotFoundException("Could not mark the symbol as hidden because it was not found.");
        }

        return symbol;
    }

    /**
     * Sets references to related entities to all actions of a symbol.
     *
     * @param symbol
     *         The symbol.
     */
    public static void beforeSymbolSave(Symbol symbol) {
        for (int i = 0; i < symbol.getActions().size(); i++) {
            SymbolAction action = symbol.getActions().get(i);
            action.setId(null);
            action.setUser(symbol.getUser());
            action.setProject(symbol.getProject());
            action.setSymbol(symbol);
            action.setNumber(i);
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
        Hibernate.initialize(symbol.getProject());
        Hibernate.initialize(symbol.getGroup());
        Hibernate.initialize(symbol.getActions());
    }

}
