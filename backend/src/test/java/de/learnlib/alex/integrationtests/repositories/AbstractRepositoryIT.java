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

package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import org.junit.After;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.inject.Inject;
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public abstract class AbstractRepositoryIT {

    @Inject
    protected UserDAO userDAO;

    @Inject
    protected UserRepository userRepository;

    @Inject
    protected ProjectDAO projectDAO;

    @Inject
    protected ProjectRepository projectRepository;

    @After
    public void tearDown() throws Exception {
        userDAO.delete(
                userRepository.findAll().stream()
                        .map(User::getId)
                        .filter(id -> id > 1)// delete all but the admin
                        .collect(Collectors.toList())
        );
        projectRepository.deleteAll(); // also delete remaining projects of the admin
    }

    User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("test");
        return user;
    }

    Project createProject(User user, String name) {
        ProjectUrl url = new ProjectUrl();
        url.setUrl("http://localhost");
        url.setDefault(true);

        Project project = new Project();
        project.setUser(user);
        project.setName(name);
        project.getUrls().add(url);
        url.setProject(project);

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setProject(project);
        defaultGroup.setId(0L);
        defaultGroup.setName("Default group");

        project.getGroups().add(defaultGroup);
        return project;
    }

}
