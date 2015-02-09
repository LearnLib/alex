package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.IdRevisionPair;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a SymbolDAO using Hibernate.
 */
public class SymbolDAOImpl implements SymbolDAO {

    @Override
    public void create(Symbol<?> symbol) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        try {
            // create the symbol
            create(session, symbol);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException |
                 org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            symbol.setId(0L);
            symbol.setRevision(0L);
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
    }

    @Override
    public void create(List<Symbol<?>> symbols) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        try {
            // create the symbol
            for (Symbol<?> symbol : symbols) {
                create(session, symbol);
            }
            HibernateUtil.commitTransaction();

            // error handling
        } catch (javax.validation.ConstraintViolationException |
                org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            for (Symbol<?> symbol : symbols) {
                symbol.setId(0L);
                symbol.setRevision(0L);
            }
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
    }

    private void create(Session session, Symbol<?> symbol) {
        // new symbols should have a project, not an id and not a revision
        if (symbol.getProject() == null || symbol.getId() > 0 || symbol.getRevision() > 0) {
            throw new ValidationException(
                    "To create a symbols it must have a Project but not haven an ID or and revision");
        }

        Project project = (Project) session.load(Project.class, symbol.getProjectId());

        // test for unique constrains
        checkUniqueConstrains(session, symbol); // will throw exception if the symbol is invalid

        // get the current highest symbol id in the project and add 1 for the next id
        long id = project.getNextSymbolId();
        project.setNextSymbolId(id + 1);
        session.update(project);

        // set id, project id and revision and save the symbol
        symbol.setId(id);
        symbol.setRevision(1L);
        project.addSymbol(symbol);

        symbol.beforeSave();
        session.save(symbol);
    }

    @Override
    public List<Symbol<?>> getAll(long projectId) {
        return getAll(projectId, Symbol.class);
    }

