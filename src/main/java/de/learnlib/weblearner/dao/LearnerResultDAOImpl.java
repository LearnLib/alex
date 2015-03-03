package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.learner.Learner;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;

import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.TreeSet;

/**
 * Implementation of a LearnerResultDAO using Hibernate.
 */
public class LearnerResultDAOImpl implements LearnerResultDAO {

    @Override
    public void create(LearnerResult learnerResult) throws ValidationException {
        // new LearnerResults should have a project, not a test number not a step number
        if (learnerResult.getProject() == null
                || learnerResult.getTestNo() != null
                || learnerResult.getStepNo() != null) {
            throw new ValidationException(
                "To create a LearnResult it must have a Project but must not have a test no. nor step no.");
        }

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the current highest test no in the project and add 1 for the next id
        Long maxTestNo = (Long) session.createCriteria(LearnerResult.class)
                                        .add(Restrictions.eq("project", learnerResult.getProject()))
                                        .setProjection(Projections.max("testNo"))
                                        .uniqueResult();
        if (maxTestNo == null) {
            maxTestNo = 0L;
        }
        long nextTestNo = maxTestNo + 1;

        learnerResult.setId(0L);
        learnerResult.setTestNo(nextTestNo);
        learnerResult.setStepNo(1L);

        session.save(learnerResult);
        HibernateUtil.commitTransaction();
    }

    @Override
    public List<String> getAllAsJSON(Long projectId) throws IllegalArgumentException {
        // subquery preparation to get a list of ids combined with their highest step no
        DetachedCriteria maxStepNumbers = DetachedCriteria.forClass(LearnerResult.class)
                                                            .add(Restrictions.eq("project.id", projectId))
                                                            .setProjection(Projections.projectionList()
                                                                    .add(Projections.groupProperty("testNo"))
                                                                    .add(Projections.max("stepNo")));
        Criterion maxStepNoPerIdSubquery = Subqueries.propertiesIn(new String[]{"testNo", "stepNo"}, maxStepNumbers);

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        // fetch the LearnerResults of the project with the the highest step no.
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<String> resultsAsJSON = session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(maxStepNoPerIdSubquery)
                                            .setProjection(Projections.property("JSON"))
                                            .addOrder(Order.asc("testNo"))
                                            .list();

        // done
        HibernateUtil.commitTransaction();
        return resultsAsJSON;
    }

    @Override
    public List<String> getAllAsJSON(Long projectId, Long testNo)
            throws IllegalArgumentException, NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        // fetch the LearnerResults of the project with the the highest step no.
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<String> result = session.createCriteria(LearnerResult.class)
                                        .add(Restrictions.eq("project.id", projectId))
                                        .add(Restrictions.eq("testNo", testNo))
                                        .setProjection(Projections.property("JSON"))
                                        .addOrder(Order.asc("stepNo"))
                                        .list();

        if (result.isEmpty()) {
            throw new NoSuchElementException("No result with the test no. " + testNo + " was found.");
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public LearnerResult get(Long projectId, Long testNo) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        Long latestStepNo = getHighestStepNumber(session, projectId, testNo);

        LearnerResult result = (LearnerResult) session.createCriteria(LearnerResult.class)
                                                        .add(Restrictions.eq("project.id", projectId))
                                                        .add(Restrictions.eq("testNo", testNo))
                                                        .add(Restrictions.eq("stepNo", latestStepNo))
                                                        .uniqueResult();

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public String getAsJSON(Long projectId, Long testNo) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        Long latestStepNo = getHighestStepNumber(session, projectId, testNo);

        String result = getAsJSON(session, projectId, testNo, latestStepNo);

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public String getAsJSON(Long projectId, Long testNo, Long stepNo) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        String result = getAsJSON(session, projectId, testNo, stepNo);

        if (result == null) {
            throw new NoSuchElementException("The result with the test no. " + testNo
                                                     + " and the step no. " + stepNo  +"  was not found.");
        }

        // done
        HibernateUtil.commitTransaction();
        return  result;
    }

    @Override
    public void update(LearnerResult learnerResult) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        learnerResult.setId(0L);
        learnerResult.setStepNo(learnerResult.getStepNo() + 1);
        session.save(learnerResult);

        // done
        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(Long projectId, Long... testNo) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<Long> validTestNumbers = getTestNumbersInDB(session, projectId, testNo);
        Set<Long> diffSet = setDifference(Arrays.asList(testNo), validTestNumbers);
        if (diffSet.size() > 0) {
            String errorMessage = "The result with the number " + diffSet + " was not found, thus nothing could"
                                    + "be deleted";
            throw new NoSuchElementException(errorMessage);
        }

        @SuppressWarnings("unchecked") // should always return a list of LernerResults
        List<LearnerResult> results = session.createCriteria(LearnerResult.class)
                                                .add(Restrictions.eq("project.id", projectId))
                                                .add(Restrictions.in("testNo", testNo))
                                                .list();
        for (LearnerResult r : results) {
            session.delete(r);
        }

        // done
        HibernateUtil.commitTransaction();
    }

    private String getAsJSON(Session session, long projectId, long testNo, long stepNo) {
        return (String) session.createCriteria(LearnerResult.class)
                                .add(Restrictions.eq("project.id", projectId))
                                .add(Restrictions.eq("testNo", testNo))
                                .add(Restrictions.eq("stepNo", stepNo))
                                .setProjection(Projections.property("JSON"))
                                .uniqueResult();
    }

    private Long getHighestStepNumber(Session session, long projectId, long testNo) {
        Long latestStepNo = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("testNo", testNo))
                                            .setProjection(Projections.max("stepNo"))
                                            .uniqueResult();
        if (latestStepNo == null) {
            throw new NoSuchElementException("No result with the test no. " + testNo + " was found.");
        }
        return latestStepNo;
    }

    private List<Long> getTestNumbersInDB(Session session, Long projectId, Long... testNo) {
        return session.createCriteria(LearnerResult.class)
                        .add(Restrictions.eq("project.id", projectId))
                        .add(Restrictions.in("testNo", testNo))
                        .setProjection(Projections.distinct(Projections.property("testNo")))
                        .list();
    }

    private Set<Long> setDifference(Collection<Long> collectionA, Collection<Long> collectionB) {
        Set<Long> diffSet = new TreeSet<>(collectionA);
        diffSet.removeAll(collectionB);
        return  diffSet;
    }

}
