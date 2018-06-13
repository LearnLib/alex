/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import org.apache.shiro.authz.UnauthorizedException;

import java.util.List;

/** The interface for DAO for project URLs. */
public interface ProjectUrlDAO {

    /**
     * Check if the user can access the URL.
     *
     * @param user
     *         The current user.
     * @param project
     *         The project.
     * @param url
     *         The URL.
     * @throws NotFoundException
     *         If one of the entities could not be found or are null.
     * @throws UnauthorizedException
     *         If the user does not have access to one of the entities.
     */
    void checkAccess(User user, Project project, ProjectUrl url)
            throws NotFoundException, UnauthorizedException;

    /**
     * Check if the user can access the URLs.
     *
     * @param user
     *         The current user
     * @param project
     *         The project.
     * @param urls
     *         The URL.
     * @throws NotFoundException
     *         If one of the entities could not be found or are null.
     * @throws UnauthorizedException
     *         If the user does not have access to one of the entities.
     */
    void checkAccess(User user, Project project, List<ProjectUrl> urls)
            throws NotFoundException, UnauthorizedException;
}
