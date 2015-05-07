package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Project;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Projects are handled.
 */
public interface ProjectDAO {

    /**
     * Enum to describe what to embed while fetching a  project.
     */
    enum EmbeddableFields {

        /** Flag to embed the groups of the project. */
        GROUPS,

        /** Flag to embed the default group. */
        DEFAULT_GROUP,

        /** Flag to embed teh symbols of the project. */
        SYMBOLS,

        /** Flag to embed test results. */
        TEST_RESULTS,

        /** Flag to embed everything. */
        ALL;

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
     * Save the given project.
     * 
     * @param project
     *            The project to be saved.
     * @throws ValidationException
     *             If the Project was not valid.
     */
    void create(Project project) throws ValidationException;

    /**
     * Get a list of all the projects.
     *
     * @param embedFields
     *         The fields to include in returned project. By default no additional data will be fetched from the DB.
     * @return All projects in a list.
     */
    List<Project> getAll(EmbeddableFields... embedFields);

    /**
     * Get a specific project by its ID.
     * 
     * @param id
     *            The ID of the project to find.
     * @param embedFields
     *         The fields to include in returned project. By default no additional data will be fetched from the DB.
     * @return The project with the ID or null.
     */
    Project getByID(long id, EmbeddableFields... embedFields);

    /**
     * Update a project.
     * 
     * @param project
     *            The project to update.
     * @throws IllegalArgumentException
     *             When the Project was not found.
     * @throws ValidationException
     *             When the Project was not valid.
     */
    void update(Project project) throws IllegalArgumentException, ValidationException;

    /**
     * Delete a project.
     * 
     * @param id
     *            The id of the project to delete.
     * @throws IllegalArgumentException
     *            When the Project id was not found.
     */
    void delete(long id) throws IllegalArgumentException;

}
