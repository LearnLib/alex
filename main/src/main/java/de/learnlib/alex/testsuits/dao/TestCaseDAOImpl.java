package de.learnlib.alex.testsuits.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testsuits.entities.TestCase;
import de.learnlib.alex.testsuits.repositories.TestCaseRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;


@Service
public class TestCaseDAOImpl implements TestCaseDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The TestCaseRepository to use. Will be injected. */
    private TestCaseRepository testCaseRepository;

    /** The SymbolDAO to use. Will be injected. */
    private SymbolDAO symbolDAO;

    @Inject
    public TestCaseDAOImpl(ProjectRepository projectRepository, ProjectDAO projectDAO,
                           TestCaseRepository testCaseRepository, SymbolDAO symbolDAO) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.testCaseRepository = testCaseRepository;
        this.symbolDAO = symbolDAO;
    }

    @Override
    @Transactional
    public void create(User user, TestCase testCase) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", testCase);
        try {
            // new Test Cases should have a project and no id
            if (testCase.getProjectId() == null && testCase.getProject() == null) {
                throw new ValidationException("To create a test case it must have a Project.");
            }

            if (testCase.getId() != null) {
                throw new ValidationException("To create a test case it must not haven an ID");
            }

            // make sure the name of the Test Case is unique
            TestCase testCase2 = testCaseRepository.getTestCaseByName(testCase.getProjectId(), testCase.getName());
            if (testCase2 != null && !testCase2.getId().equals(testCase.getId())) {
                throw new ValidationException("To create a Test Case its name must be unique.");
            }

            Long projectId = testCase.getProjectId();

            Project project = projectDAO.getByID(user.getId(), projectId);

            testCase.setUuid(null);
            testCase.setProject(project);

            List<Symbol> symbols = new LinkedList<>();
            for (Long symbolId : testCase.getSymbolsAsIds()) {
                Symbol symbol = symbolDAO.get(user, projectId, symbolId);
                symbols.add(symbol);
            }
            testCase.setSymbols(symbols);

            Long maxTestNo = testCaseRepository.findHighestTestNo(projectId);
            if (maxTestNo == null) {
                maxTestNo = -1L;
            }
            long nextTestNo = maxTestNo + 1;
            testCase.setId(nextTestNo);

            testCaseRepository.save(testCase);

        } catch (Exception e) {
            throw new ValidationException(e);
        }
        LOGGER.traceExit(testCase);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestCase> getAll(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<TestCase> resultList = testCaseRepository.findAllByProject_Id(projectId);

        resultList.forEach(testCase -> {
            Hibernate.initialize(testCase.getProject());
            Hibernate.initialize(testCase.getSymbols());
            testCase.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
        });

        return resultList;
    }

    @Override
    @Transactional(readOnly = true)
    public TestCase get(User user, Long projectId, Long id) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        TestCase result = testCaseRepository.findOneByProject_IdAndId(projectId, id);

        if (result == null) {
            throw new NotFoundException("Could not find a Test Case with the id " + id
                                                + " in the project " + projectId + ".");
        }

        Hibernate.initialize(result.getProject());
        Hibernate.initialize(result.getSymbols());
        result.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);

        return result;
    }

    @Override
    @Transactional
    public void update(User user, TestCase testCase) throws NotFoundException {
        projectDAO.getByID(user.getId(), testCase.getProjectId()); // access check

        // make sure the name of the Test Case is unique
        TestCase testCase2 = testCaseRepository.getTestCaseByName(testCase.getProjectId(), testCase.getName());
        if (testCase2 != null && !testCase2.getId().equals(testCase.getId())) {
            throw new ValidationException("To update a Test Case its name must be unique.");
        }

        try {
            TestCase testCaseDB = get(user, testCase.getProjectId(), testCase.getId());
            testCase.setUuid(testCaseDB.getUuid());
            testCase.setProject(testCaseDB.getProject());

            List<Symbol> symbols = new LinkedList<>();
            for (Long symbolId : testCase.getSymbolsAsIds()) {
                Symbol symbol = symbolDAO.get(user, testCase.getProjectId(), symbolId);
                symbols.add(symbol);
            }
            testCase.setSymbols(symbols);

            testCaseRepository.save(testCase);
        } catch (Exception e) {
            throw new NotFoundException("Update failed: Could not find the Test Case with the id " + testCase.getId()
                                                + " in the project " + testCase.getProjectId() + ".", e);
        }
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long id) throws NotFoundException {
        TestCase testCase = get(user, projectId, id);

        testCaseRepository.delete(testCase);
    }

}
