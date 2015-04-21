package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

/**
 * Implementation of a SymbolGroupDAO using Hibernate.
 */
public class SymbolGroupDAOImpl implements SymbolGroupDAO {

    /** The SymbolDAO to use. */
    private final SymbolDAOImpl symbolDAO;

    /**
     * Constructor.
     * Creates a new SymbolDAOImpl for internal use.
     */
    public SymbolGroupDAOImpl() {
        this.symbolDAO = new SymbolDAOImpl();
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
    public List<SymbolGroup> getAll(long projectId, String... embedFields) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);

        if (project == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        List<SymbolGroup> resultList = session.createCriteria(SymbolGroup.class)
                                                .add(Restrictions.eq("project", project))
                                                .list();

        for (SymbolGroup group : resultList) {
            initLazyRelations(session, group, embedFields);
        }

        HibernateUtil.commitTransaction();
        return resultList;
    }

    @Override
    public SymbolGroup get(long projectId, Long groupId, String... embedFields) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);
        SymbolGroup result = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("project", project)
                                                    .using("id", groupId)
                                                    .load();

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("Could not find a group with the id " + groupId
                                             + " in the project " + projectId + ".");
        }

        initLazyRelations(session, result, embedFields);

        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(SymbolGroup group) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        checkConstrains(session, group); // will throw an ValidationException, if something is wrong

        SymbolGroup groupInDB = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                        .using("project", group.getProject())
                                                        .using("id", group.getId())
                                                        .load();
        if (groupInDB == null) {
            HibernateUtil.rollbackTransaction();
            throw new IllegalStateException("You can only update existing groups!");
        }

        // apply changes
        groupInDB.setName(group.getName());
        session.update(groupInDB);

        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(long projectId, Long groupId) throws IllegalArgumentException {
        SymbolGroup group = get(projectId, groupId, "all");

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

    private void initLazyRelations(Session session, SymbolGroup group, String... embedFields) {
        Set<String> fieldsToLoad = new HashSet<>();
        if (embedFields != null) {
            if (embedFields.length == 1 && "all".equals(embedFields[0])) {
                fieldsToLoad.add("completeSymbols");
            } else {
                for (String field : embedFields) {
                    fieldsToLoad.add(field);
                }
            }
        }

        if (fieldsToLoad.contains("completeSymbols")) {
            Hibernate.initialize(group.getSymbols());
            for (Symbol symbol : group.getSymbols()) {
                SymbolDAOImpl.loadLazyRelations(symbol);
            }
        } else if (fieldsToLoad.contains("symbols")) {
            List<IdRevisionPair> idRevisionPairs = symbolDAO.getIdRevisionPairs(session,
                                                                                group.getProjectId(),
                                                                                group.getId(),
                                                                                SymbolVisibilityLevel.ALL);
            List<Symbol> symbols = symbolDAO.getAll(session, group.getProjectId(), idRevisionPairs);
            group.setSymbols(new HashSet<>(symbols));
        } else {
            group.setSymbols(null);
        }
    }
}
