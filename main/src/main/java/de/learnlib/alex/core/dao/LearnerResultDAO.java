package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;

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
     * @param userId
     *         The user of the LearnerResult
     * @param projectId
     *         The project id of the test run.
     * @return A list of LearnerResults as JSON data.
     * @throws NotFoundException
     *         If the project id was invalid.
     */
    List<String> getAllAsJSON(Long userId, Long projectId) throws NotFoundException;

    /**
     * Get a list of JSON data containing all the steps of a given TestRun for a given Project.
     *
     * @param userId
     *         The user of the LearnerResult
     * @param projectId
     *         The project id if the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return A list of LearnerResults as JSON data.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    List<String> getAllAsJSON(Long userId, Long projectId, Long testNo) throws NotFoundException;

    /**
     * Get a list of lists of JSON data containing all the steps of a given TestRun for a given Project.
     *
     * @param userId
     *         The user of the LearnerResult
     * @param projectId
     *         The project id if the test run.
     * @param testNos
     *         The list of test nos. of the test runs.
     * @return A list of list containing LearnerResults as JSON data.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    List<List<String>> getAllAsJson(Long userId, Long projectId, List<Long> testNos) throws NotFoundException;

    /**
     * Get a the last / final LearnerResult of one test run.
     *
     * @param projectId
     *         The project id if the test run.
     * @param testRunNo
     *         The test no. of the test run.
     * @return The LearnerResult you are looking for, if it exists.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    LearnerResult get(Long projectId, Long testRunNo) throws NotFoundException;

    /**
     * Get the latest LearnerResult of a given test run as JSON data, e.g. the final result.
     *
     * @param userId
     *         The user id of the LearnerResult
     * @param projectId
     *         The project id of the test run.
     * @param testNo
     *         The test no. of the test run.
     * @return The latest LearnerResult, i.e. the one with the highest step no., for the given test run.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    String getAsJSON(Long userId, Long projectId, Long testNo) throws NotFoundException;

    /**
     * Get a specific LearnerResult as JSON data.
     *
     * @param userId
     *         The user id of the LearnerResult
     * @param projectId
     *         The project id of the test run / LearnerResult.
     * @param testNo
     *         The test non. of the test run / LearnerResult.
     * @param stepNo
     *         The step no. of the test run / LearnerResult.
     * @return The LearnerResult as JSON data.
     * @throws NotFoundException
     *         If the project id, test no. or step no. was invalid.
     */
    String getAsJSON(Long userId, Long projectId, Long testNo, Long stepNo) throws NotFoundException;

    /**
     * Update a given LearnResult. Update means here, to save a new LearnerResult with an increased step no.
     * The previous steps of one test run should not change.
     * This method must also verify that the given result is valid.
     *
     * @param learnerResult
     *         The LearnerResult to update.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    void update(LearnerResult learnerResult) throws NotFoundException, ValidationException;

    /**
     * Remove a complete test run of a project.
     *
     * @param user
     *         The user of the LearnerResult
     * @param projectId
     *         The project id.
     * @param testNo
     *         The test numbers to delete.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    void delete(User user, Long projectId, Long... testNo) throws  NotFoundException;
}
