package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.exceptions.NotFoundException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Groups are handled.
 */
public interface SymbolGroupDAO {

    enum EmbeddableFields {
        ALL,

        COMPLETE_SYMBOLS,

        SYMBOLS;

        /**
         * Parse a string into an entry of this enum.
         * It is forbidden to override toValue(), so we use this method to allow the lowercase variants, too.
         *
         * @param name
         *         THe name to parse into an entry.
         * @return The fitting entry of this enum.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        public static EmbeddableFields fromString(String name) throws IllegalArgumentException {
            return EmbeddableFields.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }

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
     * @param embedFields
     *         A list of field to directly embed/ load into the returned groups.
     * @return A List of groups. Can be empty.
     * @throws NotFoundException
     *         If no project with the given id was found.
     */
    List<SymbolGroup> getAll(long projectId, EmbeddableFields... embedFields) throws NotFoundException;

    /**
     * Get one group.
     *
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @param embedFields
     *         A list of field to directly embed/ load into the returned groups.
     * @return The group you are looking for.
     * @throws NotFoundException
     *         If the Project or the Group could not be found.
     */
    SymbolGroup get(long projectId, Long groupId, EmbeddableFields... embedFields) throws NotFoundException;

    /**
     * Update a group.
     *
     * @param group
     *         The group to update.
     * @throws NotFoundException
     *         If the group was not found, because you can only update existing groups.
     * @throws ValidationException
     *         If the group was invalid.
     */
    void update(SymbolGroup group) throws NotFoundException, ValidationException;

    /**
     * Delete a group.
     *
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @throws IllegalArgumentException
     *         If you want to delete a default group.
     * @throws NotFoundException
     *         If The project or group could not be found.
     */
    void delete(long projectId, Long groupId) throws IllegalArgumentException, NotFoundException;

}
