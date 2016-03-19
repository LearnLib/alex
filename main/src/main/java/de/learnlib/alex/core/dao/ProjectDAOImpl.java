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
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import de.learnlib.alex.utils.ValidationExceptionHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a ProjectDAO using Hibernate.
 */
@Repository
public class ProjectDAOImpl implements ProjectDAO {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The SymbolDAO to use. */
    private SymbolDAOImpl symbolDAO;

    /**
     * The constructor.
     *
     * @param symbolDAO
     *         The SymbolDAOImpl to use.
     */
    @Inject
    public ProjectDAOImpl(SymbolDAOImpl symbolDAO) {
        this.symbolDAO = symbolDAO;
    }

    @Override
    public void create(Project project) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {

            // TODO: fix this branch with multi user
            if (project.getGroups().size() > 0) { // create new project from json with existing groups
                Integer i = 0;
                for (SymbolGroup group: project.getGroups()) {
                    Long groupId = project.getNextGroupId();

                    if (i.equals(0)) {  // just assume that the first group is the default one
                        project.setDefaultGroup(group);
                    } else {
                        group.setId(groupId);
                        project.setNextGroupId(groupId + 1);
                    }
                    group.setProject(project);

                    if (group.getSymbols().size() > 0) {
                        for (Symbol symbol: group.getSymbols()) {
                            Long symbolId = project.getNextSymbolId();
                            symbol.setProject(project);
                            symbol.setGroup(group);
                            symbol.setRevision(0L);
                            symbol.setId(symbolId);
                            project.setNextSymbolId(symbolId + 1);
                        }
                    }
                    i++;
                }
            } else {
                SymbolGroup defaultGroup = new SymbolGroup();
                defaultGroup.setName("Default Group");
                defaultGroup.setProject(project);
                defaultGroup.setUser(project.getUser());
                project.addGroup(defaultGroup);
                project.setDefaultGroup(defaultGroup);

                for (Symbol symbol : project.getSymbols()) {
                    long nextSymbolId = project.getNextSymbolId();
                    symbol.setId(nextSymbolId);
                    symbol.setRevision(0L);
                    symbol.setProject(project);
                    symbol.setUser(project.getUser());
                    if (symbol.getGroup() == null) {
                        symbol.setGroup(defaultGroup);
                    }
                    project.setNextSymbolId(nextSymbolId + 1);
                }
            }

            session.save(project);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("Project creation failed:", e);
            throw ValidationExceptionHelper.createValidationException("Project was not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("Project creation failed:", e);
            throw new javax.validation.ValidationException(
                    "The Project was not created: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Project> getAll(User user, EmbeddableFields... embedFields) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the Projects
        @SuppressWarnings("unchecked") // it should be a list of Projects
        List<Project> result = session.createCriteria(Project.class)
                                      .add(Restrictions.eq("user", user))
                                      .list();

        // load lazy relations
        for (Project p : result) {
            initLazyRelations(p, session, embedFields);
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Project getByID(Long userId, Long projectId, EmbeddableFields... embedFields) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the Project
        Project result = session.get(Project.class, projectId);

        // load lazy relations
        if (result != null) {
            initLazyRelations(result, session, embedFields);
        }

        // done
        HibernateUtil.commitTransaction();

        if (result == null) {
            throw new NotFoundException("Could not find the project with the id " + projectId + ".");
        }
        return result;
    }

    @Override
    public Project getByName(Long userId, String projectName) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project result = (Project) session.createCriteria(Project.class)
                                          .add(Restrictions.eq("user.id", userId))
                                          .add(Restrictions.eq("name", projectName))
                                          .uniqueResult();

        HibernateUtil.commitTransaction();

        return result;
    }

    @Override
    public void update(Project project) throws NotFoundException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            Project projectInDB = session.load(Project.class, project.getId());

            // apply changes
            projectInDB.setName(project.getName());
            projectInDB.setBaseUrl(project.getBaseUrl());
            projectInDB.setDescription(project.getDescription());

            session.update(projectInDB);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (ObjectNotFoundException e) {
            LOGGER.info("Project update failed:", e);
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("Could not find the project with the id " + project.getId() + ".", e);
        } catch (javax.validation.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("Project update failed:", e);
            throw ValidationExceptionHelper.createValidationException("Project was not updated:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("Project update failed:", e);
            throw new javax.validation.ValidationException(
                    "The Project was not updated: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(Long userId, Long projectId) throws NotFoundException {
        Project project = getByID(userId, projectId, EmbeddableFields.ALL);

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        for (SymbolGroup group : project.getGroups()) {
            group.getSymbols().forEach(session::delete);
        }

        session.delete(project);
        HibernateUtil.commitTransaction();
    }

    /**
     * Load objects that are connected with a project over a 'lazy' relation ship.
     * @param project
     *         The project which needs the 'lazy' objects.
     * @param session
     *
     */
    private void initLazyRelations(Project project, Session session, EmbeddableFields... embedFields) {
        if (embedFields != null && embedFields.length > 0) {
            Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

            if (fieldsToLoad.contains(EmbeddableFields.GROUPS)) {
                project.getGroups().forEach(group -> group.getSymbols()
                                                          .forEach(s -> symbolDAO.loadLazyRelations(session, s)));
            } else {
                project.setGroups(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.DEFAULT_GROUP)) {
                project.getDefaultGroup().getSymbols().forEach(s -> symbolDAO.loadLazyRelations(session, s));
            } else {
                project.setDefaultGroup(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
                project.getSymbols().forEach(s -> symbolDAO.loadLazyRelations(session, s));
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
        session.evict(project);
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
