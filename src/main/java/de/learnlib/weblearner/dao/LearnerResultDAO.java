package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how to deal with LearnerResult.
 */
public interface LearnerResultDAO {

    /**
     * Persists a LearnerResult. This method must also verify that the given result is valid.
     *
     * @param learnerResult
     *         The LearnerResult to save.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    void create(LearnerResult learnerResult) throws ValidationException;

    /**
     * Get a list of JSON data containing all the LearnerResults, that are the latest of any test run for a given
     * Project. This LearnerResult are most likely the final results of each test run.
     *
     * @param projectId
     *         The project id of the test run.
     * @return A list of LearnerResults as JSON data.
     * @throws IllegalArgumentException
     *         If the project id was invalid.
     */
    List<String> getAllAsJSON(long projectId) throws IllegalArgumentException;

    /**
     * Get a list of JSON data containing all the steps of a given TestRun for a given Project.
     *
     * @param projectId
     *         The project id if the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return A list of LearnerResults as JSON data.
     * @throws IllegalArgumentException
     *         If the project id or test no. was invalid.
     */
    List<String> getAllAsJSON(long projectId, long testNo) throws IllegalArgumentException;

    /**
     * Get a the last / final LearnerResult of one test run.
     *
     * @param projectId
     *         The project id if the test run.
     * @param testRunNo
     *         The test no. of the test run.
     * @return The LearnerResult you are looking for, if it exists.
     * @throws IllegalArgumentException
     *         If the project id or test no. was invalid.
     */
    LearnerResult get(long projectId, long testRunNo) throws IllegalArgumentException;

    /**
     * Get the latest LearnerResult of a given test run as JSON data, e.g. the final result.
     *
     * @param projectId
     *         The project id of the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return The latest LearnerResult, i.e. the one with the highest step no., for the given test run.
     * @throws IllegalArgumentException
     *         If the project id or test no. was invalid.
     */
    String getAsJSON(long projectId, long testNo) throws IllegalArgumentException;

    /**
     * Get a specific LearnerResult as JSON data.
     *
     * @param projectId
     *         The project id of the test run / LearnerResult.
     * @param testNo
     *         The test non. of the test run / LearnerResult.
     * @param stepNo
     *         The step no. of the test run / LearnerResult.
     * @return The LearnerResult as JSON data.
     * @throws IllegalArgumentException
     *         If the project id, test no. or step no. was invalid.
     */
    String getAsJSON(long projectId, long testNo, long stepNo) throws IllegalArgumentException;

    /**
     * Update a given LearnResult. Update means here, to save a new LearnerResult with an increased step no.
     * The previous steps of one test run should not change.
     * This method must also verify that the given result is valid.
     *
     * @param learnerResult
     *         The LearnerResult to update.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    void update(LearnerResult learnerResult) throws ValidationException;

    /**
     * Remove a complete test run of a project.
     *
     * @param projectId
     *         The project id.
     * @param testNo
     *         The test no.
     * @throws IllegalArgumentException
     *         If the project id or test no. was invalid.
     */
    void delete(long projectId, long testNo) throws  IllegalArgumentException;
}
