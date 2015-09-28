package de.learnlib.alex.security;

import de.learnlib.alex.core.entities.User;

import java.security.Principal;

/**
 * The security principal class that allows access to a user object from a security context
 */
public class UserPrincipal implements Principal {

    /**
     * The user of the context
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
