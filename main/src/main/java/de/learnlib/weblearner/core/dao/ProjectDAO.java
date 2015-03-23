package de.learnlib.weblearner.core.dao;

import de.learnlib.weblearner.core.entities.Project;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Projects are handled.
 */
public interface ProjectDAO {

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
    List<Project> getAll(String... embedFields);

    /**
     * Get a specific project by its ID.
     * 
     * @param id
     *            The ID of the project to find.
     * @param embedFields
     *         The fields to include in returned project. By default no additional data will be fetched from the DB.
     * @return The project with the ID or null.
     */
    Project getByID(long id, String... embedFields);

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
