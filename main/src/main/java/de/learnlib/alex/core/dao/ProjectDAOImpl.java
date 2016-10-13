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

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.repositories.ProjectRepository;
import de.learnlib.alex.core.repositories.SymbolRepository;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.ValidationExceptionHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.Hibernate;
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
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a ProjectDAO using Spring Data.
 */
@Service
public class ProjectDAOImpl implements ProjectDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker PROJECT_MARKER = MarkerManager.getMarker("PROJECT");
    private static final Marker DAO_MARKER     = MarkerManager.getMarker("DAO");
    private static final Marker IMPL_MARKER    = MarkerManager.getMarker("PROJECT_DAO")
                                                                .setParents(DAO_MARKER, PROJECT_MARKER);

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The SymbolRepository to use. Will be injected. */
    private SymbolRepository symbolRepository;

    /** The SymbolDAO to use. Will be injected. */
    private SymbolDAO symbolDAO;

    /**
     * Creates a new ProjectDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param symbolRepository
     *         The SymbolRepository to use.
     * @param symbolDAO
     *         The SymbolDAO to use.
     */
    @Inject
    public ProjectDAOImpl(ProjectRepository projectRepository,  SymbolRepository symbolRepository,
                          SymbolDAO symbolDAO) {
        this.projectRepository = projectRepository;
        this.symbolRepository = symbolRepository;
        this.symbolDAO = symbolDAO;
    }

    @Override
    @Transactional
    public void create(final Project project) throws ValidationException {
        LOGGER.traceEntry("create({})", project);
        try {
            if (project.getGroups().size() == 0) { // create new project without existing groups
                LOGGER.info(IMPL_MARKER, "No groups, symbols, ... found for the project.");
                SymbolGroup defaultGroup = new SymbolGroup();
                defaultGroup.setId(0L);
                defaultGroup.setName("Default Group");
                defaultGroup.setProject(project);
                defaultGroup.setUser(project.getUser());

                project.addGroup(defaultGroup);
                project.setDefaultGroup(defaultGroup);
                project.setNextGroupId(1L);
            } else {
                LOGGER.info(IMPL_MARKER, "The Project contains the following groups: {}", project.getGroups());
                project.getGroups().forEach(group -> {
                    group.setUser(project.getUser());

                    group.setProject(project);
                    Long groupId = project.getNextGroupId();
                    group.setId(groupId);
                    project.setNextGroupId(groupId + 1);

                    SymbolGroupDAOImpl.beforePersistGroup(group);
                });

                // set execute symbols
                SymbolDAOImpl.setExecuteToSymbols(symbolRepository, project.getSymbols());

                // set a default group if none is provided
                if (project.getDefaultGroup() == null) {
                    Iterator<SymbolGroup> groups = project.getGroups().iterator();

                    SymbolGroup newDefaultGroup = groups.next(); // just assume that the first group is the default one
                    project.setDefaultGroup(newDefaultGroup);
                } else {
                    String defaultGroupName = project.getDefaultGroup().getName();
                    for (SymbolGroup group : project.getGroups()) {
                        if (defaultGroupName.equals(group.getName())) {
                            project.setDefaultGroup(group);
                            break;
                        }
                    }
                }
            }

            Project createdProject = projectRepository.save(project);
            project.setId(createdProject.getId());
        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info(IMPL_MARKER, "Project creation failed:", e);
            e.printStackTrace();
            LOGGER.traceExit(e);
            throw new javax.validation.ValidationException("Project could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info(IMPL_MARKER, "Project creation failed:", e);
            LOGGER.traceExit(e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Project was not created:", cve);
        } catch (NotFoundException e) {
            // TODO
            e.printStackTrace();
        }

        LOGGER.traceExit(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAll(User user, EmbeddableFields... embedFields) {
        // get the Projects
        List<Project> result = projectRepository.findAllByUser_Id(user.getId());

        // load lazy relations
        for (Project p : result) {
            initLazyRelations(p, embedFields);
        }

        // done
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Project getByID(Long userId, Long projectId, EmbeddableFields... embedFields) throws NotFoundException {
        Project result = projectRepository.findOneByUser_IdAndId(userId, projectId);

        if (result == null) {
            throw new NotFoundException("Could not find the project with the id " + projectId + ".");
        }

        initLazyRelations(result, embedFields);

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Project getByName(Long userId, String projectName, EmbeddableFields... embedFields)
            throws NotFoundException {
        Project result = projectRepository.findOneByUser_IdAndName(userId, projectName);

        if (result == null) {
            throw new NotFoundException("Could not find the project with the name " + projectName + ".");
        }

        initLazyRelations(result, embedFields);

        return result;
    }

    @Override
    @Transactional
    public void update(Project project) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("update({})", project);
        try {
            Project projectInDB = getByID(project.getUserId(), project.getId(), EmbeddableFields.ALL);

            project.setDefaultGroup(projectInDB.getDefaultGroup());
            project.setGroups(projectInDB.getGroups());
            project.setNextGroupId(projectInDB.getNextGroupId());
            project.setNextSymbolId(projectInDB.getNextSymbolId());

            projectRepository.save(project);

        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info(IMPL_MARKER, "Project update failed:", e);
            throw new javax.validation.ValidationException("Project could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info(IMPL_MARKER, "Project update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Project was not updated.", cve);
        }
        LOGGER.traceExit(project);
    }

    @Override
    @Transactional
    public void delete(Long userId, Long projectId) throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new NotFoundException("Could not delete the project with the id " + projectId + ".");
        }

        projectRepository.delete(project);
    }

    /**
     * Load objects that are connected with a project over a 'lazy' relation ship.
     * @param project
     *         The project which needs the 'lazy' objects.
     */
    private void initLazyRelations(Project project, EmbeddableFields... embedFields) {
        if (embedFields != null && embedFields.length > 0) {
            Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

            if (fieldsToLoad.contains(EmbeddableFields.GROUPS)) {
                project.getGroups().forEach(group -> group.getSymbols()
                                                          .forEach(s -> SymbolDAOImpl.loadLazyRelations(symbolDAO, s)));
            } else {
                project.setGroups(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.DEFAULT_GROUP)) {
                project.getDefaultGroup().getSymbols().forEach(s -> SymbolDAOImpl.loadLazyRelations(symbolDAO, s));
            } else {
                project.setDefaultGroup(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
                project.getSymbols().forEach(s -> SymbolDAOImpl.loadLazyRelations(symbolDAO, s));
            } else {
                project.setSymbols(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.TEST_RESULTS)) {
                Hibernate.initialize(project.getTestResults());
            } else {
                project.setTestResults(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.COUNTERS)) {
                Hibernate.initialize(project.getCounters());
            } else {
                project.setCounters(null);
            }
        } else {
            project.setGroups(null);
            project.setDefaultGroup(null);
            project.setSymbols(null);
            project.setTestResults(null);
            project.setCounters(null);
        }
    }

    private Set<EmbeddableFields> fieldsArrayToHashSet(EmbeddableFields[] embedFields) {
        Set<EmbeddableFields> fieldsToLoad = new HashSet<>();
        if (Arrays.asList(embedFields).contains(EmbeddableFields.ALL)) {
            fieldsToLoad.add(EmbeddableFields.GROUPS);
            fieldsToLoad.add(EmbeddableFields.DEFAULT_GROUP);
            fieldsToLoad.add(EmbeddableFields.SYMBOLS);
            fieldsToLoad.add(EmbeddableFields.TEST_RESULTS);
            fieldsToLoad.add(EmbeddableFields.COUNTERS);
        } else {
            Collections.addAll(fieldsToLoad, embedFields);
        }
        return fieldsToLoad;
    }

}
