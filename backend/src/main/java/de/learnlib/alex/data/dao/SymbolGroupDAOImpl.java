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
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a SymbolGroupDAO using Spring Data.
 */
@Service
public class SymbolGroupDAOImpl implements SymbolGroupDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker GROUP_MARKER = MarkerManager.getMarker("GROUP");
    private static final Marker DAO_MARKER   = MarkerManager.getMarker("DAO");
    private static final Marker IMPL_MARKER  = MarkerManager.getMarker("GROUP_DAO")
                                                                .setParents(DAO_MARKER, GROUP_MARKER);

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The SymbolGroupRepository to use. Will be injected. */
    private SymbolGroupRepository symbolGroupRepository;

    /** The SymbolRepository to use. Will be injected. */
    private SymbolRepository symbolRepository;

    /** The SymbolDAO to use. */
    private SymbolDAO symbolDAO;

    /**
     * Creates a new SymbolGroupDAO.
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
    public SymbolGroupDAOImpl(ProjectRepository projectRepository, ProjectDAO projectDAO,
                              SymbolGroupRepository symbolGroupRepository, SymbolRepository symbolRepository,
                              SymbolActionRepository symbolActionRepository) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;

        this.symbolDAO = new SymbolDAOImpl(projectRepository, projectDAO, symbolGroupRepository, symbolRepository,
                                           symbolActionRepository);
    }

    @Override
    @Transactional
    public void create(User user, SymbolGroup group) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", group);

        try {
            // access check
            Project project = projectDAO.getByID(user.getId(), group.getProjectId(), ProjectDAO.EmbeddableFields.ALL);

            checkIfNameIsUnique(project.getId(), group.getName());

            // get the current highest group id in the project and add 1 for the next id
            long id = project.getNextGroupId();
            project.setNextGroupId(id + 1);
            projectRepository.save(project);

            group.setId(id);
            project.addGroup(group);

            beforePersistGroup(group);
            symbolGroupRepository.save(group);
        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info(IMPL_MARKER, "SymbolGroup creation failed:", e);
            throw new ValidationException("SymbolGroup could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info(IMPL_MARKER, "SymbolGroup creation failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("SymbolGroup was not created:", cve);
        }

        LOGGER.traceExit(group);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SymbolGroup> getAll(User user, long projectId, EmbeddableFields... embedFields)
            throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<SymbolGroup> resultList = symbolGroupRepository.findAllByProject_Id(projectId);

        // load lazy relations
        for (SymbolGroup group : resultList) {
            initLazyRelations(user, group, embedFields);
        }

        return resultList;
    }

    @Override
    @Transactional(readOnly = true)
    public SymbolGroup get(User user, long projectId, Long groupId, EmbeddableFields... embedFields)
            throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        SymbolGroup result = symbolGroupRepository.findOneByProject_IdAndId(projectId, groupId);
        if (result == null) {
            throw new NotFoundException("Could not find a group with the id " + groupId
                                             + " in the project " + projectId + ".");
        }

        initLazyRelations(user, result, embedFields);

        return result;
    }

    @Override
    @Transactional
    public void update(User user, SymbolGroup group) throws NotFoundException, ValidationException {
        // incl. access check
        Project project = projectDAO.getByID(user.getId(), group.getProjectId(), ProjectDAO.EmbeddableFields.ALL);

        SymbolGroup groupInDB = symbolGroupRepository.findOneByProject_IdAndId(group.getProjectId(), group.getId());

        if (groupInDB == null) {
            throw new NotFoundException("You can only update existing groups!");
        }

        checkIfNameIsUnique(group.getProjectId(), group.getName());

        try {
            // apply changes
            groupInDB.setProject(project);
            groupInDB.setName(group.getName());
            symbolGroupRepository.save(groupInDB);
        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info(IMPL_MARKER, "SymbolGroup update failed:", e);
            throw new ValidationException("SymbolGroup could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info(IMPL_MARKER, "SymbolGroup update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("SymbolGroup was not updated:", cve);
        }
    }

    @Override
    @Transactional
    public void delete(User user, long projectId, Long groupId) throws IllegalArgumentException, NotFoundException {
        // access check
        Project project = projectDAO.getByID(user.getId(), projectId);
        SymbolGroup group = get(user, projectId, groupId, EmbeddableFields.ALL);

        if (group.isDefaultGroup()) {
            throw new IllegalArgumentException("You can not delete the default group of a project.");
        }

        SymbolGroup defaultGroup = symbolGroupRepository.findOneByProject_IdAndId(project.getId(), 0L);
        for (Symbol symbol : group.getSymbols()) {
            symbol.setGroup(defaultGroup);
            symbol.setHidden(true);
            symbolRepository.save(symbol);
        }

        group.setSymbols(null);
        symbolGroupRepository.delete(group);
    }

    private void initLazyRelations(User user, SymbolGroup group, EmbeddableFields... embedFields) {
        Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

        if (fieldsToLoad.contains(EmbeddableFields.COMPLETE_SYMBOLS)) {
            group.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
        } else if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
            try {
                List<Symbol> symbols = symbolDAO.getAll(user, group.getProjectId(), group.getId());
                group.setSymbols(new HashSet<>(symbols));
            } catch (NotFoundException e) {
                group.setSymbols(null);
            }
        } else {
            group.setSymbols(null);
        }
    }

    private Set<EmbeddableFields> fieldsArrayToHashSet(EmbeddableFields[] embedFields) {
        Set<EmbeddableFields> fieldsToLoad = new HashSet<>();
        if (Arrays.asList(embedFields).contains(EmbeddableFields.ALL)) {
            fieldsToLoad.add(EmbeddableFields.COMPLETE_SYMBOLS);
        } else {
            Collections.addAll(fieldsToLoad, embedFields);
        }
        return fieldsToLoad;
    }

    private void checkIfNameIsUnique(Long projectId, String name) throws ValidationException {
        if (symbolGroupRepository.findOneByProject_IdAndName(projectId, name) != null) {
            throw new ValidationException("The name of the group already exists.");
        }
    }

    /**
     * This method makes sure that all Symbols within the provided group will also be persisted.
     *
     * @param group
     *         The Group to take care of its Symbols.
     */
    static void beforePersistGroup(SymbolGroup group) {
        LOGGER.traceEntry("beforePersistGroup({})", group);

        Project project = group.getProject();

        group.getSymbols().forEach(symbol -> {
            Long symbolId = project.getNextSymbolId();
            project.addSymbol(symbol);
            symbol.setGroup(group);
            symbol.setId(symbolId);
            project.setNextSymbolId(symbolId + 1);

            SymbolDAOImpl.beforeSymbolSave(symbol);
        });

        LOGGER.traceExit();
    }
}
