/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.integrationtests.TestPostgresqlContainer;
import de.learnlib.alex.settings.dao.SettingsDAO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@ExtendWith(SpringExtension.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public abstract class AbstractRepositoryIT {

    @Container
    public static PostgreSQLContainer postgreSQLContainer = TestPostgresqlContainer.getInstance();

    @Autowired
    protected UserDAO userDAO;

    @Autowired
    protected ProjectDAO projectDAO;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    private SettingsDAO settingsDAO;

    @AfterEach
    @Transactional
    public void tearDown() {
        final var admin = userDAO.getByID(1L);

        // delete all users except the admin
        for (var user : userRepository.findAll()) {
            if (!user.equals(admin)) {
                userDAO.delete(admin, user.getId());
            }
        }

        // delete projects of admin
        for (var project : projectDAO.getAll(admin)) {
            projectDAO.delete(admin, project.getId());
        }

        final var settings = settingsDAO.get();
        settings.setAllowUserRegistration(true);
        settingsDAO.update(settings);
    }

    User createUser(String email) {
        User user = new User();
        user.setUsername(email.split("@")[0]);
        user.setEmail(email);
        user.setPassword("test");
        return user;
    }

    Project createProject(User user, String name) {
        final ProjectEnvironment env = new ProjectEnvironment();
        env.setName("Testing");
        env.setDefault(true);

        final ProjectUrl url = new ProjectUrl();
        url.setUrl("http://localhost");
        url.setEnvironment(env);
        env.getUrls().add(url);

        final Project project = new Project();
        project.addOwner(user);
        project.setName(name);
        project.getEnvironments().add(env);
        env.setProject(project);

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setProject(project);
        defaultGroup.setId(0L);
        defaultGroup.setName("Default group");

        project.getGroups().add(defaultGroup);
        return project;
    }

}
