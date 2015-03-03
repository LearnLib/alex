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
import java.util.NoSuchElementException;

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

        checkConstrains(session, group); // will throw an ValidationException, if something is wrong

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
    public List<SymbolGroup> getAll(long projectId) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);

        if(project == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        List<SymbolGroup> resultList = session.createCriteria(SymbolGroup.class)
                                                .add(Restrictions.eq("project", project))
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
    public SymbolGroup get(long projectId, Long groupId) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        SymbolGroup result = (SymbolGroup) session.createCriteria(SymbolGroup.class)
                                                    .add(Restrictions.eq("project.id", projectId))
                                                    .add(Restrictions.eq("id", groupId))
                                                    .uniqueResult();

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("Could not find a group with the id " + groupId
                                                     + " in the project "+ projectId + ".");
        }

        Hibernate.initialize(result.getSymbols());
        for (Symbol symbol : result.getSymbols()) {
            symbol.loadLazyRelations();
        }

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(SymbolGroup group) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        checkConstrains(session, group); // will throw an ValidationException, if something is wrong

        SymbolGroup groupInDB = (SymbolGroup) session.createCriteria(SymbolGroup.class)
                                                        .add(Restrictions.eq("project.id", group.getProjectId()))
                                                        .add(Restrictions.eq("id", group.getId()))
                                                        .uniqueResult();
        if (groupInDB == null) {
            HibernateUtil.rollbackTransaction();
            throw new IllegalStateException("You can only update existing groups!");
        }

        // apply changes
        session.merge(group);
        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(long projectId, Long groupId) throws IllegalArgumentException {
        SymbolGroup group = get(projectId, groupId);

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);

        if (group.equals(project.getDefaultGroup())) {
            HibernateUtil.rollbackTransaction();
            throw new IllegalArgumentException("you can not delete the default group of a project.");
        }

        for (Symbol symbol : group.getSymbols()) {
            symbol.setGroup(project.getDefaultGroup());
            symbol.setHidden(true);
            session.update(symbol);
        }

        session.delete(group);
        HibernateUtil.commitTransaction();
    }

    private void checkConstrains(Session session, SymbolGroup group) throws ValidationException {
        List<SymbolGroup> constrainsTestList = session.createCriteria(SymbolGroup.class)
                                                        .add(Restrictions.eq("project", group.getProject()))
                                                        .add(Restrictions.eq("name", group.getName()))
                                                        .list();

        if (!constrainsTestList.isEmpty()) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The group name must be unique per project.");
        }
    }
}
