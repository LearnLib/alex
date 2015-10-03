package de.learnlib.alex;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.security.UserPrincipal;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.security.Principal;

/**
 * Custom Request filter that is executed for each incoming request.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class FakeAuthenticationFilter implements ContainerRequestFilter {

    public static final Long FAKE_USER_ID = 21L;

    /**
     * checks for the availability of a JWT and puts the corresponding user into a SecurityContext that can be injected
     * into Resources. Uses dummy user without role if no JWT is available.
     *
     * @param requestContext The context of the request
     * @throws IOException
     */
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        User user = new User();
        user.setId(FAKE_USER_ID);
        user.setRole(UserRole.ADMIN);

        // create injectable security context with user here
        requestContext.setSecurityContext(new AuthContext(user));
    }

    /**
     * Custom Security context that allows to save a user instance in the context
     */
    private class AuthContext implements SecurityContext {

        private User user;

        /**
         * @param user The user that should be available in the context
         */
        public AuthContext(User user) {
            this.user = user;
        }

        /**
         * @return A Principal Object that contains the user
         */
        @Override
        public Principal getUserPrincipal() {
            return new UserPrincipal(user);
        }

        /**
         * Checks for the role of the user.
         * Allow an admin to do everything a registered one can also do
         *
         * @param role - The role to check
         * @return
         */
        @Override
        public boolean isUserInRole(String role) {
            if (user.getRole() == UserRole.ADMIN) {
                return true;
            } else {
                return UserRole.valueOf(role) == user.getRole();
            }
        }

        @Override
        public boolean isSecure() {
            // TODO: set this to true when ssl enabled
            return false;
        }

        @Override
        public String getAuthenticationScheme() {
            return null;
        }
    }
}
