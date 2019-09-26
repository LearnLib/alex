/*
 * Copyright 2015 - 2019 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.CreateProjectForm;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Projects are handled.
 */
public interface ProjectDAO {

    /**
     * Save the given project.
     *
     * @param user
     *         The user that creates the project.
     * @param project
     *         The project to be saved.
     * @return The created project.
     * @throws ValidationException
     *         If the Project was not valid.
     */
    Project create(User user, CreateProjectForm project) throws ValidationException;

    /**
     * Get a list of all the projects.
     *
     * @param user
     *         The user of the project.
     * @return All projects in a list.
     */
    List<Project> getAll(User user);

    /**
     * Get a specific project by its ID.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project to find.
     * @return The project with the ID.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    Project getByID(User user, Long projectId) throws NotFoundException;

    /**
     * Update a project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project to update.
     * @param project
     *         The project to update.
     * @return The updated project.
     * @throws NotFoundException
     *         If the Project was not found.
     * @throws ValidationException
     *         If the Project was not valid.
     */
    Project update(User user, Long projectId, Project project) throws NotFoundException, ValidationException;

    /**
     * Delete a project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project to delete.
     * @throws NotFoundException
     *         If the Project id was not found.
     */
    void delete(User user, Long projectId) throws NotFoundException;

    /**
     * Delete multiple projects at once.
     * @param user The user.
     * @param projectIds The IDs of the projects to delete.
     * @throws NotFoundException If one of the projects could not be found.
     */
    void delete(User user, List<Long> projectIds) throws NotFoundException;

    Project importProject(User user, ProjectExportableEntity project) throws NotFoundException;

    /**
     * Check if the user is allowed to access or modify the project.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @throws NotFoundException
     *         If the project could not be found.
     * @throws UnauthorizedException
     *         If the project does not belong to the project.
     */
    void checkAccess(User user, Project project) throws NotFoundException, UnauthorizedException;
}
