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

package de.learnlib.alex.integrationtests.resources;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.integrationtests.TestPostgresqlContainer;
import de.learnlib.alex.settings.dao.SettingsDAO;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
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
public abstract class AbstractResourceIT {

    @Container
    public static PostgreSQLContainer postgreSQLContainer = TestPostgresqlContainer.getInstance();

    protected static final String ADMIN_EMAIL = "admin@alex.example";

    protected static final String ADMIN_PASSWORD = "admin";

    @LocalServerPort
    protected int port;

    protected Client client = ClientBuilder.newClient();

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected UserDAO userDAO;

    @Autowired
    protected ProjectDAO projectDAO;

    @Autowired
    protected SettingsDAO settingsDAO;

    @Autowired
    private UserRepository userRepository;

    protected String baseUrl() {
        return "http://localhost:" + port + "/rest";
    }

    @BeforeEach
    public void pre() throws Exception {
    }

    @AfterEach
    @Transactional
    public void post() throws Exception {
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

    protected void checkIsRestError(String body) {
        JsonPath.read(body, "statusCode");
        JsonPath.read(body, "statusText");
        JsonPath.read(body, "message");
    }
}
