/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.testsuites.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
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

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The TestCaseRepository to use. Will be injected. */
    private TestRepository testRepository;

    /** The SymbolDAO to use. Will be injected. */
    private SymbolDAO symbolDAO;

    @Inject
    public TestDAOImpl(ProjectDAO projectDAO, TestRepository testRepository, SymbolDAO symbolDAO) {
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

            if (test.getParentId() == null) {
                test.setParentId(0L);
            }

            // make sure the name of the Test Case is unique
            Test testInDb = testRepository.findOneByProject_IdAndParent_IdAndName(test.getProjectId(), test.getParentId(), test.getName());
            if (testInDb != null && !testInDb.getId().equals(test.getId())) {
                throw new ValidationException("To create a test case or suite its name must be unique withing its parent.");
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

            if (test.getParentId() != null) {
                Test parent = get(user, projectId, test.getParentId());

                if (parent instanceof TestCase) {
                    throw new ValidationException("The parent can only be a Test Suite.");
                }

                test.setParent(parent);
            }

            beforeSaving(user, test);
            testRepository.save(test);

        } catch (Exception e) {
            throw new ValidationException(e);
        }
        LOGGER.traceExit(test);
    }

    @Override
    @Transactional
    public void create(User user, List<Test> tests) throws NotFoundException, ValidationException {
        for (Test test : tests) {
            this.create(user, test);
        }
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
        Test testInDB = testRepository.findOneByProject_IdAndParent_IdAndName(test.getProjectId(), test.getParentId(), test.getName());
        if (testInDB != null && !testInDB.getId().equals(test.getId())) {
            throw new ValidationException("To update a test case or suite its name must be unique within its parent.");
        }

        if (test.getId() == 0 && !test.getName().equals("Root")) {
            throw new ValidationException("The name of the root test suite may not be changed.");
        }

        testInDB = get(user, test.getProjectId(), test.getId());

        try {
            test.setUUID(testInDB.getUUID());
            test.setProject(testInDB.getProject());

            if (test.getParentId() != null) {
                Test parent = get(user, test.getProjectId(), test.getParentId());

                if (parent instanceof TestCase) {
                    throw new ValidationException("The parent can only be a Test Suite.");
                }

                test.setParent(parent);
            }

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
    public void delete(User user, Long projectId, Long id) throws NotFoundException, ValidationException {
        if (id == 0) {
            throw new ValidationException("The root test suite cannot be deleted");
        }

        Test test = get(user, projectId, id);

        Test parent = test.getParent();
        if (parent != null) {
            ((TestSuite) parent).getTests().remove(test);
            test.setParent(null);
        }

        testRepository.delete(test);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, IdsList ids) throws NotFoundException, ValidationException {
        for (long id: ids) {
            delete(user, projectId, id);
        }
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
