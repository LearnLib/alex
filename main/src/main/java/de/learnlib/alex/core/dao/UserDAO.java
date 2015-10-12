package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface for database operations on users
 */
public interface UserDAO {

    /**
     * Creates a new user
     *
     * @param user The user to create
     * @throws ValidationException
     */
    void create(User user) throws ValidationException;

    /**
     * Gets a list of all registered users
     *
     * @return The list of all users
     */
    List<User> getAll();

    /**
     * Gets a list of registered users with a specific role
     *
     * @param role The role of the user
     * @return A list of all users with the given role
     */
    List<User> getAllByRole(UserRole role);

    /**
     * Gets a user by its email
     *
     * @param email The users email
     * @return The user with the given email
     */
    User getByEmail(String email);

    /**
     * Gets a user by its id
     *
     * @param id The id of the user
     * @return The user with the given id
     */
    User getById(Long id);

    /**
     * Deletes a user from the database. Admins can only be deleted if there is more than one available
     *
     * @param id The id of the user to delete
     * @throws NotFoundException
     */
    void delete(Long id) throws NotFoundException;

    /**
     * Updates a user
     *
     * @param user The user to update
     * @throws ValidationException
     */
    void update(User user) throws ValidationException;
}
