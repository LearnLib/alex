package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
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
    public List<SymbolGroup> getAll(long userId, long projectId, EmbeddableFields... embedFields) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);
        User user = (User) session.load(User.class, userId);

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

        Project project = (Project) session.load(Project.class, projectId);
        SymbolGroup result = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
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

        checkConstrains(session, group); // will throw an ValidationException, if something is wrong

        SymbolGroup groupInDB = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                        .using("user", group.getUser())
                .using("project", group.getProject())
                                                        .using("id", group.getId())
                                                        .load();
        if (groupInDB == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("You can only update existing groups!");
        }

        // apply changes
        groupInDB.setName(group.getName());
        session.update(groupInDB);

        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(User user, long projectId, Long groupId) throws IllegalArgumentException, NotFoundException {
        SymbolGroup group = get(user, projectId, groupId, EmbeddableFields.ALL);

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.load(Project.class, projectId);

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

    private void checkConstrains(Session session, SymbolGroup group) throws ValidationException {
        List<SymbolGroup> constrainsTestList = session.createCriteria(SymbolGroup.class)
                                                        .add(Restrictions.eq("user", group.getUser()))
                                                        .add(Restrictions.eq("project", group.getProject()))
                                                        .add(Restrictions.eq("name", group.getName()))
                                                        .list();

        if (!constrainsTestList.isEmpty()) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The group name must be unique per project.");
        }
    }

    private void initLazyRelations(Session session, User user, SymbolGroup group, EmbeddableFields... embedFields) {
        Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

        if (fieldsToLoad.contains(EmbeddableFields.COMPLETE_SYMBOLS)) {
            group.getSymbols();
            group.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
        } else if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
            try {
                List<IdRevisionPair> idRevisionPairs = symbolDAO.getIdRevisionPairs(session,
                                                                                    group.getUserId(),
                                                                                    group.getProjectId(),
                                                                                    group.getId(),
                                                                                    SymbolVisibilityLevel.ALL);
                List<Symbol> symbols = symbolDAO.getAll(session, user, group.getProjectId(), idRevisionPairs);
                group.setSymbols(new HashSet<>(symbols));
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
