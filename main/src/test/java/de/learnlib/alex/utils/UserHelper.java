package de.learnlib.alex.utils;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.security.JWTHelper;
import org.jose4j.lang.JoseException;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;

public class UserHelper {

    private UserHelper() {
    }

    public static String login(User user) {
        String token = null;
        try {
            token = JWTHelper.generateJWT(user);
        } catch (JoseException e) {
            e.printStackTrace();
        }
        return "Bearer " + token;
    }

    public static void initFakeAdmin(User user) {
        given(user.getId()).willReturn(1L);
        given(user.getEmail()).willReturn("admin@alex.example");
        given(user.getRole()).willReturn(UserRole.ADMIN);
        given(user.isValidPassword(anyString())).willReturn(true);
    }

}
