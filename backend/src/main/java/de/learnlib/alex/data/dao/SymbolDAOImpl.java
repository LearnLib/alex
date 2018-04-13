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
import de.learnlib.alex.common.utils.ValidationExceptionHelper;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolVisibilityLevel;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.ArrayList;
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

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The SymbolGroupRepository to use. Will be injected. */
    private SymbolGroupRepository symbolGroupRepository;

    /** The SymbolRepository to use. Will be injected. */
    private SymbolRepository symbolRepository;

    /** The SymbolActionRepository to use. Will be injected. */
    private SymbolActionRepository symbolActionRepository;

    /** The injected SymbolParameterRepository to use. */
    private SymbolParameterRepository symbolParameterRepository;

    /**
     * Creates a new SymbolDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param projectDAO
     *         The ProjectDAO to use.
     * @param symbolGroupRepository
     *         The SymbolGroupRepository to use.
     * @param symbolRepository
     *         The SymbolRepository to use.
     * @param symbolActionRepository
     *         The SymbolActionRepository to use.
     * @param symbolParameterRepository
     *         The SymbolParameterRepository to use.
     */
    @Inject
    public SymbolDAOImpl(ProjectRepository projectRepository, ProjectDAO projectDAO,
                         SymbolGroupRepository symbolGroupRepository, SymbolRepository symbolRepository,
                         SymbolActionRepository symbolActionRepository, SymbolParameterRepository symbolParameterRepository) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;
        this.symbolActionRepository = symbolActionRepository;
        this.symbolParameterRepository = symbolParameterRepository;
    }

    @Override
    @Transactional
    public void create(User user, Symbol symbol) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", symbol);
        try {
            createOne(user, symbol);
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
    public void create(User user, List<Symbol> symbols) throws NotFoundException, ValidationException {
        try {
            for (Symbol symbol : symbols) {
                createOne(user, symbol);
            }
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

    private void createOne(User user, Symbol symbol) throws NotFoundException {
        // new symbols should have a project and no id
        if (symbol.getProjectId() == null && symbol.getProject() == null) {
            throw new ValidationException("To create a symbol it must have a Project.");
        }

        if (symbol.getId() != null) {
            throw new ValidationException("To create a symbol it must not haven an ID");
        }

        // make sure the name of the symbol is unique
        if (symbolRepository.getSymbolByName(symbol.getProjectId(), symbol.getName()) != null) {
            throw new ValidationException("To create a symbol its name must be unique.");
        }

        Long userId = user.getId();
        Long projectId = symbol.getProjectId();
        Long groupId = symbol.getGroupId();

        Project project = projectDAO.getByID(userId, projectId, ProjectDAO.EmbeddableFields.ALL); // incl. access check

        SymbolGroup group = symbolGroupRepository.findOneByProject_IdAndId(projectId, groupId);
        if (group == null) {
            group = symbolGroupRepository.findOneByProject_IdAndId(projectId, 0L);
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

        // save inputs and outputs
        List<SymbolInputParameter> inputs = symbol.getInputs();
        List<SymbolOutputParameter> outputs = symbol.getOutputs();

        symbol.setInputs(new ArrayList<>());
        symbol.setOutputs(new ArrayList<>());

        symbolRepository.save(symbol);

        inputs.forEach(in -> in.setSymbol(symbol));
        outputs.forEach(in -> in.setSymbol(symbol));

        symbolParameterRepository.save(inputs);
        symbolParameterRepository.save(outputs);

        symbol.setInputs(inputs);
        symbol.setOutputs(outputs);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIds(User user, Long projectId, List<Long> ids) throws NotFoundException {
        // no DB interaction if no symbols are requested
        if (ids.isEmpty()) {
            return new LinkedList<>();
        }
        projectDAO.getByID(user.getId(), projectId); // access check

        // get the symbols
        List<Symbol> result = symbolRepository.findByIds(projectId, ids);
        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                    + " with the ids.");
        }

        // load the lazy relations
        result.forEach(SymbolDAOImpl::loadLazyRelations);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getAll(User user, Long projectId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.ALL);

        List<Symbol> result = symbolRepository.findAll(projectId, visibilityLevel.getCriterion());

        result.forEach(SymbolDAOImpl::loadLazyRelations);

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
        projectDAO.getByID(user.getId(), projectId); // access check

        List<Symbol> symbols = symbolRepository.findAll(projectId, groupId,
                visibilityLevel.getCriterion());

        symbols.forEach(SymbolDAOImpl::loadLazyRelations);

        return symbols;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Symbol> getByIds(User user, Long projectId, SymbolVisibilityLevel visibilityLevel,
                                 List<Long> ids) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<Symbol> result = symbolRepository.findByIds(projectId, ids);

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId + ".");
        }

        result.forEach(s -> loadLazyRelations(s));

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Symbol get(User user, Long projectId, Long id) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        return _get(projectId, id);
    }

    private Symbol _get(Long projectId, Long id) throws NotFoundException {
        Symbol result = symbolRepository.findOne(projectId, id);

        if (result == null) {
            throw new NotFoundException("Could not find the Symbol with the id " + id
                    + " in the Project " + projectId + ".");
        }
        loadLazyRelations(result);

        return result;
    }

    @Override
    @Transactional
    public Symbol update(User user, Symbol symbol)
            throws IllegalArgumentException, NotFoundException, ValidationException {
        try {
            return doUpdate(user, symbol);
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
    public List<Symbol> update(User user, List<Symbol> symbols)
            throws IllegalArgumentException, NotFoundException, ValidationException {
        try {
            final List<Symbol> updatedSymbols = new ArrayList<>();
            for (Symbol symbol : symbols) {
                updatedSymbols.add(doUpdate(user, symbol));
            }
            return updatedSymbols;
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

    private Symbol doUpdate(User user, Symbol symbol) throws IllegalArgumentException, NotFoundException {
        // checks for valid symbol
        Project project = projectDAO.getByID(user.getId(),
                symbol.getProjectId(),
                ProjectDAO.EmbeddableFields.ALL); // incl. access check

        // make sure the name of the symbol is unique
        Symbol symbol2 = symbolRepository.getSymbolByName(symbol.getProjectId(), symbol.getName());
        if (symbol2 != null && !symbol2.getId().equals(symbol.getId())) {
            throw new ValidationException("To update a symbol its name must be unique.");
        }

        Symbol symbolInDB = _get(symbol.getProjectId(), symbol.getId());

        symbol.setUUID(symbolInDB.getUUID());
        symbol.setProject(project);
        symbol.setGroup(symbolInDB.getGroup());
        symbolActionRepository.delete(symbolInDB.getActions());

        beforeSymbolSave(symbol);
        return symbolRepository.save(symbol);
    }

    @Override
    @Transactional
    public void move(User user, Symbol symbol, Long newGroupId) throws NotFoundException {
        move(user, Collections.singletonList(symbol), newGroupId);
    }

    @Override
    @Transactional
    public void move(User user, List<Symbol> symbols, Long newGroupId) throws NotFoundException {
        for (Symbol symbol : symbols) {
            projectDAO.getByID(user.getId(), symbol.getProjectId()); // access check

            SymbolGroup oldGroup = symbolGroupRepository.findOneByProject_IdAndId(symbol.getProjectId(),
                    symbol.getGroupId());

            SymbolGroup newGroup = symbolGroupRepository.findOneByProject_IdAndId(symbol.getProjectId(),
                    newGroupId);

            if (newGroup == null) {
                throw new NotFoundException("The group with the id " + newGroupId + " does not exist!");
            }

            if (!newGroup.equals(oldGroup)) {
                Symbol s = symbolRepository.findOne(symbol.getProjectId(), symbol.getId());
                newGroup.addSymbol(s);
            }
        }
    }

    @Override
    @Transactional
    public void hide(User user, Long projectId, List<Long> ids) throws NotFoundException {
        Project project = projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.ALL); // access check

        for (Long id : ids) {
            Symbol symbol = _get(projectId, id);

            symbol.setProject(project);
            symbol.setHidden(true);
            symbolRepository.save(symbol);
        }
    }

    @Override
    @Transactional
    public void show(User user, Long projectId, List<Long> ids) throws NotFoundException {
        Project project = projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.ALL); // access check

        for (Long id : ids) {
            Symbol symbol = _get(projectId, id);

            symbol.setProject(project);
            symbol.setHidden(false);
            symbolRepository.save(symbol);
        }
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
            action.setUUID(null);
            action.setSymbol(symbol);
            action.setNumber(i);
        }

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
        Hibernate.initialize(symbol.getGroup());
        Hibernate.initialize(symbol.getActions());
        Hibernate.initialize(symbol.getInputs());
        Hibernate.initialize(symbol.getOutputs());
    }

    @Override
    public void checkAccess(User user, Project project, Symbol symbol) throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (symbol == null) {
            throw new NotFoundException("The symbol does not exist.");
        }

        if (!symbol.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the symbol.");
        }
    }
}
