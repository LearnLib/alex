package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.testsuits.entities.TestCase;

import javax.validation.ValidationException;
import java.util.List;

public interface TestCaseDAO {

    void create(User user, TestCase testCase) throws ValidationException, NotFoundException;

    List<TestCase> getAll(User user, Long projectId) throws NotFoundException;

    TestCase get(User user, Long projectId, Long id) throws NotFoundException;

    void update(User user, TestCase testCase) throws NotFoundException;

    void delete(User user, Long projectId, Long id) throws NotFoundException;

}
