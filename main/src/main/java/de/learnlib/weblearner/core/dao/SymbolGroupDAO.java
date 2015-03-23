package de.learnlib.weblearner.core.dao;

import de.learnlib.weblearner.core.entities.SymbolGroup;

import javax.validation.ValidationException;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Interface to describe how Groups are handled.
 */
public interface SymbolGroupDAO {

    /**
     * Save a group.
     *
     * @param group
     *         The group to persist. Things like the internal id will be added directly tot this object.
     * @throws ValidationException
     *         IF the Group is not valid and could not be created.
     */
    void create(SymbolGroup group) throws ValidationException;

    /**
     * Get a list of all groups withing one project.
     *
     * @param projectId
     *         The project the groups should belong to.
     * @return A List of groups. Can be empty.
     * @throws NoSuchElementException
     *         If no project with the given id was found.
     */
    List<SymbolGroup> getAll(long projectId, String... embedFields) throws NoSuchElementException;

    /**
     * Get one group.
     *
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @return The group you are looking for.
     * @throws NoSuchElementException
     *         If the Project or the Group could not be found.
     */
    SymbolGroup get(long projectId, Long groupId, String... embedFields) throws NoSuchElementException;

    /**
     * Update a group.
     *
     * @param group
     *         The group to update.
     * @throws IllegalStateException
     *         If the group was not found, because you can only update existing groups.
     * @throws ValidationException
     *         If the group was invalid.
     */
    void update(SymbolGroup group) throws IllegalStateException, ValidationException;

    /**
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @throws IllegalArgumentException If you want to delete a default group.
     */
    void delete(long projectId, Long groupId) throws IllegalArgumentException;

}
