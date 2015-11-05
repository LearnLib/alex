package de.learnlib.alex.core.entities;

/**
 * Enumeration for User roles.
 */
public enum UserRole {

    /**
     * User is default registered user.
     */
    REGISTERED,

    /**
     * User is administrator with higher privileges.
     */
    ADMIN
//
//    /**
//     * Parse a string into an entry of this enum.
//     *
//     * @param name The name to parse into an entry.
//     * @return The fitting entry of this enum.
//     * @throws IllegalArgumentException If the name could not be parsed
//     */
//    public static UserRole fromString(String name) throws IllegalArgumentException {
//        return UserRole.valueOf(name.toUpperCase());
//    }
//
//    /**
//     * Transform uppercase enum entry to lowercase
//     *
//     * @return An enum entry in lowercase
//     */
//    @Override
//    public String toString() {
//        return name().toLowerCase();
//    }
}
