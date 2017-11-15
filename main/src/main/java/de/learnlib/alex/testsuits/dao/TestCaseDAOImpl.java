package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testsuits.entities.TestCase;
import de.learnlib.alex.testsuits.repositories.TestCaseRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
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
        this.projectRepository = projectRepository;
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

            Long userId = testCase.getUserId();
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
    @Transactional(readOnly = true)
    public List<TestCase> getAll(Long userId, Long projectId) throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        List<TestCase> resultList = testCaseRepository.findAllByUser_IdAndProject_Id(userId, projectId);

        return resultList;
    }

    @Override
    @Transactional(readOnly = true)
    public TestCase get(Long userId, Long projectId, Long id) throws NotFoundException {
        TestCase result = testCaseRepository.findOneByUser_IdAndProject_IdAndId(userId, projectId, id);

        if (result == null) {
            throw new NotFoundException("Could not find a Test Case with the id " + id
                                                + " in the project " + projectId + ".");
        }

        return result;
    }

    @Override
    @Transactional
    public void update(TestCase testCase) throws NotFoundException {
        // checks for valid Test Case
        if (testCase.getProjectId()==null) {
            throw new NotFoundException("Update failed: Could not find the project with the id "
                                                + testCase.getProjectId() + ".");
        }

        // make sure the name of the Test Case is unique
        TestCase testCase2 = testCaseRepository.getTestCaseByName(testCase.getUserId(), testCase.getProjectId(), testCase.getName());
        if (testCase2 !=null&&!testCase2.getId().equals(testCase.getId())) {
            throw new ValidationException("To update a Test Case its name must be unique.");
        }

        try {
            TestCase testCaseDB = get(testCase.getUserId(), testCase.getProjectId(), testCase.getId());
            testCase.setTestCaseId(testCaseDB.getTestCaseId());
            testCase.setProject(testCaseDB.getProject());

            testCaseRepository.save(testCase);
        } catch (Exception e) {
            throw new NotFoundException("Update failed: Could not find the Test Case with the id " + testCase.getId()
                                                + " in the project " + testCase.getProjectId() + ".", e);
        }
    }

    @Override
    @Transactional
    public void delete(Long userId, Long projectId, Long id) throws NotFoundException {
        TestCase testCase = get(userId, projectId, id);

        testCaseRepository.delete(testCase);
    }

}
