package de.learnlib.alex.config.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.UserHelper;
import de.learnlib.alex.config.dao.SettingsDAO;
import de.learnlib.alex.config.entities.Settings;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SettingsResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = 2;
    private static final long SETTINGS_ID = 1;

    @Mock
    private SettingsDAO settingsDAO;

    @Mock
    private UserDAO userDAO;

    private String adminToken;
    private User user;
    private String userToken;
    private Settings settings;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(userDAO, SettingsResource.class);
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(settingsDAO).to(SettingsDAO.class);
            }
        });
        return testApplication;
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        settings = new Settings();
        settings.setId(SETTINGS_ID);

        user = new User();
        user.setId(USER_TEST_ID);
        user.setEmail("fake_user@alex.example");
        user.setEncryptedPassword("fake_password");
        given(userDAO.getById(user.getId())).willReturn(user);
        given(userDAO.getByEmail(user.getEmail())).willReturn(user);
        userToken = UserHelper.login(user);
    }

    @Test
    public void shouldGetTheSettings() throws Exception {
        given(settingsDAO.get()).willReturn(settings);

        Response response = target("/settings")
                                .request()
                                .header("Authorization", adminToken)
                                .get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String json = response.readEntity(String.class);
        String expectedJSON = "{\"driver\":{\"chrome\":\"\",\"defaultDriver\":\"htmlunitdriver\",\"edge\":\"\",\"firefox\":\"\"},\"id\":1}";
        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldReturnBadRequestIfSettingsHaveNotBeenCreated() throws Exception {
        given(settingsDAO.get()).willReturn(null);

        Response response = target("/settings")
                                .request()
                                .header("Authorization", adminToken)
                                .get();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldUpdateTheSettings() throws Exception {
        String json = "{\"id\":1,\"driver\":{\"chrome\":\"\",\"edge\":\"\",\"firefox\":\"\"}}";

        Response response = target("/settings")
                                .request()
                                .header("Authorization", adminToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(settingsDAO).update(settings);
    }

    @Test
    public void shouldNotUpdateTheSettingsIfSettingsAreNotValid() throws Exception {
        String json = "{\"id\":1,\"driver\":{\"chrome\":\"NOT VALID\",\"firefox\":\"THIS IS WRONG!\"}}";

        Response response = target("/settings")
                                .request()
                                .header("Authorization", adminToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(settingsDAO, never()).update(settings);
    }

    @Test
    public void shouldNotBeAllowedToUpdateSettingsAsRegisteredUser() throws Exception {
        String json = "{\"id\":1,\"driver\":{\"chrome\":\"\",\"firefox\":\"\"}}";

        Response response = target("/settings")
                                .request()
                                .header("Authorization", userToken)
                                .put(Entity.json(json));

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), response.getStatus());
        verify(settingsDAO, never()).update(settings);
    }
}
