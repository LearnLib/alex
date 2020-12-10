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

package de.learnlib.alex.security;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.NumericDate;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class AuthenticationProvider {

    /**
     * The RegExp to describe a proper formatted 'Authorization' header field.
     */
    private static final Pattern PATTERN = Pattern.compile("bearer [a-z0-9-_]+\\.[a-z0-9-_]+\\.[a-z0-9-_]+",
            Pattern.CASE_INSENSITIVE);

    /**
     * The UserDAO to use.
     */
    private final UserDAO userDAO;

    public AuthenticationProvider(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public Principal getAuthentication(String jwt) throws Exception {
        User user;
        if (jwt != null && PATTERN.matcher(jwt).matches()) {
            jwt = jwt.split(" ")[1];

            // check if the jwt is valid
            final JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                    .setExpectedIssuer("ALEX")
                    .setVerificationKey(JwtHelper.getKey().getPublicKey())
                    .build();

            // get payload and get user id
            // if no exception was throws up to here you can be sure that the jwt has not been modified
            // and that the user that send the jwt is the one he seems to be
            final JwtClaims claims = jwtConsumer.processToClaims(jwt);
            if (NumericDate.now().isAfter(claims.getExpirationTime())) {
                throw new Exception();
            }

            final Long userId = (Long) claims.getClaimsMap().get("id");
            user = userDAO.getByID(userId);
        } else {
            // create guest user
            user = new User();
            user.setRole(UserRole.ANONYMOUS);
        }

        final List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()));
        final UsernamePasswordAuthenticationToken usernamePasswordAuthToken = new UsernamePasswordAuthenticationToken(user, null, authorities);

        return usernamePasswordAuthToken;
    }
}
