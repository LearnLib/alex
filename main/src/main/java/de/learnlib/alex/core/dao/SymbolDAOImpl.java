/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.dao;

import de.learnlib.alex.actions.ExecuteSymbolAction;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Junction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.springframework.stereotype.Repository;

import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Implementation of a SymbolDAO using Hibernate.
 */
@Repository
public class SymbolDAOImpl implements SymbolDAO {

    @Override
    public void create(Symbol symbol) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        try {
            // create the symbol
            create(session, symbol);
            setExecuteToSymbols(session, symbol);
            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException
                 | org.hibernate.exception.ConstraintViolationException
                 | IllegalStateException e) {
            HibernateUtil.rollbackTransaction();
            symbol.setId(null);
            symbol.setRevision(null);
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            symbol.setId(null);
            symbol.setRevision(null);
            throw new ValidationException("Could not create a symbol because it has a reference to another"
                                                  + " unknown symbol.", e);
        }
    }

    @Override
    public void create(List<Symbol> symbols) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        try {
            // create the symbol
            symbols.forEach(s -> create(session, s));

            // set execute symbols
            Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
            symbols.forEach(s -> symbolMap.put(s.getIdRevisionPair(), s));
            for (Symbol symbol : symbols) {
                setExecuteToSymbols(session, symbol, symbolMap);
            }

            HibernateUtil.commitTransaction();
        // error handling
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not create a symbol because it has a reference to another"
                                                  + " unknown symbol.", e);
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException
                | IllegalStateException e) {
            HibernateUtil.rollbackTransaction();
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not create symbol because it was invalid.", e);
        }
    }

    private void create(Session session, Symbol symbol) {
        // new symbols should have a project, not an id and not a revision
        if (symbol.getProject() == null || symbol.getId() != null || symbol.getRevision() != null) {
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

        SymbolGroup group = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("user", symbol.getUser())
                                                    .using("project", project)
                                                    .using("id", symbol.getGroupId())
                                                    .load();
        if (group == null) {
            throw new ValidationException("The specified group was not found and thus the Symbol was not created.");
        }
        group.addSymbol(symbol);

        beforeSymbolSave(symbol);

        session.save(symbol);
    }

    @Override
    public List<Symbol> getAll(User user, Long projectId, List<IdRevisionPair> idRevPairs) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<Symbol> result = getAll(session, user, projectId, idRevPairs);

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    /**
     * Like {@link #getAll(User, Long, List)}, but use a given Hibernate session.
     * @param session The session to use.
     * @param user The owner of the Symbols.
     * @param projectId The project the symbols should belong to.
     * @param idRevPairs A list of pairs of an ID and revisions to specify the expected symbols.
     * @return A list of symbols matching the project and list of IDs and revisions.
     * @throws NotFoundException If the project or one of the symbols could not be found.
     */
    List<Symbol> getAll(Session session, User user, Long projectId, List<IdRevisionPair> idRevPairs)
            throws NotFoundException {
        // no DB interaction if no symbols are requested
        if (idRevPairs.isEmpty()) {
            return new LinkedList<>();
        }

        // prepare the subquerys for the id/ revision pairs
        Disjunction symbolIdRestrictions = Restrictions.disjunction();
        for (IdRevisionPair pair : idRevPairs) {
            symbolIdRestrictions.add(Restrictions.eq("idRevisionPair", pair));
        }
        DetachedCriteria symbolIds = DetachedCriteria.forClass(Symbol.class)
                                                        .add(Restrictions.eq("user.id", user.getId()))
                                                        .add(Restrictions.eq("project.id", projectId))
                                                        .add(symbolIdRestrictions)
                                                        .setProjection(Projections.property("symbolId"));

        // get the symbols
        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Symbol> result = session.createCriteria(Symbol.class)
                                        .add(Subqueries.propertyIn("symbolId", symbolIds))
                                        .addOrder(Order.asc("idRevisionPair.id"))
                                        .list();

        if (result.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                + " with the group ids and revisions" + idRevPairs + ".");
        }

        // load the lazy relations
        result.forEach(SymbolDAOImpl::loadLazyRelations);
        return result;
    }

    @Override
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId, Long groupId) throws NotFoundException {
        return getAllWithLatestRevision(user, projectId, groupId, SymbolVisibilityLevel.VISIBLE);
    }

    @Override
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId,
                                                 Long groupId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<IdRevisionPair> idRevPairs = getIdRevisionPairs(session, user.getId(), projectId,
                                                             groupId, visibilityLevel);

        HibernateUtil.commitTransaction();

        if (idRevPairs.isEmpty()) {
            return new LinkedList<>();
        }
        return getAll(user, projectId, idRevPairs);
    }

    /**
     * Get a List of IdRevisionPairs that describes all Symbols within a specific group,
     * using the given Hibernate session.
     *
     * @param session
     *         The Session to use.
     * @param userId
     *         The owner of the Symbols.
     * @param projectId
     *         The Project that the Symbols are part of.
     * @param groupId
     *         The Group in which the Symbols are in.
     * @param visibilityLevel
     *         The visibility level of the Symbols.
     * @return A List of IdRevisionPairs to represent the Symbols within a group.
     * @throws NotFoundException
     *         If the group could not be found.
     */
    List<IdRevisionPair> getIdRevisionPairs(Session session, Long userId, Long projectId,
                                            Long groupId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        SymbolGroup group = (SymbolGroup) session.createCriteria(SymbolGroup.class)
                                                    .add(Restrictions.eq("user.id", userId))
                                                    .add(Restrictions.eq("project.id", projectId))
                                                    .add(Restrictions.eq("id", groupId))
                                                    .uniqueResult();

        if (group == null) {
            throw new NotFoundException("Could not find the group with the id " + groupId
                                                + " in the project " + projectId + ". ");
        }

        // get latest revision
        List<Object[]> idRevList = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("user.id", userId))
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("group", group))
                                            .add(visibilityLevel.getCriterion())
                                            .setProjection(Projections.projectionList()
                                                               .add(Projections.groupProperty("idRevisionPair.id"))
                                                               .add(Projections.max("idRevisionPair.revision")))
                                            .list();

        if (idRevList.isEmpty()) {
            return new LinkedList<>();
        }

        return createIdRevisionPairList(idRevList);
    }


    @Override
    public List<Symbol> getByIdsWithLatestRevision(User user, Long projectId, Long... ids) throws NotFoundException {
        return getByIdsWithLatestRevision(user, projectId, SymbolVisibilityLevel.ALL, ids);
    }

    @Override
    public List<Symbol> getByIdsWithLatestRevision(User user, Long projectId, SymbolVisibilityLevel visibilityLevel,
                                                   Long... ids) throws NotFoundException {
        try {
            // start session
            Session session = HibernateUtil.getSession();
            HibernateUtil.beginTransaction();

            return getByIdsWithLatestRevision(session, user, projectId, visibilityLevel, ids);
        } finally {
            HibernateUtil.commitTransaction();
        }
    }

    /**
     * Get a list of Symbols, like {@link #getByIdsWithLatestRevision(User, Long, SymbolVisibilityLevel, Long...)},
     * but use a given Hibernate session.
     *
     * @param session
     *         The session to use.
     * @param user
     *         The owner of the Symbols.
     * @param projectId
     *         The Project the Symbols are part of.
     * @param visibilityLevel
     *         The visibility level to check.
     * @param ids
     *         The IDs of the Symbols to fetch.
     * @return The List of Symbols fulfilling all the above criteria.
     * @throws NotFoundException
     *         If no symbol was found.
     */
    public List<Symbol> getByIdsWithLatestRevision(Session session, User user, Long projectId,
                                                   SymbolVisibilityLevel visibilityLevel, Long... ids)
            throws NotFoundException {
        // get latest revision
        @SuppressWarnings("unchecked") // should return a list of objects arrays which contain 2 Long values.
        List<Object[]> idRevList = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("user", user))
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.in("idRevisionPair.id", ids))
                                            .add(visibilityLevel.getCriterion())
                                            .setProjection(Projections.projectionList()
                                                                   .add(Projections.groupProperty("idRevisionPair.id"))
                                                                   .add(Projections.max("idRevisionPair.revision"))
                                            ).list();

        List<IdRevisionPair> idRevPairs = createIdRevisionPairList(idRevList);

        if (idRevPairs.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                     + " with the ids " + Arrays.toString(ids) + ".");
        }
        return getAll(session, user, projectId, idRevPairs);
    }

    @Override
    public List<Symbol> getAllWithLatestRevision(User user, Long projectId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Project project = (Project) session.get(Project.class, projectId);
        if (project == null) {
            throw new NotFoundException("Could not find the project with the id " + projectId + ".");
        }

        @SuppressWarnings("unchecked") // should return a list of Symbols
        List<Long> ids = session.createCriteria(Symbol.class)
                                    .add(Restrictions.eq("project", project))
                                    .add(Restrictions.eq("user", user))
                                    .setProjection(Projections.property("idRevisionPair.id"))
                                    .list();

        HibernateUtil.commitTransaction();

        if (ids.isEmpty()) {
            return new LinkedList<>();
        }
        return getByIdsWithLatestRevision(user, projectId, visibilityLevel, ids.toArray(new Long[ids.size()]));
    }

    @Override
    public Symbol get(User user, Long projectId, IdRevisionPair idRevisionPair) throws NotFoundException {
        List<IdRevisionPair> idRevisionList =  new LinkedList<>();
        idRevisionList.add(idRevisionPair);
        List<Symbol> resultList = getAll(user, projectId, idRevisionList);

        if (resultList.isEmpty()) {
            throw new NotFoundException("Could not find a symbol in the project " + projectId
                                                     + " with the id and revision " + idRevisionPair + ".");
        }
        return resultList.get(0);
    }

    @Override
    public Symbol get(User user, Long projectId, Long id, Long revision) throws NotFoundException {
        IdRevisionPair idRevisionPair = new IdRevisionPair(id, revision);
        return get(user, projectId, idRevisionPair);
    }

    @Override
    public Symbol getWithLatestRevision(User user, Long projectId, Long id) throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        Symbol result = getWithLatestRevision(session, user, projectId, id);

        HibernateUtil.commitTransaction();
        return result;
    }

    private Symbol getWithLatestRevision(Session session, User user, Long projectId, Long id) throws NotFoundException {
        List<Symbol> resultList = getByIdsWithLatestRevision(session, user, projectId, SymbolVisibilityLevel.ALL, id);

        if (resultList.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                     + " with the id " + id + ".");
        }
        return resultList.get(0);
    }

    @Override
    public List<Symbol> getWithAllRevisions(User user, Long projectId, Long id) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked") // should return a list of revisions (type: Long)
        List<Long> revisions = session.createCriteria(Symbol.class)
                                        .add(Restrictions.eq("project.id", projectId))
                                        .add(Restrictions.eq("user", user))
                                        .add(Restrictions.eq("idRevisionPair.id", id))
                                        .setProjection(Projections.property("idRevisionPair.revision"))
                                        .addOrder(Order.asc("idRevisionPair.revision"))
                                        .list();

        HibernateUtil.commitTransaction();

        if (revisions.isEmpty()) {
            throw new NotFoundException("Could not find symbols in the project " + projectId
                                                     + " with the id " + id + ".");
        }

        List<IdRevisionPair> idRevisionList =  new LinkedList<>();
        revisions.forEach(revision -> idRevisionList.add(new IdRevisionPair(id, revision)));

        return getAll(user, projectId, idRevisionList);
    }

    @Override
    public void update(Symbol symbol) throws IllegalArgumentException, NotFoundException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        try {
            update(session, symbol);
            setExecuteToSymbols(session, symbol);

            HibernateUtil.commitTransaction();

        // error handling
        } catch (javax.validation.ConstraintViolationException
                 | org.hibernate.exception.ConstraintViolationException
                 | IllegalStateException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("Could not update the Symbol because it is not valid.", e);
        } catch (IllegalArgumentException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    @Override
    public void update(List<Symbol> symbols) throws IllegalArgumentException, NotFoundException, ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        try {
            for (Symbol symbol : symbols) {
                update(session, symbol);
            }

            Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
            symbols.forEach(s -> symbolMap.put(s.getIdRevisionPair(), s));
            for (Symbol symbol : symbols) {
                setExecuteToSymbols(session, symbol, symbolMap);
            }

            HibernateUtil.commitTransaction();

            // error handling
        } catch (javax.validation.ConstraintViolationException
                | org.hibernate.exception.ConstraintViolationException
                | IllegalStateException e) {
            HibernateUtil.rollbackTransaction();
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new ValidationException("Could not update the Symbols because one is not valid.", e);
        } catch (IllegalArgumentException e) {
            HibernateUtil.rollbackTransaction();
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw e;
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            symbols.forEach(s -> {
                s.setId(null);
                s.setRevision(null);
            });
            throw new NotFoundException("Could not update the Symbol because it was nowhere to be found.", e);
        }
    }

    private void update(Session session, Symbol symbol) throws IllegalArgumentException, NotFoundException {
        // checks for valid symbol
        if (symbol.getProjectId() == null) {
            throw new NotFoundException("Update failed: Could not find the project with the id + "
                                                + symbol.getProjectId() + ".");
        }

        Symbol symbolInDB;
        try {
            symbolInDB = getWithLatestRevision(session, symbol.getUser(), symbol.getProjectId(), symbol.getId());
        } catch (NotFoundException e) {
            throw new NotFoundException("Update failed: Could not find the symbols with the id " + symbol.getId()
                                                + " in the project " + symbol.getProjectId() + ".");
        }

        // only allow update form the latest revision
        if (!Objects.equals(symbol.getRevision(), symbolInDB.getRevision())) {
            throw new IllegalArgumentException("Update failed: You used an old revision for the symbol "
                                                       + symbol.getId() + " in the project "
                                                       + symbol.getProjectId() + ".");
        }

        // test for unique constrains
        checkUniqueConstrains(session, symbol); // will throw exception if the symbol is invalid

        SymbolGroup oldGroup = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("user", symbol.getUser())
                                                    .using("project", symbol.getProject())
                                                    .using("id", symbolInDB.getGroupId())
                                                    .load();
        SymbolGroup newGroup = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("user", symbol.getUser())
                                                    .using("project", symbol.getProject())
                                                    .using("id", symbol.getGroupId())
                                                    .load();

        // count revision up
        symbol.setSymbolId(0L);
        symbol.setRevision(symbol.getRevision() + 1);
        symbol.setGroup(newGroup);

        beforeSymbolSave(symbol);

        session.save(symbol);

        // update group
        if (!newGroup.equals(oldGroup)) {
            List<Symbol> symbols = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("user", symbol.getUser()))
                                            .add(Restrictions.eq("project", symbol.getProject()))
                                            .add(Restrictions.eq("idRevisionPair.id", symbol.getId()))
                                            .list();
            symbols.remove(symbol);

            symbols.forEach(newGroup::addSymbol);
        }
    }

    @Override
    public void move(Symbol symbol, Long newGroupId) throws NotFoundException {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            move(session, symbol, newGroupId);

            HibernateUtil.commitTransaction();
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public void move(List<Symbol> symbols, Long newGroupId) throws NotFoundException  {
        HibernateUtil.beginTransaction();
        Session session = HibernateUtil.getSession();

        try {
            for (Symbol s : symbols) {
                move(session, s, newGroupId);
            }
            HibernateUtil.commitTransaction();
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private void move(Session session, Symbol symbol, Long newGroupId) throws NotFoundException {
        SymbolGroup oldGroup = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("user", symbol.getUser())
                                                    .using("project", symbol.getProject())
                                                    .using("id", symbol.getGroupId())
                                                    .load();
        SymbolGroup newGroup = (SymbolGroup) session.byNaturalId(SymbolGroup.class)
                                                    .using("user", symbol.getUser())
                                                    .using("project", symbol.getProject())
                                                    .using("id", newGroupId)
                                                    .load();

        if (newGroup == null) {
            throw new NotFoundException("The group with the id " + newGroupId + " does not exist!");
        }

        if (!newGroup.equals(oldGroup)) {
            List<Symbol> symbols = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("user", symbol.getUser()))
                                            .add(Restrictions.eq("project", symbol.getProject()))
                                            .add(Restrictions.eq("idRevisionPair.id", symbol.getId()))
                                            .list();
            symbols.forEach(newGroup::addSymbol);
        }
    }

    @Override
    public void hide(Long userId, Long projectId, Long... ids) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        try {
            for (Long id : ids) {
                List<Symbol> symbols = getSymbols(session, userId, projectId, id);

                hideSymbols(session, symbols);
            }
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw  e;
        }

        // done
        HibernateUtil.commitTransaction();
    }

    private void hideSymbols(Session session, List<Symbol> symbols) {
        for (Symbol symbol : symbols) {
            loadLazyRelations(symbol);

            symbol.setHidden(true);
            session.update(symbol);
        }
    }

    @Override
    public void show(Long userId, Long projectId, Long... ids) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // update
        try {
            for (Long id : ids) {
                List<Symbol> symbols = getSymbols(session, userId, projectId, id);
                showSymbols(session, symbols);
            }
        } catch (IllegalArgumentException e) {
            HibernateUtil.rollbackTransaction();
            throw  e;
        }

        // done
        HibernateUtil.commitTransaction();
    }

    private void showSymbols(Session session, List<Symbol> symbols) {
        for (Symbol symbol : symbols) {
            symbol.setHidden(false);
            session.update(symbol);
        }
    }

    private List<IdRevisionPair> createIdRevisionPairList(List<Object[]> idRevisionsFromDB) {
        List<IdRevisionPair> idRevPairs = new LinkedList<>();
        for (Object[] obj : idRevisionsFromDB) {
            IdRevisionPair newPair = new IdRevisionPair();
            newPair.setId((Long) obj[0]);
            newPair.setRevision((Long) obj[1]);

            idRevPairs.add(newPair);
        }
        return idRevPairs;
    }

    private List<Symbol> getSymbols(Session session, Long userId, Long projectId, Long symbolId)
            throws NotFoundException {
        @SuppressWarnings("should return a list of Symbols")
        List<Symbol> symbols = session.createCriteria(Symbol.class)
                                        .add(Restrictions.eq("user.id", userId))
                                        .add(Restrictions.eq("project.id", projectId))
                                        .add(Restrictions.eq("idRevisionPair.id", symbolId))
                                        .list();

        if (symbols.size() == 0) {
            throw new NotFoundException("Could not mark the symbol as hidden because it was not found.");
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
     *             If the symbol failed the check.
     */
    private void checkUniqueConstrains(Session session, Symbol symbol) throws IllegalArgumentException {
        // put constrains into a query
        Junction restrictions = Restrictions.conjunction()
                                    .add(Restrictions.eq("user", symbol.getUser()))
                                    .add(Restrictions.eq("project", symbol.getProject()))
                                    .add(Restrictions.disjunction()
                                            .add(Restrictions.eq("name", symbol.getName()))
                                            .add(Restrictions.eq("abbreviation", symbol.getAbbreviation())));
        if (symbol.getId() != null) {
            restrictions = restrictions.add(Restrictions.ne("idRevisionPair.id", symbol.getId()));
        }

        @SuppressWarnings("unchecked") // should return list of symbols
        List<Symbol> testList = session.createCriteria(symbol.getClass())
                                            .add(restrictions)
                                            .list();

        // if the query result is not empty, the constrains are violated.
        if (testList.size() > 0) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("The name '" + symbol.getName() + "' or the abbreviation '"
                                            + symbol.getAbbreviation() + "' of the symbol is already used"
                                              + " in the project.");
        }
    }

    private void beforeSymbolSave(Symbol symbol) {
        for (int i = 0; i < symbol.getActions().size(); i++) {
            SymbolAction action = symbol.getActions().get(i);
            action.setId(null);
            action.setUser(symbol.getUser());
            action.setProject(symbol.getProject());
            action.setSymbol(symbol);
            action.setNumber(i);
        }
    }

    private void setExecuteToSymbols(Session session, Symbol symbol) throws NotFoundException {
        Map<IdRevisionPair, Symbol> symbolMap = new HashMap<>();
        symbolMap.put(symbol.getIdRevisionPair(), symbol);
        setExecuteToSymbols(session, symbol, symbolMap);
    }

    private void setExecuteToSymbols(Session session, Symbol symbol, Map<IdRevisionPair, Symbol> allSymbols)
            throws NotFoundException {
        for (SymbolAction action : symbol.getActions()) {
            if (action instanceof ExecuteSymbolAction) {
                ExecuteSymbolAction executeSymbolAction = (ExecuteSymbolAction) action;
                IdRevisionPair idAndRevision = executeSymbolAction.getSymbolToExecuteAsIdRevisionPair();

                Symbol symbolToExecute = allSymbols.get(idAndRevision);

                if (symbolToExecute == null) { // it was not in the set of all symbols
                    symbolToExecute = (Symbol) session.createCriteria(Symbol.class)
                                                        .add(Restrictions.eq("user", action.getUser()))
                                                        .add(Restrictions.eq("project", action.getProject()))
                                                        .add(Restrictions.eq("idRevisionPair", idAndRevision))
                                                        .uniqueResult();
                }

                if (symbolToExecute == null) {
                    throw new NotFoundException("Could not find the symbol with the id "
                                                    + idAndRevision.getId() + " and the revision "
                                                    + idAndRevision.getRevision() + ", but it was referenced");
                }
                executeSymbolAction.setSymbolToExecute(symbolToExecute);
            }
        }
    }

    /**
     * Use Hibernate to populate all fields of a Symbol, including all references to other entities.
     *
     * @param symbol
     *         The Symbol to populate.
     */
    public static void loadLazyRelations(Symbol symbol) {
        Hibernate.initialize(symbol.getUser());
        Hibernate.initialize(symbol.getGroup());

        Hibernate.initialize(symbol.getActions());
        symbol.getActions().stream().filter(a -> a instanceof ExecuteSymbolAction).forEach(a -> {
            ExecuteSymbolAction action = (ExecuteSymbolAction) a;
            Symbol symbolToExecute = action.getSymbolToExecute();

            if (symbolToExecute != null
                    && (!Hibernate.isInitialized(symbolToExecute)
                            || !Hibernate.isInitialized(symbolToExecute.getActions()))) {
                Hibernate.initialize(symbolToExecute);
                Hibernate.initialize(symbolToExecute.getActions());
                loadLazyRelations(symbolToExecute);
            }
        });
    }

}
