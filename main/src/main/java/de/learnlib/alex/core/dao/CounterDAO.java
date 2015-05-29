package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.exceptions.NotFoundException;
import org.jvnet.hk2.annotations.Service;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how a counter should be handed.
 */
@Service
public interface CounterDAO {

    /**
     * Create a counter.
     *
     * @param counter
     *         The counter to create.
     * @throws ValidationException
     *         When the counter could not be created,
     *         e.g. if already a counter with the same name exists in the project.
     */
    void create(Counter counter) throws ValidationException;

    /**
     * Get all counter of a project.
     *
     * @param projectId
     *         The project of the counters.
     * @return A list of counters within the given project.
     * @throws NotFoundException
     *         If no project with the given ID exists.
     */
    List<Counter> getAll(Long projectId) throws NotFoundException;

    /**
     * Get a specific counter.
     *
     * @param projectId
     *         The project of the counter.
     * @param name
     *         The name of the counter.
     * @return The counter you are looking for.
     * @throws NotFoundException
     *         If the counter was not found.
     */
    Counter get(Long projectId, String name) throws NotFoundException;

    /**
     * Update a counter.
     *
     * @param counter
     *         The counter to update.
     * @throws NotFoundException
     *         If the counter was not created before and thus could not be found.
     * @throws ValidationException
     *         If the counter could not be updated because of not met validation constrains.
     */
    void update(Counter counter) throws NotFoundException, ValidationException;

    /**
     * Deletes counters.
     *
     * @param projectId
     *         The project of the counter.
     * @param names
     *         The names of the counters.
     * @throws NotFoundException
     *         If the project or counter was not found.
     */
    void delete(Long projectId, String... names) throws NotFoundException;

}
