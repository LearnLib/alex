package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a LearnerResultDAO using Hibernate.
 */
public class LearnerResultDAOImpl implements LearnerResultDAO {

    @Override
    public void create(LearnerResult learnerResult) throws ValidationException {
        // new LearnerResults should have a project, not an id and not a revision
        if (learnerResult.getProject() == null || learnerResult.getTestNo() > 0 || learnerResult.getStepNo() > 0) {
            throw new ValidationException(
                "To create a LearnResult it must have a Project but must not haven an test no. nor step no.");
        }

        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        // get the current highest symbol id in the project and add 1 for the next id
        Long maxID = (Long) session.createCriteria(LearnerResult.class)
                                    .add(Restrictions.eq("project", learnerResult.getProject()))
                                    .setProjection(Projections.max("testNo"))
                                    .uniqueResult();
        if (maxID == null) {
            maxID = 0L;
        }
        long id = maxID + 1;

        learnerResult.setId(0L);
        learnerResult.setTestNo(id);
        learnerResult.setStepNo(1L);

        session.save(learnerResult);
        HibernateUtil.commitTransaction();
    }

    @Override
    public List<String> getAllAsJSON(long projectId) throws IllegalArgumentException {
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
            throw new IllegalArgumentException("The project id is invalid.");
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
    public List<String> getAllAsJSON(long projectId, long testNo) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new IllegalArgumentException("The project id is invalid.");
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
            throw new IllegalArgumentException("The test no. is invalid.");
        }

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public LearnerResult get(long projectId, long testNo) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new IllegalArgumentException("The project id is invalid.");
        }

        Long latestStepNo = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("testNo", testNo))
                                            .setProjection(Projections.max("stepNo"))
                                            .uniqueResult();
        if (latestStepNo == null) {
            throw new IllegalArgumentException("The test no. is invalid.");
        }

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
    public String getAsJSON(long projectId, long testNo) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new IllegalArgumentException("The project id is invalid.");
        }

        Long latestStepNo = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.eq("testNo", testNo))
                                            .setProjection(Projections.max("stepNo"))
                                            .uniqueResult();
        if (latestStepNo == null) {
            throw new IllegalArgumentException("The test no. is invalid.");
        }

        String result = getAsJSON(session, projectId, testNo, latestStepNo);

        // done
        HibernateUtil.commitTransaction();
        return result;
    }

    @Override
    public String getAsJSON(long projectId, long testNo, long stepNo) throws IllegalArgumentException {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        if (!ProjectDAOImpl.isProjectIdValid(projectId)) {
            throw new IllegalArgumentException("The project id is invalid.");
        }

        String result = getAsJSON(session, projectId, testNo, stepNo);

        if (result == null) {
            throw new IllegalArgumentException("The test no. or step no. is invalid.");
        }

        // done
        HibernateUtil.commitTransaction();
        return  result;
    }

    private String getAsJSON(Session session, long projectId, long testNo, long stepNo) {
        return (String) session.createCriteria(LearnerResult.class)
                                .add(Restrictions.eq("project.id", projectId))
                                .add(Restrictions.eq("testNo", testNo))
                                .add(Restrictions.eq("stepNo", stepNo))
                                .setProjection(Projections.property("JSON"))
                                .uniqueResult();
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
    public void delete(long projectId, Long... testNo) {
        // start session
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        //FIXME
        Long validNoCount = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", projectId))
                                            .add(Restrictions.in("testNo", testNo))
                                            .setProjection(Projections.countDistinct("testNo"))
                                            .uniqueResult();
        System.out.println("%%%%%% " + validNoCount);

        if (validNoCount != testNo.length) {
            throw new IllegalArgumentException(); //TODO (Alex S.): add a real error message.
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

}
