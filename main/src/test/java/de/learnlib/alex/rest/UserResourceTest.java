package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.UserHelper;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class UserResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = 2;

    @Mock
    private UserDAO userDAO;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private CounterDAO counterDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private FileDAO fileDAO;

    @Mock
    private User admin;


    @Mock
    private Project project;

    @Mock
    private Learner learner;

    private String adminToken;

    private User user;

    private String userToken;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        try {
            UserHelper.initFakeAdmin(admin);
            given(userDAO.getById(admin.getId())).willReturn(admin);
            given(userDAO.getByEmail(admin.getEmail())).willReturn(admin);
            adminToken = UserHelper.login(admin);
        } catch (NotFoundException e) {
            e.printStackTrace();
            fail();
        }

        return new ALEXTestApplication(userDAO, projectDAO, counterDAO, symbolGroupDAO, symbolDAO, learnerResultDAO,
                                       fileDAO, learner, UserResource.class);
    }

    @Override
    public void setUp() throws Exception {
        super.setUp();

        user = new User();
        user.setId(USER_TEST_ID);
        user.setEmail("fake_user@alex.example");
        user.setEncryptedPassword("fake_password");
        given(userDAO.getById(user.getId())).willReturn(user);
        given(userDAO.getByEmail(user.getEmail())).willReturn(user);
        userToken = UserHelper.login(user);
    }

    @Test
    public void shouldCreateAnUser() {
        user.setId(null);
        String userJson = "{\"email\":\"fake_user@alex.example\",\"password\":\"fake_password\"}";

        Response response = target("/users").request().post(Entity.json(userJson));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        verify(userDAO).create(user);
    }

    @Test
    public void shouldNotCreateAnUserWithAnInvalidEmail() {
        String userJson = "{\"email\":\"invalid mail\",\"password\":\"fake_password\"}";

        Response response = target("/users").request().post(Entity.json(userJson));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(userDAO, never()).create(any(User.class));
    }

    @Test
    public void shouldReturnOwnAccountInformation() throws NotFoundException {
        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", userToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO, atLeastOnce()).getById(USER_TEST_ID);
    }

    @Test
    public void shouldReturnAccountInformationToAnAdmin() throws NotFoundException {
        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO, atLeastOnce()).getById(USER_TEST_ID);
    }

    @Test
    public void shouldReturn403YouAreRequestingInformationAboutAnOtherUser() throws NotFoundException {
        Response response = target("/users/" + (USER_TEST_ID + 1)).request().header("Authorization", userToken).get();

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfAccountDoesNotExists() throws NotFoundException {
        given(userDAO.getById(user.getId())).willThrow(NotFoundException.class);

        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAllUsersToAnAdmin() {
        Response response = target("/users").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).getAll();
    }

    @Test
    public void shouldChangeThePassword() {
        String json = "{\"oldPassword\": \"fake_password\", \"newPassword\": \"real_password\"}";

        Response response = target("/users/" + USER_TEST_ID + "/password").request()
                                .header("Authorization", userToken).put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(user);
    }

    @Test
    public void ensureThatOnlyYouCanUpdateYourPassword() {
        String json = "{\"oldPassword\": \"fake_password\", \"newPassword\": \"real_password\"}";

        Response response = target("/users/" + USER_TEST_ID + "/password").request()
                                .header("Authorization", adminToken).put(Entity.json(json));

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void ensureThatTheOldPasswordIsCheckedBeforeUpdating() {
        String json = "{\"oldPassword\": \"nope, should not work!\", \"newPassword\": \"real_password\"}";

        Response response = target("/users/" + USER_TEST_ID + "/password").request()
                                .header("Authorization", userToken).put(Entity.json(json));

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldChangeYourOwnEMail() throws NotFoundException {
        given(userDAO.getByEmail("new_email@alex.example")).willThrow(NotFoundException.class);
        String json = "{\"email\": \"new_email@alex.example\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", userToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(user);
    }

    @Test
    public void shouldChangeAnEMailIfYouAreAnAdmin() throws NotFoundException {
        given(userDAO.getByEmail("new_email@alex.example")).willThrow(NotFoundException.class);
        String json = "{\"email\": \"new_email@alex.example\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", adminToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(user);
    }

    @Test
    public void shouldNotChangeTheEMailIfYouAreSomeoneElse() throws NotFoundException {
        given(userDAO.getByEmail("new_email@alex.example")).willThrow(NotFoundException.class);
        String json = "{\"email\": \"new_email@alex.example\"}";

        Response response = target("/users/" + (USER_TEST_ID + 1) + "/email").request()
                                .header("Authorization", userToken).put(Entity.json(json));

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldReturn404IfAnAdminWantsToChangeToEmailOfAnInvalidUser() throws NotFoundException {
        given(userDAO.getById(USER_TEST_ID)).willThrow(NotFoundException.class);
        String json = "{\"email\": \"new_email@alex.example\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", adminToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldOnlyChangeToValidEmails() {
        String json = "{\"email\": \"should not work\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", userToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldOnlyChangeToANewEmails() {
        String json = "{\"email\": \"fake_user@alex.example\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", userToken)
                .put(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldOnlyChangeToAFreeEmail() throws NotFoundException {
        given(userDAO.getByEmail("already_taken@alex.example")).willReturn(user);
        String json = "{\"email\": \"already_taken@alex.example\"}";

        Response response = target("/users/" + USER_TEST_ID + "/email").request().header("Authorization", userToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(user);
    }

    @Test
    public void shouldPromoteAnUser() {
        Response response = target("/users/" + USER_TEST_ID + "/promote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(user);
    }

    @Test
    public void shouldReturn404IfUserToPromoteDoesNotExits() throws NotFoundException {
        given(userDAO.getById(USER_TEST_ID)).willThrow(NotFoundException.class);

        Response response = target("/users/" + USER_TEST_ID + "/promote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDemoteAnUser() {
        Response response = target("/users/" + USER_TEST_ID + "/demote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(user);
    }

    @Test
    @Ignore // sometimes this test works, sometimes it wont work... Seems to be a timing issue.
    public void shouldDemoteAnAdmin() {
        List<User> adminList = Arrays.asList(new User[] {admin, user}); // user is here a fake admin
        given(userDAO.getAllByRole(UserRole.ADMIN)).willReturn(adminList);

        // Timing issue right around here :(

        Response response = target("/users/" + admin.getId() + "/demote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).update(admin);
    }


    @Test
    public void shouldReturn404IfUserToDemoteDoesNotExits() throws NotFoundException {
        given(userDAO.getById(USER_TEST_ID)).willThrow(NotFoundException.class);

        Response response = target("/users/" + USER_TEST_ID + "/demote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotDemoteTheLastAdmin() throws NotFoundException {
        List<User> adminList = Arrays.asList(new User[] {admin});
        given(userDAO.getAllByRole(UserRole.ADMIN)).willReturn(adminList);

        Response response = target("/users/" + admin.getId() + "/demote").request().header("Authorization", adminToken)
                                .put(Entity.json(""));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(userDAO, never()).update(admin);
    }

    @Test
    public void shouldDeleteOwnAccount() throws NotFoundException {
        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", userToken)
                                .delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(userDAO).delete(USER_TEST_ID);
    }

    @Test
    public void shouldDeleteAnUserAsAdmin() throws NotFoundException {
        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", adminToken)
                                .delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(userDAO).delete(USER_TEST_ID);
    }

    @Test
    public void shouldNotDeleteOtherAccount() throws NotFoundException {
        Response response = target("/users/" + (USER_TEST_ID + 1)).request().header("Authorization", userToken)
                                .delete();

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
        verify(userDAO, never()).delete(USER_TEST_ID + 1);
    }

    @Test
    public void shouldReturn404IfUserToDeleteWasNotFound() throws NotFoundException {
        willThrow(NotFoundException.class).given(userDAO).delete(USER_TEST_ID);

        Response response = target("/users/" + USER_TEST_ID).request().header("Authorization", adminToken)
                                .delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldLogin() throws NotFoundException {
        String json = "{\"email\": \"fake_user@alex.example\", \"password\": \"fake_password\"}";

        Response response = target("/users/login").request().post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(userDAO).getByEmail(user.getEmail());
    }

    @Test
    public void shouldNotLoginIfTheWrongEmailIsProvided() throws NotFoundException {
        given(userDAO.getByEmail("fake_user@alex.example")).willThrow(NotFoundException.class);

        String json = "{\"email\": \"fake_user@alex.example\", \"password\": \"fake_password\"}";

        Response response = target("/users/login").request().post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(userDAO).getByEmail(user.getEmail());
    }

    @Test
    public void shouldNotLoginIfTheWrongPasswordIsProvided() throws NotFoundException {
        String json = "{\"email\": \"fake_user@alex.example\", \"password\": \"nope, nope, nope!\"}";

        Response response = target("/users/login").request().post(Entity.json(json));

        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), response.getStatus());
        verify(userDAO).getByEmail(user.getEmail());
    }

}
