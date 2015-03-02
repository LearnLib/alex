package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
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

        Project project = (Project) session.load(Project.class, group.getProjectId());

        List<SymbolGroup> constrainsTestList = session.createCriteria(SymbolGroup.class)
                                                        .add(Restrictions.eq("project", group.getProject()))
                                                        .add(Restrictions.eq("name", group.getName()))
                                                        .list();

        if (!constrainsTestList.isEmpty()) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The group name must be unique per project.");
        }

        // get the current highest group id in the project and add 1 for the next id
        long id = project.getNextGroupId();
        project.setNextGroupId(id + 1);
        session.update(project);

        group.setId(id);
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

        for (SymbolGroup group : resultList) {
            Hibernate.initialize(group.getSymbols());
            for (Symbol symbol : group.getSymbols()) {
                symbol.loadLazyRelations();
            }
        }

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

        Hibernate.initialize(result.getSymbols());
        for (Symbol symbol : result.getSymbols()) {
            symbol.loadLazyRelations();
        }

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(SymbolGroup group) throws IllegalArgumentException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        session.update(group);

        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(long projectId, Long groupId) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        SymbolGroup group = get(projectId, groupId);
        Project project = (Project) session.load(Project.class, projectId);

        if (group.equals(project.getDefaultGroup())) {
            HibernateUtil.rollbackTransaction();
            throw new IllegalArgumentException("you can not delete the default group of a project.");
        }

        for (Symbol symbol : group.getSymbols()) {
            symbol.setGroup(project.getDefaultGroup());
            session.update(symbol);
        }

        session.delete(group);
        HibernateUtil.commitTransaction();
    }
}
