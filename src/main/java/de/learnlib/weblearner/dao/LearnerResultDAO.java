package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;

import javax.validation.ValidationException;
import java.util.List;
import java.util.NoSuchElementException;

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
     * @throws NoSuchElementException
     *         If the project id was invalid.
     */
    List<String> getAllAsJSON(Long projectId) throws NoSuchElementException;

    /**
     * Get a list of JSON data containing all the steps of a given TestRun for a given Project.
     *
     * @param projectId
     *         The project id if the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return A list of LearnerResults as JSON data.
     * @throws NoSuchElementException
     *         If the project id or test no. was invalid.
     */
    List<String> getAllAsJSON(Long projectId, Long testNo) throws NoSuchElementException;

    /**
     * Get a the last / final LearnerResult of one test run.
     *
     * @param projectId
     *         The project id if the test run.
     * @param testRunNo
     *         The test no. of the test run.
     * @return The LearnerResult you are looking for, if it exists.
     * @throws NoSuchElementException
     *         If the project id or test no. was invalid.
     */
    LearnerResult get(Long projectId, Long testRunNo) throws NoSuchElementException;

    /**
     * Get the latest LearnerResult of a given test run as JSON data, e.g. the final result.
     *
     * @param projectId
     *         The project id of the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return The latest LearnerResult, i.e. the one with the highest step no., for the given test run.
     * @throws NoSuchElementException
     *         If the project id or test no. was invalid.
     */
    String getAsJSON(Long projectId, Long testNo) throws NoSuchElementException;

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
     * @throws java.util.NoSuchElementException
     *         If the project id, test no. or step no. was invalid.
     */
    String getAsJSON(Long projectId, Long testNo, Long stepNo) throws NoSuchElementException;

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
     *         The test numbers to delete.
     * @throws NoSuchElementException
     *         If the project id or test no. was invalid.
     */
    void delete(Long projectId, Long... testNo) throws  NoSuchElementException;
}
