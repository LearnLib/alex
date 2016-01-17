package de.learnlib.alex.utils;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;

public class UserHelper {

    private UserHelper() {
    }

    public static String login(Client client, String baseUrl) {
        String json =  "{\"email\": \"admin@alex.example\", \"password\": \"admin\"}";
        Response response = client.target(baseUrl + "/users/login").request().post(Entity.json(json));
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        String responseAsString = response.readEntity(String.class);
        String token = "Bearer " + responseAsString.split("\"")[3];

        return token;
    }

    public static void initFakeAdmin(User user) {
        given(user.getId()).willReturn(1L);
        given(user.getEmail()).willReturn("admin@alex.example");
        given(user.getRole()).willReturn(UserRole.ADMIN);
        given(user.isValidPassword(anyString())).willReturn(true);
    }

}
