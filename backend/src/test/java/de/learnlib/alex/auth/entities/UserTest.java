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

package de.learnlib.alex.auth.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.webhooks.entities.Webhook;
import java.util.Collections;
import org.json.JSONException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.skyscreamer.jsonassert.JSONAssert;

public class UserTest {

    private static ObjectMapper om;

    @BeforeAll
    public static void setUp() {
        om = new ObjectMapper();
    }

    @Test
    public void shouldInitializeUserWithDefaultRole() {
        final User user = new User();
        assertEquals(user.getRole(), UserRole.REGISTERED);
    }

    @ParameterizedTest(name = "Use the value {0} for the test")
    @ValueSource(strings = { "password", "salt" })
    public void shouldNotLeakSensibleDataWhenSerialized(String property) throws JsonProcessingException {
        final User user = new User();
        user.setSalt("salt");
        user.setPassword("password");

        final String userString = om.writeValueAsString(user);
        assertThrows(PathNotFoundException.class, () -> JsonPath.read(userString, "$." + property));
    }

    @Test
    public void shouldSerializeCorrectly() throws JsonProcessingException, JSONException {
        final User user = new User();
        user.setId(1L);
        user.setUsername("user1");
        user.setEncryptedPassword("password123");
        user.setRole(UserRole.ADMIN);
        user.setEmail("admin@alex.com");

        final String userString = om.writeValueAsString(user);
        final String expectedUserString = "{\"id\":1, \"username\": \"user1\", \"email\": \"admin@alex.com\", \"role\": \"ADMIN\", \"maxAllowedProcesses\":1}";
        JSONAssert.assertEquals(expectedUserString, userString, true);
    }

    @Test
    public void shouldNotSerializeProjects() {
        final Project p1 = new Project();
        p1.setId(2L);
        final Project p2 = new Project();
        p2.setId(3L);

        final User user = new User();
        user.setId(1L);
        user.setUsername("user");
        user.setEmail("user@alex.com");
        user.setProjectsOwner(Collections.singleton(p1));
        user.setProjectsMember(Collections.singleton(p2));

        assertThrows(PathNotFoundException.class, () -> {
            final String userString = om.writeValueAsString(user);
            JsonPath.read(userString, "projectsMember");
            JsonPath.read(userString, "projectsOwner");
        });
    }

    @Test
    public void shouldNotSerializeWebhooks() {
        final Webhook w = new Webhook();
        w.setId(2L);

        final User user = new User();
        user.setId(1L);
        user.setUsername("user");
        user.setEmail("user@alex.com");
        user.setWebhooks(Collections.singletonList(w));

        assertThrows(PathNotFoundException.class, () -> {
            final String userString = om.writeValueAsString(user);
            JsonPath.read(userString, "webhooks");
        });
    }

    @ParameterizedTest(name = "Use values \"{0}, {1}\" for the test")
    @CsvSource({
            "password123, true",
            "Password123, false"
    })
    public void shouldVerifyPassword(String password, boolean valid) {
        final var user = new User();
        user.setPassword("password123");
        user.setEncryptedPassword("password123");
        assertEquals(valid, user.isValidPassword(password));
    }
}
