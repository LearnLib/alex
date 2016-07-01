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

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import de.learnlib.alex.utils.ValidationExceptionHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a SymbolGroupDAO using Hibernate.
 */
@Repository
public class SymbolGroupDAOImpl implements SymbolGroupDAO {

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
    public SymbolGroupDAOImpl(SymbolDAOImpl symbolDAO) {
        this.symbolDAO = symbolDAO;
    }

    @Override
    public void create(SymbolGroup group) throws ValidationException {
        // new groups should have a project and not have an id
        if (group.getProject() == null || group.getId() > 0) {
            throw new ValidationException(
                    "To create a SymbolGroup it must have a Project but must not have an id.");
        }

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            Project project = session.load(Project.class, group.getProjectId());

            // get the current highest group id in the project and add 1 for the next id
            long id = project.getNextGroupId();
            project.setNextGroupId(id + 1);
            session.update(project);

            group.setId(id);
            project.addGroup(group);

            session.save(group);
            HibernateUtil.commitTransaction();
        // error handling
        } catch (ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("SymbolGroup creation failed:", e);
            throw ValidationExceptionHelper.createValidationException("SymbolGroup was not created:", e);
        }
    }

    @Override
    public List<SymbolGroup> getAll(long userId, long projectId, EmbeddableFields... embedFields)
            throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = session.load(Project.class, projectId);
        User user = session.load(User.class, userId);

        if (project == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        List<SymbolGroup> resultList = session.createCriteria(SymbolGroup.class)
                                                .add(Restrictions.eq("user", user))
                                                .add(Restrictions.eq("project", project))
                                                .list();

        for (SymbolGroup group : resultList) {
            initLazyRelations(session, user, group, embedFields);
        }

        HibernateUtil.commitTransaction();
        return resultList;
    }

    @Override
    public SymbolGroup get(User user, long projectId, Long groupId, EmbeddableFields... embedFields)
            throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = session.load(Project.class, projectId);
        SymbolGroup result = session.byNaturalId(SymbolGroup.class)
                                                    .using("user", user)
                                                    .using("project", project)
                                                    .using("id", groupId)
                                                    .load();

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("Could not find a group with the id " + groupId
                                             + " in the project " + projectId + ".");
        }

        initLazyRelations(session, user, result, embedFields);

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(SymbolGroup group) throws NotFoundException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        SymbolGroup groupInDB = session.byNaturalId(SymbolGroup.class)
                                                        .using("user", group.getUser())
                                                        .using("project", group.getProject())
                                                        .using("id", group.getId())
                                                        .load();
        if (groupInDB == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("You can only update existing groups!");
        }

        try {
            // apply changes
            groupInDB.setName(group.getName());
            session.update(groupInDB);

            HibernateUtil.commitTransaction();
        // error handling
        } catch (ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            LOGGER.info("SymbolGroup update failed:", e);
            throw ValidationExceptionHelper.createValidationException("SymbolGroup was not updated:", e);
        }
    }

    @Override
    public void delete(User user, long projectId, Long groupId) throws IllegalArgumentException, NotFoundException {
        SymbolGroup group = get(user, projectId, groupId, EmbeddableFields.ALL);

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = session.load(Project.class, projectId);

        if (group.equals(project.getDefaultGroup())) {
            HibernateUtil.rollbackTransaction();
            throw new IllegalArgumentException("You can not delete the default group of a project.");
        }

        for (Symbol symbol : group.getSymbols()) {
            symbol.setGroup(project.getDefaultGroup());
            symbol.setHidden(true);
            session.update(symbol);
        }

        group.setSymbols(null);
        session.delete(group);
        HibernateUtil.commitTransaction();
    }

    private void initLazyRelations(Session session, User user, SymbolGroup group, EmbeddableFields... embedFields) {
        Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

        if (fieldsToLoad.contains(EmbeddableFields.COMPLETE_SYMBOLS)) {
            group.getSymbols().forEach(s -> symbolDAO.loadLazyRelations(session, s));
        } else if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
            try {
                List<IdRevisionPair> idRevisionPairs = symbolDAO.getIdRevisionPairs(session,
                                                                                    group.getUserId(),
                                                                                    group.getProjectId(),
                                                                                    group.getId(),
                                                                                    SymbolVisibilityLevel.ALL);
                List<Symbol> symbols = symbolDAO.getAll(session, user, group.getProjectId(), idRevisionPairs);
                group.setSymbols(new ArrayList<>(symbols));
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
}
