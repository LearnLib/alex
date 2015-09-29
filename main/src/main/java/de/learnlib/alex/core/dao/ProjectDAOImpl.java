package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a ProjectDAO using Hibernate.
 */
public class ProjectDAOImpl implements ProjectDAO {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    @Override
    public void create(Project project) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        System.out.println("===============================");
        System.out.println("Project User: " + project.getUser() + " (" + project.getUserId() + ")");
        System.out.println("===============================");

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
                System.out.println("#### creating Default Group");
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
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            e.printStackTrace();
            throw new javax.validation.ValidationException(
                    "The Project was not created because it did not pass the validation!", e);
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
            initLazyRelations(p, embedFields);
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Project getByID(long id, EmbeddableFields... embedFields) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the Project
        Project result = (Project) session.get(Project.class, id);

        // load lazy relations
        if (result != null) {
            initLazyRelations(result, embedFields);
        }

        // done
        HibernateUtil.commitTransaction();

        if (result == null) {
            throw new NotFoundException("Could not find the project with the id " + id + ".");
        }
        return result;
    }

    @Override
    public void update(Project project) throws NotFoundException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            Project projectInDB = (Project) session.load(Project.class, project.getId());

            // apply changes
            projectInDB.setName(project.getName());
            projectInDB.setBaseUrl(project.getBaseUrl());
            projectInDB.setDescription(project.getDescription());

            session.update(projectInDB);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (ObjectNotFoundException e) {
            LOGGER.info("Project Update Failed:", e);
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("Could not find the project with the id " + project.getId() + ".", e);
        } catch (javax.validation.ConstraintViolationException
                 | org.hibernate.exception.ConstraintViolationException e) {
            LOGGER.info("Project Update Failed:", e);
            HibernateUtil.rollbackTransaction();
            throw new javax.validation.ValidationException(
                    "The Project was not updated because it did not pass the validation!", e);
        }
    }

    @Override
    public void delete(long id) throws NotFoundException {
        Project project = getByID(id, EmbeddableFields.ALL);

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
     *
     * @param project
     *         The project which needs the 'lazy' objects.
     */
    private void initLazyRelations(Project project, EmbeddableFields... embedFields) {
        if (embedFields != null && embedFields.length > 0) {
            Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

            if (fieldsToLoad.contains(EmbeddableFields.GROUPS)) {
                project.getGroups().forEach(group -> group.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations));
            } else {
                project.setGroups(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.DEFAULT_GROUP)) {
                project.getDefaultGroup();
                if (project.getDefaultGroup() != null) {
                    project.getDefaultGroup().getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
                }
            } else {
                project.setDefaultGroup(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
                project.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
            } else {
                project.setSymbols(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.TEST_RESULTS)) {
                project.getTestResults();
            } else {
                project.setTestResults(null);
            }
        } else {
            project.setGroups(null);
            project.setDefaultGroup(null);
            project.setSymbols(null);
            project.setTestResults(null);
        }
    }

    private Set<EmbeddableFields> fieldsArrayToHashSet(EmbeddableFields[] embedFields) {
        Set<EmbeddableFields> fieldsToLoad = new HashSet<>();
        if (Arrays.asList(embedFields).contains(EmbeddableFields.ALL)) {
            fieldsToLoad.add(EmbeddableFields.GROUPS);
            fieldsToLoad.add(EmbeddableFields.DEFAULT_GROUP);
            fieldsToLoad.add(EmbeddableFields.SYMBOLS);
            fieldsToLoad.add(EmbeddableFields.TEST_RESULTS);
        } else {
            Collections.addAll(fieldsToLoad, embedFields);
        }
        return fieldsToLoad;
    }

    /**
     * Checks if a project with the given project id exists.
     *
     * @param projectId
     *         The project id to test.
     * @return true if the a project exits, false otherwise.
     */
    public static boolean isProjectIdInvalid(long projectId) {
        Session session = HibernateUtil.getSession();

        Long projectCount = (Long) session.createCriteria(Project.class)
                                            .add(Restrictions.eq("id", projectId))
                                            .setProjection(Projections.rowCount())
                                            .uniqueResult();

        return projectCount == 0;
    }

}
