package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import org.jvnet.hk2.annotations.Service;

import java.util.List;
import java.util.NoSuchElementException;

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
     */
    void create(Counter counter);

    /**
     * Get all counter of a project.
     *
     * @param projectId
     *         The project of the counters.
     * @return A list of counters within the given project.
     */
    List<Counter> getAll(Long projectId);

    /**
     * Get a specific counter.
     *
     * @param projectId
     *         The project of the counter.
     * @param name
     *         The name of the counter.
     * @return The counter you are looking for.
     * @throws NoSuchElementException
     *         If the counter was not found.
     */
    Counter get(Long projectId, String name) throws NoSuchElementException;

    /**
     * Update a counter.
     *
     * @param counter
     *         The counter to update.
     * @throws NoSuchElementException
     *         If the counter was not created before and thus could not be found.
     */
    void update(Counter counter) throws NoSuchElementException;

    /**
     * Delete a counter.
     *
     * @param projectId
     *         The project of the counter.
     * @param name
     *         The name of the counter.
     * @throws NoSuchElementException
     *         If the counter was not found.
     */
    void delete(Long projectId, String name) throws NoSuchElementException;

}
