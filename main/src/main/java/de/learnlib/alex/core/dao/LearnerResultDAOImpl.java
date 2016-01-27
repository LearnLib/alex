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

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import javax.inject.Inject;
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

    /** The {@link Learner learner} to use. */
    @Inject
    private Learner learner;

    /**
     * Set the learner instance to use.
     * Only package visible, because normally this instance will be injected, but for testing a manual setter is needed.
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
                || learnerResult.getTestNo() != null) {
            throw new ValidationException(
                "To create a LearnResult it must have a User and Project but must not have a test no.");
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

        session.save(learnerResult);
        HibernateUtil.commitTransaction();
    }

    @Override
    public List<LearnerResult> getAll(Long userId, Long projectId, boolean includeSteps) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // fetch the LearnerResults of the project with the the highest step no.
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<LearnerResult> results = session.createCriteria(LearnerResult.class)
                                                .add(Restrictions.eq("user.id", userId))
                                                .add(Restrictions.eq("project.id", projectId))
                                                .addOrder(Order.asc("testNo"))
                                                .list();

        if (results.isEmpty()) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }
        initializeLazyRelations(session, results, includeSteps);

        // done
        HibernateUtil.commitTransaction();
        return results;
    }

    @Override
    public List<LearnerResult> getAll(Long userId, Long projectId, Long[] testNos, boolean includeSteps)
            throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            List<LearnerResult> result = getAll(session, userId, projectId, testNos, includeSteps);

            // done
            HibernateUtil.commitTransaction();
            return result;
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    @Override
    public LearnerResult get(Long userId, Long projectId, Long testNo, boolean includeSteps) throws NotFoundException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            List<LearnerResult> result = getAll(session, userId, projectId, new Long[] {testNo}, includeSteps);

            // done
            HibernateUtil.commitTransaction();
            return result.get(0);
        } catch (NoSuchElementException e) {
            HibernateUtil.rollbackTransaction();
            throw e;
        }
    }

    private List<LearnerResult> getAll(Session session, Long userId, Long projectId,
                                       Long[] testNos, boolean includeSteps)
            throws NotFoundException {
        @SuppressWarnings("unchecked") // should return a list of LearnerResults
        List<LearnerResult> results = session.createCriteria(LearnerResult.class)
                                                .add(Restrictions.eq("user.id", userId))
                                                .add(Restrictions.eq("project.id", projectId))
                                                .add(Restrictions.in("testNo", testNos))
                                                .list();

        if (results.size() != testNos.length) {
            throw new NotFoundException("Not all results with the test nos. " + Arrays.toString(testNos)
                                                + " for the user " + userId + "were found.");
        }
        initializeLazyRelations(session, results, includeSteps);

        // done
        return results;
    }

    private void initializeLazyRelations(Session session, List<LearnerResult> results, boolean includeSteps) {
        results.forEach(r -> Hibernate.initialize(r.getResetSymbol()));
        results.forEach(r -> Hibernate.initialize(r.getSymbols()));
        if (includeSteps) {
            results.forEach(r -> Hibernate.initialize(r.getSteps()));
        } else {
            results.forEach(r -> {
                session.evict(r);
                r.setSteps(null);
            });
        }
    }

    @Override
    public LearnerResultStep createStep(LearnerResult result)
            throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);

        LearnerResultStep newStep = new LearnerResultStep();
        newStep.setUser(result.getUser());
        newStep.setProject(result.getProject());
        newStep.setResult(result);
        newStep.setStepNo(latestStep.getStepNo() + 1);
        newStep.setEqOracle(latestStep.getEqOracle());
        if (latestStep.getStepsToLearn() > 0) {
            newStep.setStepsToLearn(latestStep.getStepsToLearn() - 1);
        } else if (latestStep.getStepsToLearn() == -1){
            newStep.setStepsToLearn(-1);
        } else {
            HibernateUtil.rollbackTransaction();
            throw new IllegalStateException("The previous step has a step to learn of 0 "
                                                    + "-> no new step can be crated!");
        }

        result.getSteps().add(newStep);
        session.save(newStep);
        session.update(result);

        HibernateUtil.commitTransaction();
        return newStep;
    }

    @Override
    public LearnerResultStep createStep(LearnerResult result, LearnerResumeConfiguration configuration)
            throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // create the new step
        LearnerResultStep newStep = new LearnerResultStep();
        newStep.setUser(result.getUser());
        newStep.setProject(result.getProject());
        newStep.setResult(result);
        newStep.setStepNo((long) result.getSteps().size());
        newStep.setEqOracle(configuration.getEqOracle());
        newStep.setStepsToLearn(configuration.getMaxAmountOfStepsToLearn());

        result.getSteps().add(newStep);
        session.save(newStep);
        session.update(result);

        HibernateUtil.commitTransaction();
        return newStep;
    }

    @Override
    public void saveStep(LearnerResult result, LearnerResultStep step) throws ValidationException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        session.update(step);

        updateSummary(result, step);
        session.update(result);

        HibernateUtil.commitTransaction();
    }

    private void updateSummary(LearnerResult result, LearnerResultStep step) {
        result.setHypothesis(step.getHypothesis());
        result.setErrorText(step.getErrorText());

        Statistics summaryStatistics = result.getStatistics();
        Statistics newStatistics     = step.getStatistics();

        summaryStatistics.setDuration(summaryStatistics.getDuration() + newStatistics.getDuration());
        summaryStatistics.setMqsUsed(summaryStatistics.getMqsUsed() + newStatistics.getMqsUsed());
        summaryStatistics.setSymbolsUsed(summaryStatistics.getSymbolsUsed() + newStatistics.getSymbolsUsed());
        summaryStatistics.setEqsUsed(summaryStatistics.getEqsUsed() + newStatistics.getEqsUsed());
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
