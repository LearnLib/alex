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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.SettingsApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.settings.entities.Settings;
import java.util.Arrays;
import java.util.List;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

public class UserResourceIT extends AbstractResourceIT {

    private UserApi userApi;

    private SettingsApi settingsApi;

    private String adminJwt;

    @BeforeEach
    public void pre() {
        userApi = new UserApi(client, port);
        settingsApi = new SettingsApi(client, port);
        adminJwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    }

    @Test
    public void shouldCreateAnAccount() {
        final Response res = userApi.create(createUserJson("test@test.de", "test"));

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        JsonPath.read(res.readEntity(String.class), "id");
    }

    @Test
    public void shouldFailToGetAJwtIfUserIsInvalid() {
        final Response res = client.target(userApi.url() + "/login").request()
                .post(Entity.json(createUserJson("test@test.de", "test")));

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());

        final String body = res.readEntity(String.class);
        assertThrows(IllegalArgumentException.class, () -> JsonPath.read(body, "token"));
    }

    @Test
    public void shouldNotCreateAnAdminAccount() {
        final Response res = userApi.create(createUserJson("test@test.de", "test", "ADMIN"));

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals("REGISTERED", JsonPath.read(res.readEntity(String.class), "role"));
    }

    @ParameterizedTest(name = "Use value \"{0}\" for the test")
    @ValueSource(strings = { "", "asd", "@test.de" })
    public void shouldNotCreateAUserWithInvalidEmail(String email) {
        final Response res = userApi.create(createUserJson(email, "test"));
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

        final Response res2 = userApi.changeRole(userId, UserRole.ADMIN, jwt);

        assertEquals(HttpStatus.FORBIDDEN.value(), res2.getStatus());
    }

    @Test
    public void adminShouldMakeOtherUsersAdmin() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");

        userApi.changeRole(userId, UserRole.ADMIN, adminJwt);

        final String jwtUser = userApi.login("test@test.de", "test");
        final Response res2 = userApi.getProfile(jwtUser);

        assertEquals("ADMIN", JsonPath.read(res2.readEntity(String.class), "role"));
    }

    @Test
    public void adminShouldMakeOtherAdminsUsers() {
        final Response res1 = userApi.create(createUserJson("test@test.de", "test"), adminJwt);
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");
        userApi.changeRole(userId, UserRole.ADMIN, adminJwt);
        userApi.changeRole(userId, UserRole.REGISTERED, adminJwt);

        final String jwtUser = userApi.login("test@test.de", "test");
        final Response res2 = userApi.getProfile(jwtUser);

        assertEquals("REGISTERED", JsonPath.read(res2.readEntity(String.class), "role"));
    }

    @Test
    public void adminShouldNotMakeHimselfUserIfHeIsOnlyAdmin() {
        final Response res1 = userApi.getProfile(adminJwt);
        final int userId = JsonPath.read(res1.readEntity(String.class), "id");

        userApi.changeRole(userId, UserRole.REGISTERED, adminJwt);

        final Response res2 = userApi.getProfile(adminJwt);
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

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
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

        final Response res = userApi.delete(userId, adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
    }

    @Test
    public void adminShouldNotDeleteHimselfIfHeIsTheOnlyAdmin() {
        final Response res = userApi.delete(1, adminJwt);

        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
    }

    @Test
    public void adminShouldDeleteHimselfIfHeIsNotTheOnlyAdmin() {
        final Response res1 = userApi.create(createUserJson("admin2@alex.example", "admin"), adminJwt);

        final int id = JsonPath.read(res1.readEntity(String.class), "id");
        userApi.changeRole(id, UserRole.ADMIN, adminJwt);

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

        final Response res = userApi.getAll(adminJwt);
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

        final Response res3 = userApi.delete(userIds, adminJwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());

        final Response res4 = userApi.getAll(adminJwt);
        assertEquals(1, objectMapper.readTree(res4.readEntity(String.class)).size());
    }

    @Test
    public void adminShouldNotDeleteMultipleUsersIfItContainsAnInvalidId() throws Exception {
        final Response res1 = userApi.create(createUserJson("test1@test.de", "test"));
        final Response res2 = userApi.create(createUserJson("test2@test.de", "test"));
        final Response res3 = userApi.getAll(adminJwt);

        final int userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        final int userId2 = JsonPath.read(res2.readEntity(String.class), "id");
        final List<Integer> userIds = Arrays.asList(userId1, userId2, 10);

        final Response res4 = userApi.delete(userIds, adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res4.getStatus());

        final Response res5 = userApi.getAll(adminJwt);

        JSONAssert.assertEquals(res3.readEntity(String.class), res5.readEntity(String.class), true);
    }

    @Test
    public void shouldNotCreateAnonymousUserIfRegistrationIsDisabled() throws Exception {
        final Settings settings = settingsApi.get().readEntity(Settings.class);
        settings.setAllowUserRegistration(false);
        settingsApi.update(settings, adminJwt);

        final Response res1 = userApi.create(createUserJson("test@test.de", "test"));
        assertEquals(HttpStatus.FORBIDDEN.value(), res1.getStatus());
        JsonPath.read(res1.readEntity(String.class), "message");

        shouldNotLoginWith404("test@test.de", "test");
    }

    private void shouldLogin(String email, String password) {
        final Response res = userApi.loginRaw(email, password);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        JsonPath.read(res.readEntity(String.class), "token");
    }

    private void shouldNotLoginWith404(String email, String password) {
        final Response res = userApi.loginRaw(email, password);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        checkIsRestError(res.readEntity(String.class));
    }

    private void shouldNotLoginWith400(String email, String password) {
        final Response res = userApi.loginRaw(email, password);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        checkIsRestError(res.readEntity(String.class));
    }

    @Test
    public void registeredUserShouldNotCreateOtherUsers() throws Exception {
        userApi.create(createUserJson("test@test.de", "test"));
        final String jwt = userApi.login("test@test.de", "test");
        final Response res = userApi.create(createUserJson("test2@test.de", "test"), jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        shouldNotLoginWith404("test2@test.de", "test");
    }

    @Test
    public void shouldChangePassword() throws Exception {
        final User user = userApi.create(createUserJson("test@test.de", "test")).readEntity(User.class);
        final String jwt = userApi.login(user.getEmail(), "test");

        final Response res = userApi.changePassword(user.getId(), "test", "new", jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        shouldNotLoginWith400("test@test.de", "test");
        shouldLogin("test@test.de", "new");
    }

    @Test
    public void userShouldNotChangePasswordOfAnotherUser() throws Exception {
        final User user1 = userApi.create(createUserJson("test1@test.de", "test")).readEntity(User.class);
        final User user2 = userApi.create(createUserJson("test2@test.de", "test")).readEntity(User.class);

        final String jwt = userApi.login(user1.getEmail(), "test");

        final Response res = userApi.changePassword(user2.getId(), "test", "new", jwt);
        assertEquals(HttpStatus.FORBIDDEN.value(), res.getStatus());
        shouldLogin("test2@test.de", "test");
    }

    @Test
    public void userShouldNotChangeHisUsername() {
        final String user = createUserJson("test@test.de", "test", "test");

        final Response res1 = userApi.create(user);
        final String jwt = userApi.login("test@test.de", "test");

        final User userPre = res1.readEntity(User.class);

        final Response res2 = userApi.changeUsername(userPre.getId(), "test2", jwt);
        assertEquals(HttpStatus.FORBIDDEN.value(), res2.getStatus());

        final Response res3 = userApi.get(userPre.getId(), jwt);
        assertEquals("test", JsonPath.read(res3.readEntity(String.class), "username"));
    }

    @Test
    public void adminShouldChangeUsername() {
        final String user = createUserJson("test@test.de", "test", "test");

        final Response res1 = userApi.create(user);
        final String jwt = userApi.login("test@test.de", "test");

        final User userPre = res1.readEntity(User.class);

        final Response res2 = userApi.changeUsername(userPre.getId(), "test2", adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        final Response res3 = userApi.get(userPre.getId(), jwt);
        assertEquals("test2", JsonPath.read(res3.readEntity(String.class), "username"));
    }

    @Test
    public void cannotCreateUserWithoutUsernameAsAnonymousUser() throws Exception {
        cannotCreateUser(null);
    }

    @Test
    public void cannotCreateUserWithoutUsernameAsAdmin() throws Exception {
        cannotCreateUser(adminJwt);
    }

    @Test
    public void cannotCreateUserWithSameUsernameTwice() throws Exception {
        final String user1 = createUserJson("test1@test.de", "test", "test");
        final String user2 = createUserJson("test2@test.de", "test", "test");

        final Response res1 = userApi.create(user1);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final String usersPre = userApi.getAll(adminJwt).readEntity(String.class);

        final Response res2 = userApi.create(user2);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());

        final String usersPost = userApi.getAll(adminJwt).readEntity(String.class);
        JSONAssert.assertEquals(usersPre, usersPost, true);
    }

    @Test
    public void shouldGetTheCurrentProfileAsAdmin() {
        final Response res = userApi.getProfile(adminJwt);
        final String email = JsonPath.read(res.readEntity(String.class), "email");
        assertEquals(email, ADMIN_EMAIL);
    }

    @Test
    public void shouldFailToDeleteUsersWhenContainingOwnId() throws Exception {
        final Response res1 = userApi.create(createUserJson("test1@test.de", "test"));
        final Response res2 = userApi.create(createUserJson("test2@test.de", "test"));
        final Response res3 = userApi.getProfile(adminJwt);

        final int adminId = JsonPath.read(res3.readEntity(String.class), "id");
        final int userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        final int userId2 = JsonPath.read(res2.readEntity(String.class), "id");
        final List<Integer> userIds = Arrays.asList(userId1, userId2, adminId);

        final Response res4 = userApi.delete(userIds, adminJwt);
        assertEquals(3, objectMapper.readTree(res4.readEntity(String.class)).size());
    }


    @ParameterizedTest(name = "search for \"{0}\", expect user \"{1}, {2}\" for the test")
    @CsvSource({
            "abc, abc, abc@test.de",
            "abc@test.de, abc, abc@test.de",
            "def, def, def@test.de",
            "def@test.de, def, def@test.de"
    })
    public void shouldSearchUserByEmail(String searchValue, String expectedUsername, String expectedEmail) {
        userApi.create(createUserJson("abc@test.de", "abc", "test"));
        userApi.create(createUserJson("def@test.de", "def", "test"));

        final Response res = userApi.search(searchValue, adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        final List<User> users = res.readEntity(new GenericType<>() {
        });
        assertEquals(1, users.size());
        assertEquals(expectedUsername, users.get(0).getUsername());
        assertEquals(expectedEmail, users.get(0).getEmail());
    }

    @Test
    public void shouldReturnEmptyListForEmptySearchResult() {
        createDemoUsers();
        final Response res = userApi.search("unknown", adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        final List<User> users = res.readEntity(new GenericType<>() {
        });
        assertEquals(0, users.size());
    }

    @Test
    public void shouldGetManyUsersByIds() {
        final List<User> demoUsers = createDemoUsers();
        final Response res = userApi.getAll(Arrays.asList(demoUsers.get(0).getId(), demoUsers.get(1).getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        final List<User> users = res.readEntity(new GenericType<>() {
        });
        assertEquals(2, users.size());
        assertTrue(users.stream().anyMatch(u -> u.getId().equals(demoUsers.get(0).getId())));
        assertTrue(users.stream().anyMatch(u -> u.getId().equals(demoUsers.get(1).getId())));
    }

    @Test
    public void shouldFailToGetManyUsersByIdsIfIdIsNotFound() {
        final List<User> demoUsers = createDemoUsers();
        final Response res = userApi.getAll(Arrays.asList(demoUsers.get(0).getId(), -1L), adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
    }

    private void cannotCreateUser(String jwt) throws Exception {
        final String user = "{\"email\":\"test@test.de\",\"password\":\"test\"}";

        final String usersPre = userApi.getAll(adminJwt).readEntity(String.class);

        final Response res = jwt == null ? userApi.create(user) : userApi.create(user, jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        final String usersPost = userApi.getAll(adminJwt).readEntity(String.class);
        JSONAssert.assertEquals(usersPre, usersPost, true);
    }

    private String createUserJson(String email, String password) {
        return "{"
                + "\"username\":\"" + email.split("@")[0] + "\""
                + ",\"email\":\"" + email + "\""
                + ",\"password\":\"" + password + "\""
                + "}";
    }

    private String createUserJson(String email, String username, String password) {
        return "{"
                + "\"username\":\"" + username + "\""
                + ",\"email\":\"" + email + "\""
                + ",\"password\":\"" + password + "\""
                + "}";
    }

    private List<User> createDemoUsers() {
        final User user1 = userApi.create(createUserJson("user1@test.de", "user1", "test"))
                .readEntity(User.class);
        final User user2 = userApi.create(createUserJson("user2@test.de", "user2", "test"))
                .readEntity(User.class);
        final User user3 = userApi.create(createUserJson("user3@test.de", "user3", "test"))
                .readEntity(User.class);

        return Arrays.asList(user1, user2, user3);
    }
}
