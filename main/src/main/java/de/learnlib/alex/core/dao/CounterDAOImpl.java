package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
public class CounterDAOImpl implements CounterDAO {

    @Override
    public void create(Counter counter) {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        Project project = (Project) session.load(Project.class, counter.getProjectId());
        project.getId();
        counter.setProject(project);

        session.save(counter);

        HibernateUtil.commitTransaction();
    }

    @Override
    public List<Counter> getAll(Long projectId) {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        @SuppressWarnings("Should always return a list of Counters.")
        List<Counter> result = session.createCriteria(Counter.class)
                                      .add(Restrictions.eq("project.id", projectId))
                                      .list();

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Counter get(Long projectId, String name) throws NoSuchElementException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();
        try {
            Counter result = get(session, projectId, name);

            HibernateUtil.commitTransaction();
            return result;
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private Counter get(Session session, Long projectId, String name) throws NoSuchElementException {
        @SuppressWarnings("Should always return a list of Counters.")
        Counter result = (Counter) session.createCriteria(Counter.class)
                                          .add(Restrictions.eq("project.id", projectId))
                                          .add(Restrictions.eq("name", name))
                                          .uniqueResult();

        if (result == null) {
            throw new NoSuchElementException("Could not find the counter with the name '" + name
                                           + "' in the project " + projectId + "!");
        }

        return result;
    }

    @Override
    public void update(Counter counter) throws NoSuchElementException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            Counter result = get(session, counter.getProjectId(), counter.getName());
            session.merge(counter);

            HibernateUtil.commitTransaction();
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public void delete(Long projectId, String name) throws NoSuchElementException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            Counter result = get(session, projectId, name);
            session.delete(result);

            HibernateUtil.commitTransaction();
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }
}
