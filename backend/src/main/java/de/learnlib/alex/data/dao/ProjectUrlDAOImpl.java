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
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/** The implementation of the {@link ProjectUrlDAO}. */
@Service
public class ProjectUrlDAOImpl implements ProjectUrlDAO {

    /** The project DAO to use. */
    @Inject
    private ProjectDAO projectDAO;

    @Override
    public void checkAccess(User user, Project project, ProjectUrl url)
            throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (url == null) {
            throw new NotFoundException("Could not find the url.");
        }

        if (!url.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the url.");
        }
    }

    @Override
    public void checkAccess(User user, Project project, List<ProjectUrl> urls)
            throws NotFoundException, UnauthorizedException {
        for (final ProjectUrl url : urls) {
            checkAccess(user, project, url);
        }
    }
}
