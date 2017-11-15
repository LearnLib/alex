package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.testsuits.entities.TestCase;

import javax.validation.ValidationException;
import java.util.List;

public interface TestCaseDAO {

    void create(TestCase testCase) throws ValidationException;

    List<TestCase> getAll(Long userId, Long projectId) throws NotFoundException;

    TestCase get(Long userId, Long projectId, Long id) throws NotFoundException;

    void update(TestCase testCase) throws NotFoundException;

    void delete(Long userId, Long projectId, Long id) throws NotFoundException;

}
