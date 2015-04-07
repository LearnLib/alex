package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
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
        learnerResult.setStepNo(0L);

        session.save(learnerResult);
        HibernateUtil.commitTransaction();
    }

    @Override
    public List<String> getAllAsJSON(Long projectId) throws IllegalArgumentException {
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
                                            .add(Restrictions.eq("stepNo", 0L))
                                            .setProjection(Projections.property("JSON"))
                                            .addOrder(Order.asc("testNo"))
                                            .list();

        // done
        HibernateUtil.commitTransaction();
        return resultsAsJSON;
    }

    @Override
    public List<String> getAllAsJSON(Long projectId, Long testNo)
            throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            List<String> result = getAllAsJSON(session, projectId, testNo);

            // done
            HibernateUtil.commitTransaction();
            return result;
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public List<List<String>> getAllAsJson(Long projectId, List<Long> testNos) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<List<String>> result = new LinkedList<>();

        try {
            testNos.forEach(testNo -> {
                List<String> stepsOfOneTestRun = getAllAsJSON(session, projectId, testNo);
                result.add(stepsOfOneTestRun);
            });
            // done
            HibernateUtil.commitTransaction();
            return result;
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private List<String> getAllAsJSON(Session session, Long projectId, Long testNo)
            throws NoSuchElementException {
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
        return result;
    }

    @Override
    public LearnerResult get(Long projectId, Long testNo) throws NoSuchElementException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        LearnerResult result = get(session, projectId, testNo);

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    private LearnerResult get(Session session, Long projectId, Long testNo) {
        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new NoSuchElementException("The project with the id " + projectId + " was not found.");
        }

        LearnerResult result = (LearnerResult) session.createCriteria(LearnerResult.class)
                                                        .add(Restrictions.eq("project.id", projectId))
                                                        .add(Restrictions.eq("testNo", testNo))
                                                        .add(Restrictions.eq("stepNo", 0L))
                                                        .uniqueResult();

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("The results with the test no. " + testNo + " in the project " + projectId
                                                     + " was not found.");
        }
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

        String result = getAsJSON(session, projectId, testNo, 0L);

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NoSuchElementException("The results with the test no. " + testNo + " in the project " + projectId
                                                     + " was not found.");
        }

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
                                             + " and the step no. " + stepNo  + "  was not found.");
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

        updateSummary(session, learnerResult);

        // done
        HibernateUtil.commitTransaction();
    }

    private void updateSummary(Session session, LearnerResult result) {
        LearnerResult summaryResult = get(session, result.getProjectId(), result.getTestNo());
        LearnerResult.Statistics summaryStatistics = summaryResult.getStatistics();
        LearnerResult.Statistics newStatistics = result.getStatistics();

        summaryStatistics.setDuration(summaryStatistics.getDuration() + newStatistics.getDuration());
        summaryStatistics.setMqsUsed(summaryStatistics.getMqsUsed() + newStatistics.getMqsUsed());
        summaryStatistics.setSymbolsUsed(summaryStatistics.getSymbolsUsed() + newStatistics.getSymbolsUsed());
        summaryStatistics.setEqsUsed(summaryStatistics.getEqsUsed() + newStatistics.getEqsUsed());

        session.update(summaryResult);
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

        // donee
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
