package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
public class CounterDAOImpl implements CounterDAO {

    @Override
    public void create(Counter counter) throws ValidationException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();
        try {
            Project project = (Project) session.load(Project.class, counter.getProjectId());
            project.getId();
            counter.setProject(project);

            session.save(counter);

            HibernateUtil.commitTransaction();
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The counter could not be created because it is invalid.", e);
        }
    }

    @Override
    public List<Counter> getAll(Long projectId) throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        @SuppressWarnings("Should always return a list of Counters.")
        List<Counter> result = session.createCriteria(Counter.class)
                                      .add(Restrictions.eq("project.id", projectId))
                                      .list();

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Counter get(Long projectId, String name) throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();
        try {
            Counter result = get(session, projectId, name);

            HibernateUtil.commitTransaction();
            return result;
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private Counter get(Session session, Long projectId, String name) throws NotFoundException {
        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        @SuppressWarnings("Should always return a list of Counters.")
        Counter result = (Counter) session.createCriteria(Counter.class)
                                          .add(Restrictions.eq("project.id", projectId))
                                          .add(Restrictions.eq("name", name))
                                          .uniqueResult();

        if (result == null) {
            throw new NotFoundException("Could not find the counter with the name '" + name
                                           + "' in the project " + projectId + "!");
        }

        return result;
    }

    @Override
    public void update(Counter counter) throws NotFoundException, ValidationException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            Counter result = get(session, counter.getProjectId(), counter.getName());
            session.merge(counter);

            HibernateUtil.commitTransaction();
        } catch (HibernateException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("You cannot change the project or name of the counter.", e);
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public void delete(Long projectId, String name) throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            Counter result = get(session, projectId, name);
            session.delete(result);

            HibernateUtil.commitTransaction();
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }
}
