package de.learnlib.alex.actions;

import org.apache.commons.codec.binary.Base64;

import javax.persistence.Embeddable;

/**
 * Helper class to store and transfer authentication credentials, i.e. user name / email and password.
 */
@Embeddable
public class Credentials {

    /** The name to use for authentication. */
    private String name;

    /** The password to use for authentication. */
    private String password;

    /**
     * Default constructor;
     */
    public Credentials() {
        this("", "");
    }

    /**
     * Create a credential with a user and password.
     *
     * @param name The name to use.
     * @param password The password to use.
     */
    public Credentials(String name, String password) {
        this.name = name;
        this.password = password;
    }

    /**
     * @return The name to use for authentication.
     */
    public String getName() {
        return name;
    }

    /**
     * @param name The new name to use for authentication.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return The password to use for authentication.
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password The new password to use for authentication.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Return the name and password encoded in Base64 to be used in the HTTP Basic Authentication.
     *
     * @return "name:password" encoded in Base64.
     */
    public String toBase64() {
        String credentialsAsString = name + ":" + password;
        return  Base64.encodeBase64String(credentialsAsString.getBytes());
    }

}
