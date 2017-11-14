package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testsuits.entities.TestCase;
import de.learnlib.alex.testsuits.repositories.TestCaseRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.List;


@Service
public class TestCaseDAOImpl implements TestCaseDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The TestCaseRepository to use. Will be injected. */
    private TestCaseRepository testCaseRepository;

    @Inject
    public TestCaseDAOImpl(ProjectRepository projectRepository, TestCaseRepository testCaseRepository) {
        this.projectRepository  = projectRepository;
        this.testCaseRepository = testCaseRepository;
    }

    @Override
    @Transactional
    public void create(TestCase testCase) throws ValidationException {
        LOGGER.traceEntry("create({})", testCase);
        try {
            // new Test Cases should have a project and no id
            if (testCase.getProjectId() == null && testCase.getProject() == null) {
                throw new ValidationException("To create a test case it must have a Project.");
            }

            if (testCase.getId() != null) {
                throw new ValidationException("To create a test case it must not haven an ID");
            }

            // TODO: Make sure the name is unique

            Long userId    = testCase.getUserId();
            Long projectId = testCase.getProjectId();

            Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
            if (project == null) {
                throw new ValidationException("The Project was not found and thus the Symbol was not created.");
            }

            // TODO: Connect with project

            testCaseRepository.save(testCase);

        } catch (Exception e) {
            throw new ValidationException(e);
        }
        LOGGER.traceExit(testCase);
    }

    @Override
    public List<TestCase> getAll(Long userId, Long projectId) {
        return null;
    }

    @Override
    public TestCase get(Long userId, Long projectId, Long id) {
        return null;
    }

    @Override
    public void update(TestCase testCase) {

    }

    @Override
    public void update(List<TestCase> testCases) {

    }

    @Override
    public void delete(Long userId, Long projectId, Long id) {

    }

    @Override
    public void delete(Long userId, Long projectId, Long[] id) {

    }
}
