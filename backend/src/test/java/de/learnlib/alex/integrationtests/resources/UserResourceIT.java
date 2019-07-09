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

package de.learnlib.alex.integrationtests.resources;

import com.fasterxml.jackson.databind.JsonNode;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class UserResourceIT extends AbstractResourceIT {

    private UserApi userApi;

    @Before
    public void pre() {
        userApi = new UserApi(client, port);
    }

    @Test
    public void shouldHaveCreatedAnAdminAccountOnStartUp() {
        final Response res = client.target(userApi.url() + "/login").request()
                .post(Entity.json(createUserJson(ADMIN_EMAIL, ADMIN_PASSWORD)));

        JsonPath.read(res.readEntity(String.class), "token");
    }

    @Test
    public void shouldCreateAnAccount() {
        final Response res = userApi.create(createUserJson("test@test.de", "test"));

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        JsonPath.read(res.readEntity(String.class), "id");
    }

    @Test(expected = PathNotFoundException.class)
    public void shouldFailToGetAJwtIfUserIsInvalid() {
        final Response res = client.target(userApi.url() + "/login").request()
                .post(Entity.json(createUserJson("test@test.de", "test")));

        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());

        final String body = res.readEntity(String.class);
        JsonPath.read(body, "token");
    }

    @Test
    public void shouldNotCreateAnAdminAccount() {
        final Response res = userApi.create(createUserJson("test@test.de", "test", "ADMIN"));

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals("REGISTERED", JsonPath.read(res.readEntity(String.class), "role"));
    }

    @Test
    public void adminShouldCreateAnAdminAccount() {
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        final Response res = userApi.create(createUserJson("test@test.de", "test", "ADMIN"), jwt);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals("ADMIN", JsonPath.read(res.readEntity(String.class), "role"));
    }

    @Test
    public void shouldNotCreateAUserWithoutEmail() {
        final Response res = userApi.create(createUserJson("", "test"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateAccountWithInvalidEmail() {
        final Response res = userApi.create(createUserJson("asdasd", "test"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateTheSameUserTwice() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final Response res2 = userApi.create(createUserJson("test@test.de", "test"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());
    }

    @Test
    public void userShouldNotBeAbleToPromoteHimself() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));

        final int userId = JsonPath.read(res1.readEntity(String.class), "id");
        final String jwt = userApi.login("test@test.de", "test");

        final Response res2 = userApi.promote(userId, jwt);

        assertEquals(HttpStatus.FORBIDDEN.value(), res2.getStatus());
    }

    @Test
    public void adminShouldMakeOtherUsersAdmin() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");

        final String jwtAdmin = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        userApi.promote(userId, jwtAdmin);

        final String jwtUser = userApi.login("test@test.de", "test");
        final Response res2 = userApi.getProfile(jwtUser);

        assertEquals("ADMIN", JsonPath.read(res2.readEntity(String.class), "role"));
    }

    @Test
    public void adminShouldMakeOtherAdminsUsers() {
        final String jwtAdmin = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final Response res1 = userApi.create(createUserJson("test@test.de", "test", "ADMIN"), jwtAdmin);
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");

        userApi.demote(userId, jwtAdmin);

        final String jwtUser = userApi.login("test@test.de", "test");
        final Response res2 = userApi.getProfile(jwtUser);

        assertEquals("REGISTERED", JsonPath.read(res2.readEntity(String.class), "role"));
    }

    @Test
    public void adminShouldNotMakeHimselfUserIfHeIsOnlyAdmin() {
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        final Response res1 = userApi.getProfile(jwt);
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");

        userApi.demote(userId, jwt);

        final Response res2 = userApi.getProfile(jwt);
        assertEquals("ADMIN", JsonPath.read(res2.readEntity(String.class), "role"));
    }

    @Test
    public void userShouldNotBeAbleToDemoteAnAdmin() {
        userApi.create(createUserJson("test@test.de", "test"));
        final String jwt = userApi.login("test@test.de", "test");

        final Response res = userApi.delete(1, jwt);
        assertEquals(HttpStatus.FORBIDDEN.value(), res.getStatus());
    }

    @Test
    public void shouldFailToLoginWithWrongPassword() {
        userApi.create(createUserJson("test@test.de", "test"));
        final Response res = userApi.loginRaw("test@test.de", "123");

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        assertFalse(res.readEntity(String.class).contains("Bearer: "));
    }

    @Test
    public void userShouldNotDeleteAnotherUser() {
        userApi.create(createUserJson("test1@test.de", "test"));
        final Response res1 = userApi.create(createUserJson("test2@test.de", "test"));

        final int id = JsonPath.read(res1.readEntity(String.class), "id");
        final String jwt = userApi.login("test1@test.de", "test");

        final Response res = userApi.delete(id, jwt);

        assertEquals(HttpStatus.FORBIDDEN.value(), res.getStatus());
    }

    @Test
    public void adminShouldDeleteAUser() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));

        final int userId = JsonPath.read(res1.readEntity(String.class), "id");
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final Response res = userApi.delete(userId, jwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
    }

    @Test
    public void adminShouldNotDeleteHimselfIfHeIsTheOnlyAdmin() {
        final String jwt = userApi.login(ADMIN_EMAIL, "admin");
        final Response res = userApi.delete(1, jwt);

        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
    }

    @Test
    public void adminShouldDeleteHimselfIfHeIsNotTheOnlyAdmin() {
        final String jwtAdmin1 = userApi.login(ADMIN_EMAIL, "admin");
        final Response res1 = userApi.create(createUserJson("admin2@alex.example", "admin", "ADMIN"), jwtAdmin1);

        final int id = JsonPath.read(res1.readEntity(String.class), "id");
        final String jwtAdmin2 = userApi.login("admin2@alex.example", "admin");

        final Response res2 = userApi.delete(id, jwtAdmin2);
        assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
    }

    @Test
    public void userShouldNotGetAllUsers() {
        userApi.create(createUserJson("test@test.de", "test"));
        final String jwt = userApi.login("test@test.de", "test");
        final Response res = userApi.getAll(jwt);

        assertEquals(HttpStatus.FORBIDDEN.value(), res.getStatus());
    }

    @Test
    public void adminShouldGetAllUsers() throws Exception {
        userApi.create(createUserJson("test1@test.de", "test"));
        userApi.create(createUserJson("test2@test.de", "test"));

        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        final Response res = userApi.getAll(jwt);

        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final JsonNode users = objectMapper.readTree(res.readEntity(String.class));

        assertEquals(3, users.size());
    }

    @Test
    public void adminShouldDeleteMultipleUsersAtOnce() throws Exception {
        final Response res1 = userApi.create(createUserJson("test1@test.de", "test"));
        final Response res2 = userApi.create(createUserJson("test2@test.de", "test"));

        final int userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        final int userId2 = JsonPath.read(res2.readEntity(String.class), "id");
        final List<Integer> userIds = Arrays.asList(userId1, userId2);

        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        final Response res3 = userApi.delete(userIds, jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());

        final Response res4 = userApi.getAll(jwt);
        assertEquals(1, objectMapper.readTree(res4.readEntity(String.class)).size());
    }

    @Test
    public void adminShouldNotDeleteMultipleUsersIfItContainsAnInvalidId() throws Exception {
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final Response res1 = userApi.create(createUserJson("test1@test.de", "test"));
        final Response res2 = userApi.create(createUserJson("test2@test.de", "test"));
        final Response res3 = userApi.getAll(jwt);

        final int userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        final int userId2 = JsonPath.read(res2.readEntity(String.class), "id");
        final List<Integer> userIds = Arrays.asList(userId1, userId2, 10);

        final Response res4 = userApi.delete(userIds, jwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res4.getStatus());

        final Response res5 = userApi.getAll(jwt);

        JSONAssert.assertEquals(res3.readEntity(String.class), res5.readEntity(String.class), true);
    }

    @Test
    public void shouldGetTheCurrentProfileAsAdmin() throws Exception {
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        final Response res = userApi.getProfile(jwt);
        final String email = JsonPath.read(res.readEntity(String.class), "email");
        assertEquals(email, ADMIN_EMAIL);
    }

    @Test
    public void shouldFailToDeleteUsersWhenContainingOwnId() throws Exception {
        final String jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final Response res1 = userApi.create(createUserJson("test1@test.de", "test"));
        final Response res2 = userApi.create(createUserJson("test2@test.de", "test"));
        final Response res3 = userApi.getProfile(jwt);

        final int adminId = JsonPath.read(res3.readEntity(String.class), "id");
        final int userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        final int userId2 = JsonPath.read(res2.readEntity(String.class), "id");
        final List<Integer> userIds = Arrays.asList(userId1, userId2, adminId);

        final Response res4 = userApi.delete(userIds, jwt);
        assertEquals(3, objectMapper.readTree(res4.readEntity(String.class)).size());
    }

    private String createUserJson(String email, String password) {
        return "{"
                + "\"email\":\"" + email + "\""
                + ",\"password\":\"" + password + "\""
                + "}";
    }

    private String createUserJson(String email, String password, String role) {
        return "{"
                + "\"email\":\"" + email + "\""
                + ",\"password\":\"" + password + "\""
                + ",\"role\":\"" + role + "\""
                + "}";
    }
}
