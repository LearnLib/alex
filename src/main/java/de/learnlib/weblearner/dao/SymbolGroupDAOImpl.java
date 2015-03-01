package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

public class SymbolGroupDAOImpl implements SymbolGroupDAO {

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

        // get the current highest group id in the project and add 1 for the next id
        Long highestId = (Long) session.createCriteria(SymbolGroup.class)
                                        .add(Restrictions.eq("project", group.getProject()))
                                        .setProjection(Projections.max("id"))
                                        .uniqueResult();
        if (highestId == null) {
            highestId = 0L;
        }
        Long nextId = highestId + 1;

        group.setId(nextId);

        Project project = (Project) session.load(Project.class, group.getProjectId());
        project.addGroup(group);

        session.save(group);
        HibernateUtil.commitTransaction();
    }

    @Override
    public List<SymbolGroup> getAll(long projectId) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<SymbolGroup> resultList = session.createCriteria(SymbolGroup.class)
                                                .add(Restrictions.eq("project.id", projectId))
                                                .list();

        HibernateUtil.commitTransaction();
        return resultList;
    }

    @Override
    public SymbolGroup get(long projectId, Long groupId) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        SymbolGroup result = (SymbolGroup) session.createCriteria(SymbolGroup.class)
                                                    .add(Restrictions.eq("project.id", projectId))
                                                    .add(Restrictions.eq("id", groupId))
                                                    .uniqueResult();

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(SymbolGroup group) throws IllegalArgumentException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();


        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(long projectId, Long groupId) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        SymbolGroup group = get(projectId, groupId);
        session.delete(group);

        HibernateUtil.commitTransaction();
    }
}
