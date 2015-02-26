package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
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

        try {
            session.save(project);
            createResetSymbolsFor(project);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw new javax.validation.ValidationException(
                    "The Project was not created because it did not pass the validation!", e);
        }
    }

    @Override
    public List<Project> getAll(String... embedFields) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the Projects
        @SuppressWarnings("unchecked") // it should be a list of Projects
        List<Project> result = session.createCriteria(Project.class).list();

        // load lazy relations
        for (Project p : result) {
            initLazyRelations(p, embedFields);
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Project getByID(long id, String... embedFields) {
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
        return result;
    }

    @Override
    public void update(Project project) throws IllegalArgumentException, ValidationException {
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
            throw new IllegalArgumentException("could not find the project, thus it is not updated.", e);
        } catch (javax.validation.ConstraintViolationException
                 | org.hibernate.exception.ConstraintViolationException e) {
            LOGGER.info("Project Update Failed:", e);
            HibernateUtil.rollbackTransaction();
            throw new javax.validation.ValidationException(
                    "The Project was not updated because it did not pass the validation!", e);
        }
    }

    @Override
    public void delete(long id) throws IllegalArgumentException {
        Project project = getByID(id, "all");

        if (project != null) {
            // start session
            Session session = HibernateUtil.getSession();
            HibernateUtil.beginTransaction();

            session.delete(project);
            HibernateUtil.commitTransaction();
        } else {
            throw new IllegalArgumentException("could not find the project, thus it is not deleted.");
        }
    }

    /**
     * Load objects that are connected with a project over a 'lazy' relation ship.
     *
     * @param project
     *         The project which needs the 'lazy' objects.
     */
    private void initLazyRelations(Project project, String... embedFields) {
        if (embedFields != null) {
            Set<String> foobar = new HashSet<>();
            if (embedFields.length == 1 && "all".equals(embedFields[0])) {
                foobar.add("symbols");
                foobar.add("resetSymbols");
                foobar.add("testResults");
            } else {
                for (String field : embedFields) {
                    foobar.add(field);
                }
            }

            if (foobar.contains("symbols")) {
                Hibernate.initialize(project.getSymbols());
                for (Symbol s : project.getSymbols()) {
                    s.loadLazyRelations();
                }
            } else {
                project.setSymbols(null);
            }

            if (foobar.contains("resetSymbols")) {
                Hibernate.initialize(project.getResetSymbols());
                for (Symbol s : project.getResetSymbols().values()) {
                    s.loadLazyRelations();
                }
            } else {
                project.setResetSymbol(null);
            }

            if (foobar.contains("testResults")) {
                Hibernate.initialize(project.getTestResults());
            } else {
                project.setTestResults(null);
            }
        } else {
            project.setSymbols(null);
            project.setResetSymbol(null);
            project.setTestResults(null);

        }
    }

    /**
     * Checks if a project with the given project id exists.
     *
     * @param projectId
     *         The project id to test.
     * @return true if the a project exits, false otherwise.
     */
    public static boolean isProjectIdValid(long projectId) {
        Session session = HibernateUtil.getSession();

        Long projectCount = (Long) session.createCriteria(Project.class)
                .add(Restrictions.eq("id", projectId))
                .setProjection(Projections.rowCount())
                .uniqueResult();

        return projectCount == 1;
    }

    private void createResetSymbolsFor(Project project) {
        long id = project.getNextSymbolId();

        // WEB
        WebSymbol webReset = new WebSymbol();
        webReset.setId(id);
        webReset.setRevision(1L);
        webReset.setName("Reset");
        webReset.setAbbreviation("reset");
        GotoAction webResetAction = new GotoAction();
        webResetAction.setUrl("/");
        webReset.addAction(webResetAction);
        project.addSymbol(webReset);
        project.setResetSymbol(webReset);

        // REST
        RESTSymbol restReset = new RESTSymbol();
        restReset.setId(id + 1);
        restReset.setRevision(1L);
        restReset.setName("Reset");
        restReset.setAbbreviation("reset");
        CallAction restResetAction = new CallAction();
        restResetAction.setUrl("/");
        restResetAction.setMethod(CallAction.Method.GET);
        restReset.addAction(restResetAction);
        project.addSymbol(restReset);
        project.setResetSymbol(restReset);

        project.setNextSymbolId(id + 2);
    }

}
