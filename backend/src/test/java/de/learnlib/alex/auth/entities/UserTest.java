/*
 * Copyright 2015 - 2020 TU Dortmund
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.webhooks.entities.Webhook;
import org.json.JSONException;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import java.util.Collections;

public class UserTest {

    private static ObjectMapper om;

    @BeforeClass
    public static void setUp() {
        om = new ObjectMapper();
    }

    @Test
    public void shouldInitializeUserWithDefaultRole() {
        final User user = new User();
        Assert.assertEquals(user.getRole(), UserRole.REGISTERED);
    }

    @Test(expected = PathNotFoundException.class)
    public void shouldNotLeakPasswordWhenSerialized() throws JsonProcessingException {
        final User user = new User();
        user.setSalt("salt");
        user.setPassword("password");

        final String userString = om.writeValueAsString(user);
        JsonPath.read(userString, "$.password");
    }

    @Test(expected = PathNotFoundException.class)
    public void shouldNotLeakSaltWhenSerialized() throws JsonProcessingException {
        final User user = new User();
        user.setSalt("salt");
        user.setPassword("password");

        final String userString = om.writeValueAsString(user);
        JsonPath.read(userString, "$.salt");
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
        final String expectedUserString = "{\"id\":1, \"username\": \"user1\", \"email\": \"admin@alex.com\", \"role\": \"ADMIN\"}";
        System.out.println(userString);
        JSONAssert.assertEquals(expectedUserString, userString, true);
    }

    @Test(expected = PathNotFoundException.class)
    public void shouldNotSerializeProjects() throws Exception {
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

        final String userString = om.writeValueAsString(user);
        JsonPath.read(userString, "projectsMember");
        JsonPath.read(userString, "projectsOwner");
    }

    @Test(expected = PathNotFoundException.class)
    public void shouldNotSerializeWebhooks() throws Exception {
        final Webhook w = new Webhook();
        w.setId(2L);

        final User user = new User();
        user.setId(1L);
        user.setUsername("user");
        user.setEmail("user@alex.com");
        user.setWebhooks(Collections.singletonList(w));

        final String userString = om.writeValueAsString(user);
        JsonPath.read(userString, "webhooks");
    }

    @Test
    public void shouldVerifyPasswordCorrectly() {
        final User user = new User();
        user.setPassword("password123");
        user.setEncryptedPassword("password123");

        Assert.assertTrue(user.isValidPassword("password123"));
    }

    @Test
    public void shouldFailWhenPasswordIsNotCorrect() {
        final User user = new User();
        user.setPassword("password123");
        user.setEncryptedPassword("password123");

        Assert.assertFalse(user.isValidPassword("Password123"));
    }
}
