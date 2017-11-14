package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.testsuits.entities.TestCase;

import javax.validation.ValidationException;
import java.util.List;

public interface TestCaseDAO {

    void create(TestCase testCase) throws ValidationException;

    List<TestCase> getAll(Long userId, Long projectId);

    TestCase get(Long userId, Long projectId, Long id);

    void update(TestCase testCase);

    void update(List<TestCase> testCases);

    void delete(Long userId, Long projectId, Long id);

    void delete(Long userId, Long projectId, Long[] id);

}
