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

import de.learnlib.alex.core.entities.User;

import java.security.Principal;

/**
 * The security principal class that allows access to a user object from a security context.
 */
public class UserPrincipal implements Principal {

    /**
     * The user of the context.
     */
    private User user;

    /**
     * @param user The user that should be used for the context
     */
    public UserPrincipal(User user) {
        this.user = user;
    }

    /**
     * @return The email the user is identified by
     */
    @Override
    public String getName() {
        return user.getEmail();
    }

    /**
     * @return The user of the context
     */
    public User getUser() {
        return user;
    }
}
