package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.inject.Inject;
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

    /** The {@link Learner learner} to use. */
    @Inject
    private Learner learner;

    /**
     * Set the learner instance to use.
     * Only package visible, because normlly this instance will be injected, but for testing a manual setter is needed.
     *
     * @param learner The learner to use.
     */
    void setLearner(Learner learner) {
        this.learner = learner;
    }

    @Override
    public void create(LearnerResult learnerResult) throws ValidationException {
        // new LearnerResults should have a project, not a test number not a step number
        if (learnerResult.getUser() == null
                || learnerResult.getProject() == null
                || learnerResult.getTestNo() != null
                || learnerResult.getStepNo() != null) {
            throw new ValidationException(
                "To create a LearnResult it must have a User and Project but must not have a test no. nor step no.");
        }

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the current highest test no in the project and add 1 for the next id
        Long maxTestNo = (Long) session.createCriteria(LearnerResult.class)
                                        .add(Restrictions.eq("user", learnerResult.getUser()))
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
    public List<String> getAllAsJSON(Long userId, Long projectId) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (ProjectDAOImpl.isProjectIdInvalid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        // fetch the LearnerResults of the project with the the highest step no.
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<String> resultsAsJSON = session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", userId))
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
    public List<String> getAllAsJSON(Long userId, Long projectId, Long testNo) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            List<String> result = getAllAsJSON(session, userId, projectId, testNo);

            // done
            HibernateUtil.commitTransaction();
            return result;
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public List<List<String>> getAllAsJson(Long userId, Long projectId, List<Long> testNos) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<List<String>> result = new LinkedList<>();

        try {
            for (Long testNo : testNos) {
                List<String> stepsOfOneTestRun = getAllAsJSON(session, userId, projectId, testNo);
                result.add(stepsOfOneTestRun);
            }
            // done
            HibernateUtil.commitTransaction();
            return result;
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private List<String> getAllAsJSON(Session session, Long userId, Long projectId, Long testNo)
            throws NotFoundException {
        if (ProjectDAOImpl.isProjectIdInvalid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        // fetch the LearnerResults of the project with the the highest step no.
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<String> result = session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", userId))
                .add(Restrictions.eq("project.id", projectId))
                .add(Restrictions.eq("testNo", testNo))
                .setProjection(Projections.property("JSON"))
                .addOrder(Order.asc("stepNo"))
                .list();

        if (result.isEmpty()) {
            throw new NotFoundException("No result with the test no. " + testNo + " for user " + userId + "was found.");
        }

        // done
        return result;
    }

    @Override
    public LearnerResult get(Long userId, Long projectId, Long testNo) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        LearnerResult result = get(session, userId, projectId, testNo);

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    private LearnerResult get(Session session, Long userId, Long projectId, Long testNo) throws NotFoundException {
        if (ProjectDAOImpl.isProjectIdInvalid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        LearnerResult result = (LearnerResult) session.createCriteria(LearnerResult.class)
                                                        .add(Restrictions.eq("user.id", userId))
                                                        .add(Restrictions.eq("project.id", projectId))
                                                        .add(Restrictions.eq("testNo", testNo))
                                                        .add(Restrictions.eq("stepNo", 0L))
                                                        .uniqueResult();

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("The results with the test no. " + testNo + " in the project " + projectId
                                                     + " was not found.");
        }
        return result;
    }

    @Override
    public String getAsJSON(Long userId, Long projectId, Long testNo) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (ProjectDAOImpl.isProjectIdInvalid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        String result = getAsJSON(session, userId, projectId, testNo, 0L);

        if (result == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("The results with the test no. " + testNo + " in the project " + projectId
                                                     + " was not found.");
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public String getAsJSON(Long userId, Long projectId, Long testNo, Long stepNo) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (ProjectDAOImpl.isProjectIdInvalid(projectId)) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        String result = getAsJSON(session, userId, projectId, testNo, stepNo);

        if (result == null) {
            throw new NotFoundException("The result with the test no. " + testNo
                                             + " and the step no. " + stepNo  + "  was not found.");
        }

        // done
        HibernateUtil.commitTransaction();
        return  result;
    }

    @Override
    public void update(LearnerResult learnerResult) throws NotFoundException, ValidationException {
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

    private void updateSummary(Session session, LearnerResult result) throws NotFoundException {
        LearnerResult summaryResult = get(session, result.getUserId(), result.getProjectId(), result.getTestNo());
        summaryResult.setErrorText(result.getErrorText());
        summaryResult.setHypothesis(result.getHypothesis());

        LearnerResult.Statistics summaryStatistics = summaryResult.getStatistics();
        LearnerResult.Statistics newStatistics = result.getStatistics();

        summaryStatistics.setDuration(summaryStatistics.getDuration() + newStatistics.getDuration());
        summaryStatistics.setMqsUsed(summaryStatistics.getMqsUsed() + newStatistics.getMqsUsed());
        summaryStatistics.setSymbolsUsed(summaryStatistics.getSymbolsUsed() + newStatistics.getSymbolsUsed());
        summaryStatistics.setEqsUsed(summaryStatistics.getEqsUsed() + newStatistics.getEqsUsed());

        session.update(summaryResult);
    }

    @Override
    public void delete(User user, Long projectId, Long... testNo) throws NotFoundException, ValidationException {
        checkIfResultsCanBeDeleted(user, projectId, testNo); // check before the session is opened

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        List<Long> validTestNumbers = getTestNumbersInDB(session, user.getId(), projectId, testNo);
        Set<Long> diffSet = setDifference(Arrays.asList(testNo), validTestNumbers);
        if (diffSet.size() > 0) {
            throw new NotFoundException("The result with the number " + diffSet + " was not found, thus nothing could"
                                                + "be deleted");
        }

        @SuppressWarnings("unchecked") // should always return a list of LernerResults
        List<LearnerResult> results = session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user", user))
                .add(Restrictions.eq("project.id", projectId))
                .add(Restrictions.in("testNo", testNo))
                .list();

        results.forEach(session::delete);

        // done
        HibernateUtil.commitTransaction();
    }

    private void checkIfResultsCanBeDeleted(User user, Long projectId, Long... testNo) throws ValidationException {
        // don't delete the learnResult of the active learning process
        LearnerStatus status = new LearnerStatus(user, learner);
        Long activeTestNo = status.getTestNo();
        Long activeProjectId = status.getProjectId();

        if (projectId.equals(activeProjectId)) {
            if (testNo.length == 1 && activeTestNo.equals(testNo[0])) {
                throw new ValidationException("Can't delete LearnResult with testNo " + activeTestNo + " because the "
                                                      + "learner is active on this one");
            } else if (testNo.length > 1) {
                for (Long t:testNo) {
                    if (activeTestNo.equals(t)) {
                        throw new ValidationException("Can't delete all LearnResults because the learner is active "
                                                              + "with testNo " + activeTestNo);
                    }
                }
            }
        }
    }

    private String getAsJSON(Session session, Long userId, Long projectId, Long testNo, Long stepNo) {
        return (String) session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", userId))
                .add(Restrictions.eq("project.id", projectId))
                .add(Restrictions.eq("testNo", testNo))
                .add(Restrictions.eq("stepNo", stepNo))
                .setProjection(Projections.property("JSON"))
                .uniqueResult();
    }

    private List<Long> getTestNumbersInDB(Session session, Long userId, Long projectId, Long... testNo) {
        return session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", userId))
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
