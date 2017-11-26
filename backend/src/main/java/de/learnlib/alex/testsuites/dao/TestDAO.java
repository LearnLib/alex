package de.learnlib.alex.testsuites.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.testsuites.entities.Test;

import javax.validation.ValidationException;
import java.util.List;

public interface TestDAO {

    void create(User user, Test test) throws ValidationException, NotFoundException;

    List<Test> getAll(User user, Long projectId) throws NotFoundException;

    Test get(User user, Long projectId, Long id) throws NotFoundException;

    void update(User user, Test test) throws NotFoundException;

    void delete(User user, Long projectId, Long id) throws NotFoundException;

}
