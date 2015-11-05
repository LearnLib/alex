package de.learnlib.alex.security;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;

import javax.annotation.Priority;
import javax.inject.Inject;
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
public class AuthenticationFilter implements ContainerRequestFilter {

    @Inject
    private UserDAO userDAO;

    /**
     * checks for the availability of a JWT and puts the corresponding user into a SecurityContext that can be injected
     * into Resources. Uses dummy user without role if no JWT is available.
     *
     * @param requestContext The context of the request
     * @throws IOException
     */
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        try {
            User user;

            // get the jwt from Authorization Header and split at 'Bearer [token]'
            String jwt = requestContext.getHeaderString("Authorization");
            if (jwt != null) {
                jwt = jwt.split(" ")[1];

                // check if the jwt is valid
                JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                        .setExpectedIssuer("ALEX")
                        .setVerificationKey(RsaKeyHolder.getKey().getPublicKey())
                        .build();

                // get payload and get user id
                // if no exception was throws up to here you can be sure that the jwt has not been modified
                // and that the user that send the jwt is the one he seems to be
                JwtClaims claims = jwtConsumer.processToClaims(jwt);
                Long id = (Long) claims.getClaimsMap().get("userId");

                // get user from the db
                user = userDAO.getById(id);
            } else {

                // create dummy guest user
                user = new User();
                user.setRole(null);
            }

            // create injectable security context with user here
            requestContext.setSecurityContext(new AuthContext(user));

        } catch (InvalidJwtException e) {
            e.printStackTrace();
        }
    }

    /**
     * Custom Security context that allows to save a user instance in the context.
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