    @Override
    public List<Symbol<?>> getAll(long projectID, Class<? extends Symbol> type) {
        // subquery preparation to get a list of ids combined with their highest revision
        DetachedCriteria maxRevisions = DetachedCriteria.forClass(Symbol.class)
                                                        .add(Restrictions.eq("project.id", projectID))
                                                        .setProjection(Projections.projectionList()
                                                                .add(Projections.groupProperty("id"))
                                                                .add(Projections.max("revision"))
                                                        );

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // fetch the symbols of the project with the correct type & the latest revision
        @SuppressWarnings("unchecked") // should return a list of symbols
        List<Symbol<?>> result = session.createCriteria(type)
                                        .add(Restrictions.eq("project.id", projectID))
                                        .add(Restrictions.eq("deleted", false))
                                        .add(Subqueries.propertiesIn(new String[] {
                                                    "id",
                                                    "revision"
                                                }, maxRevisions))
                                        .addOrder(Order.asc("id"))
                                        .list();

        // load the lazy relations
        Hibernate.initialize(result.get(0).getProject());
        Hibernate.initialize(result.get(0).getProject().getResetSymbols());
        for (Symbol<?> s : result) {
            s.loadLazyRelations();
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public List<Symbol<?>> get(long projectId, List<IdRevisionPair> idRevPairs) {
        // prepare the subquerys for the id/ revision pairs
        Disjunction symbolIdRestrictions = Restrictions.disjunction();
        for (IdRevisionPair pair : idRevPairs) {
            symbolIdRestrictions.add(Restrictions.and(
                        Restrictions.eq("id", pair.getId()),
                        Restrictions.eq("revision", pair.getRevision())
                    ));
        }
        DetachedCriteria symbolIds = DetachedCriteria.forClass(Symbol.class)
                                                .add(Restrictions.eq("project.id", projectId))
                                                .add(symbolIdRestrictions)
                                                .setProjection(Projections.property("symbolId"));

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the symbols
        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Symbol<?>> result = session.createCriteria(Symbol.class)
                                        .add(Subqueries.propertyIn("symbolId", symbolIds))
                                        .list();

        // load the lazy relations
        for (Symbol<?> symb : result) {
            symb.loadLazyRelations();
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public Symbol<?> get(long projectId, long id) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get latest revision
        Long lastRevision = (Long) session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("id", id))
                                            .setProjection(Projections.max("revision"))
                                            .uniqueResult();
        HibernateUtil.commitTransaction();

        // no last revision -> no symbol -> return null
        if (lastRevision == null) {
            return null;
        }

        // fetch the symbol & return it, if it is not deleted
        Symbol<?> result = get(projectId, id, lastRevision);
        if (result.isDeleted()) {
            return null;
        } else {
            return result;
        }
    }

    @Override
    public Symbol<?> get(long projectId, long id, long revision) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the symbol
        Symbol<?> result = (Symbol<?>) session.createCriteria(Symbol.class)
                                              .add(Restrictions.eq("project.id", projectId))
                                              .add(Restrictions.eq("id", id))
                                              .add(Restrictions.eq("revision", revision))
                                              .uniqueResult();

        // load lazy relation
        if (result != null) {
            result.loadLazyRelations();
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public void update(Symbol<?> symbol) throws IllegalArgumentException, ValidationException {
        // checks for valid symbol
        if (symbol.getProjectId() == 0) {
            throw new IllegalArgumentException("Update failed: Project unknown.");
        }

        Symbol<?> symbolInDB = get(symbol.getProjectId(), symbol.getId());
        if (symbolInDB == null) {
            throw new IllegalArgumentException("Update failed: Symbol unknown.");
        }

        if (symbolInDB.isResetSymbol() && (!symbol.getName().equals("Reset")
                || !symbol.getAbbreviation().equals("reset"))) {
            throw new IllegalArgumentException("Update failed: A reset symbols must have the name 'Reset' and"
                    + "the abbreviation 'reset'.");
        }

        if (!symbolInDB.isResetSymbol() && (symbol.getName().equals("Reset")
                || symbol.getAbbreviation().equals("reset"))) {
            throw new IllegalArgumentException("Update failed: The name 'Reset' and the abbreviation 'reset' are"
                    + "reserved names for a reset symbol.");
        }

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // only allow update form the latest revision
        if (symbol.getRevision() != symbolInDB.getRevision()) {
            throw new IllegalArgumentException("Could not update the Symbol because you used an old revision.");
        }

        // update
        try {
            update(session, symbol);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException |
                 org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("Could not update the Symbol because it is not valid.", e);
        }
    }

    private void update(Session session, Symbol<?> symbol) {
        Project project = (Project) session.load(Project.class, symbol.getProjectId());

        // test for unique constrains
        checkUniqueConstrains(session, symbol); // will throw exception if the symbol is invalid

        // count revision up
        boolean resetSymbol = symbol.isResetSymbol(); // before we change anything, so that the symbol can be found
        symbol.setSymbolId(0);
        symbol.setRevision(symbol.getRevision() + 1);
        project.addSymbol(symbol);
        if (resetSymbol) {
            project.setResetSymbol(symbol);
            session.update(project);
        }

        symbol.beforeSave();
        session.save(symbol);
    }

    @Override
    public void hide(long projectId, long id) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        List<Symbol<?>> symbols = getSymbols(session, projectId, id);

        for (Symbol symbol : symbols) {
            symbol.loadLazyRelations();
            if (symbol.isResetSymbol()) {
                HibernateUtil.rollbackTransaction();
                throw new IllegalArgumentException("A reset symbol can never be marked as deleted.");
            }

            symbol.setDeleted(true);
            session.update(symbol);
        }

        // done
        HibernateUtil.commitTransaction();
    }

    @Override
    public void show(long projectId, long id) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        List<Symbol<?>> symbols = getSymbols(session, projectId, id);

        for (Symbol symbol : symbols) {
            symbol.setDeleted(false);
            session.update(symbol);
        }

        // done
        HibernateUtil.commitTransaction();
    }

    private List<Symbol<?>> getSymbols(Session session, Long projectId, Long symbolId) {
        List<Symbol<?>> symbols = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("id", symbolId))
                .list();

        if (symbols.size() == 0) {
            throw new IllegalArgumentException("Could not mark the symbol as deleted because it was not found.");
        }

        return symbols;
    }

    /**
     * Check the unique constrains of a symbol, e.g. a unique id, name or abbreviation per Project.
     * If the symbol is valid, nothing will happen, otherwise an exception will be thrown.
     * 
     * @param session
     *            The current session.
     * @param symbol
     *            The Symbol to check.
     * @throws IllegalArgumentException
     *             If the symbol faild the check.
     */
    private void checkUniqueConstrains(Session session, Symbol<?> symbol) throws IllegalArgumentException {
        // put constrains into a query
        @SuppressWarnings("unchecked") // should return list of symbols
        List<Symbol<?>> testList = session.createCriteria(symbol.getClass())
                                        .add(Restrictions.eq("project.id", symbol.getProjectId()))
                                        .add(Restrictions.ne("id", symbol.getId()))
                                        .add(Restrictions.disjunction()
                                                .add(Restrictions.eq("name", symbol.getName()))
                                                .add(Restrictions.eq("abbreviation", symbol.getAbbreviation())))
                                        .list();

        // if the query result is not empty, the constrains are violated.
        if (testList.size() > 0) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The name or the abbreviation of the symbol is already used in the project.");
        }
    }

}
