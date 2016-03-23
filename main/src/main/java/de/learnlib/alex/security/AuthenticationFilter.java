/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.security;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
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
import java.util.regex.Pattern;

/**
 * Custom Request filter that is executed for each incoming request.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    /** The RegExp to describe a proper formatted 'Authorization' header field. */
    private static final Pattern PATTERN = Pattern.compile("bearer [a-z0-9-_]+\\.[a-z0-9-_]+\\.[a-z0-9-_]+",
                                                           Pattern.CASE_INSENSITIVE);

    /** The UserDAO to use. */
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
            if (jwt != null && PATTERN.matcher(jwt).matches()) {
                jwt = jwt.split(" ")[1];

                // check if the jwt is valid
                JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                        .setExpectedIssuer("ALEX")
                        .setVerificationKey(JWTHelper.getKey().getPublicKey())
                        .build();

                // get payload and get user id
                // if no exception was throws up to here you can be sure that the jwt has not been modified
                // and that the user that send the jwt is the one he seems to be
                JwtClaims claims = jwtConsumer.processToClaims(jwt);
                Long id = (Long) claims.getClaimsMap().get("userId");

                // get user from the db
                try {
                    user = userDAO.getById(id);
                } catch (NotFoundException e) {
                    user = null;
                }
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
    private static class AuthContext implements SecurityContext {

        /** The authenticated user or a new dummy one. */
        private User user;

        /**
         * @param user The user that should be available in the context
         */
        AuthContext(User user) {
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
         * @param role
         *         - The role to check
         * @return true, if the user is in the role; false otherwise.
         */
        @Override
        public boolean isUserInRole(String role) {
            return UserRole.valueOf(role) == user.getRole() || user.getRole() == UserRole.ADMIN;
        }

        // set this to true when ssl enabled
        @Override
        public boolean isSecure() {
            return false;
        }

        @Override
        public String getAuthenticationScheme() {
            return null;
        }
    }
}
