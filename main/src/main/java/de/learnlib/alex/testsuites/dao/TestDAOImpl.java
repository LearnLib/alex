package de.learnlib.alex.testsuites.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testsuites.entities.Test;
import de.learnlib.alex.testsuites.entities.TestCase;
import de.learnlib.alex.testsuites.entities.TestSuite;
import de.learnlib.alex.testsuites.repositories.TestRepository;
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
public class TestDAOImpl implements TestDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The TestCaseRepository to use. Will be injected. */
    private TestRepository testRepository;

    /** The SymbolDAO to use. Will be injected. */
    private SymbolDAO symbolDAO;

    @Inject
    public TestDAOImpl(ProjectRepository projectRepository, ProjectDAO projectDAO,
                           TestRepository testRepository, SymbolDAO symbolDAO) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.testRepository = testRepository;
        this.symbolDAO = symbolDAO;
    }

    @Override
    @Transactional
    public void create(User user, Test test) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", test);
        try {
            // new Test Cases should have a project and no id
            if (test.getId() != null) {
                throw new ValidationException("To create a test case it must not haven an ID.");
            }

            // make sure the name of the Test Case is unique
            Test testInDb = testRepository.findOneByProject_IdAndName(test.getProjectId(), test.getName());
            if (testInDb != null && !testInDb.getId().equals(test.getId())) {
                throw new ValidationException("To create a Test Case its name must be unique.");
            }

            Long projectId = test.getProjectId();
            Project project = projectDAO.getByID(user.getId(), projectId);

            test.setUUID(null);
            test.setProject(project);

            Long maxTestNo = testRepository.findHighestTestNo(projectId);
            if (maxTestNo == null) {
                maxTestNo = -1L;
            }
            long nextTestNo = maxTestNo + 1;
            test.setId(nextTestNo);

            beforeSaving(user, test);
            if (test instanceof TestSuite) {
                System.out.println(((TestSuite) test).getTests());
            }

            testRepository.save(test);

        } catch (Exception e) {
            throw new ValidationException(e);
        }
        LOGGER.traceExit(test);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Test> getAll(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<Test> resultList = testRepository.findAllByProject_Id(projectId);

        resultList.forEach(this::loadLazyRelations);

        return resultList;
    }


    @Override
    @Transactional(readOnly = true)
    public Test get(User user, Long projectId, Long id) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        Test result = testRepository.findOneByProject_IdAndId(projectId, id);
        if (result == null) {
            throw new NotFoundException("Could not find a Test Case with the id " + id
                                                + " in the project " + projectId + ".");
        }

        loadLazyRelations(result);

        return result;
    }

    @Override
    @Transactional
    public void update(User user, Test test) throws NotFoundException {
        projectDAO.getByID(user.getId(), test.getProjectId()); // access check

        // make sure the name of the Test Case is unique
        Test testInDB = get(user, test.getProjectId(), test.getId());
        if (testInDB != null && !testInDB.getId().equals(test.getId())) {
            throw new ValidationException("To update a Test Case its name must be unique.");
        }


        try {
            test.setUUID(testInDB.getUUID());
            test.setProject(testInDB.getProject());


            if (test instanceof TestSuite) {
                ((TestSuite) testInDB).getTests().forEach(t -> t.setParent(null));
            }
            beforeSaving(user, test);

            testRepository.save(test);
        } catch (Exception e) {
            throw new NotFoundException("Update failed: Could not find the Test with the id " + test.getId()
                                                + " in the project " + test.getProjectId() + ".", e);
        }
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long id) throws NotFoundException {
        Test test = get(user, projectId, id);

        System.out.println("Deleting: " + test);

        Test parent = test.getParent();
        if (parent != null) {
            ((TestSuite) parent).getTests().remove(test);
            test.setParent(null);
        }

        testRepository.delete(test);
    }

    private void loadLazyRelations(Test test) {
        Hibernate.initialize(test.getProject());

        if (test instanceof TestSuite) {
            TestSuite testAsSuite = (TestSuite) test;
            Hibernate.initialize(testAsSuite.getTests());
            testAsSuite.getTests().forEach(this::loadLazyRelations);
        } else if (test instanceof TestCase) {
            TestCase testAsCase = (TestCase) test;
            Hibernate.initialize(testAsCase.getSymbols());
            testAsCase.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
        }
    }

    private void beforeSaving(User user, Test test) throws NotFoundException {
        long projectId = test.getProjectId();

        if (test instanceof TestSuite) {
            TestSuite testAsSuite = (TestSuite) test;
            for (Long testId : testAsSuite.getTestsAsIds()) {
                Test otherTest = get(user, projectId, testId);
                testAsSuite.addTest(otherTest);
            }
        } else if (test instanceof TestCase) {
            TestCase testAsCase = (TestCase) test;
            List<Symbol> symbols = new LinkedList<>();
            for (Long symbolId : testAsCase.getSymbolsAsIds()) {
                Symbol symbol = symbolDAO.get(user, projectId, symbolId);
                symbols.add(symbol);
            }
            testAsCase.setSymbols(symbols);
        }
    }

}
