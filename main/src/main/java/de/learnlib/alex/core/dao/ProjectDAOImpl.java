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
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a ProjectDAO using Spring Data.
 */
@Service
public class ProjectDAOImpl implements ProjectDAO {

    /** Use the logger for the data part. */
    private static final Logger LOGGER = LogManager.getLogger("data");

    private ProjectRepository projectRepository;

    /** The SymbolDAO to use. */
    private SymbolDAO symbolDAO;

    /**
     * The constructor.
     *
     * @param symbolDAO
     *         The SymbolDAOImpl to use.
     */
    @Inject
    public ProjectDAOImpl(ProjectRepository projectRepository, SymbolDAO symbolDAO) {
        this.projectRepository = projectRepository;
        this.symbolDAO = symbolDAO;
    }

    @Override
    @Transactional
    public void create(final Project project) throws ValidationException {
        try {
            if (project.getGroups().size() == 0) { // create new project without existing groups
                SymbolGroup defaultGroup = new SymbolGroup();
                defaultGroup.setId(0L);
                defaultGroup.setName("Default Group");
                defaultGroup.setProject(project);
                defaultGroup.setUser(project.getUser());

                project.addGroup(defaultGroup);
                project.setDefaultGroup(defaultGroup);
                project.setNextGroupId(1L);
            } else {
                project.getGroups().forEach(group -> {
                    Long groupId = project.getNextGroupId();
                    group.setId(groupId);
                    project.setNextGroupId(groupId + 1);

                    group.setProject(project);
                    project.getGroups().add(group);
                    if (groupId.equals(0L)) {  // just assume that the first group is the default one
                        project.setDefaultGroup(group);
                    }

                    SymbolGroupDAOImpl.beforePersistGroup(group);
                });
            }

            projectRepository.save(project);
        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Project creation failed:", e);
            throw new javax.validation.ValidationException("Project could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Project creation failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Project was not created:", cve);
        }
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
    public Project getByName(Long userId, String projectName, EmbeddableFields... embedFields) throws NotFoundException {
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
        try {
            projectRepository.save(project);

        // error handling
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Project update failed:", e);
            throw new javax.validation.ValidationException("Project could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Project update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Project was not updated.", cve);
        }
    }

    @Override
    @Transactional
    public void delete(Long userId, Long projectId) throws NotFoundException {
        Project project = getByID(userId, projectId);

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

        // make sure that the "changes" of the project are never actually send to the db.
//        session.evict(project);
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
