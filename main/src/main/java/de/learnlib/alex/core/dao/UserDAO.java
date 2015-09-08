package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.User;

import javax.xml.bind.ValidationException;
import java.util.List;

/**
 * Interface for database operations on users
 */
public interface UserDAO {

    void create (User user) throws ValidationException;

    List<User> getAll ();
}
