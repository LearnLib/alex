/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.testing.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** The implementation of the test dao. */
@Service
public class TestDAOImpl implements TestDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The SymbolDAO to use. Will be injected. */
    private SymbolDAO symbolDAO;

    /** The TestCaseRepository to use. Will be injected. */
    private TestRepository testRepository;

    /** The repository for projects. */
    private ProjectRepository projectRepository;

    /** The repository for test case steps. */
    private TestCaseStepRepository testCaseStepRepository;

    /** The repository for symbol parameter values. */
    private SymbolParameterValueRepository symbolParameterValueRepository;

    @Inject
    public TestDAOImpl(ProjectDAO projectDAO, TestRepository testRepository, SymbolDAO symbolDAO,
            TestCaseStepRepository testCaseStepRepository,
            SymbolParameterValueRepository symbolParameterValueRepository,
            ProjectRepository projectRepository) {
        this.projectDAO = projectDAO;
        this.testRepository = testRepository;
        this.symbolDAO = symbolDAO;
        this.testCaseStepRepository = testCaseStepRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.projectRepository = projectRepository;
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

            final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(test.getProjectId());
            if (test.getParent() == null) {
                test.setParent(root);
            }

            // make sure the name of the test case is unique
            String name = test.getName();
            int i = 1;
            while (testRepository.findOneByParent_IdAndName(test.getParentId(), name) != null) {
                name = test.getName() + " - " + String.valueOf(i);
                i++;
            }
            test.setName(name);

            Long projectId = test.getProjectId();
            Project project = projectDAO.getByID(user.getId(), projectId);

            test.setId(null);
            test.setProject(project);

            if (test.getParentId() != null) {
                Test parent = get(user, projectId, test.getParentId());

                if (parent instanceof TestCase) {
                    throw new ValidationException("The parent can only be a Test Suite.");
                }

                test.setParent(parent);
            }

            beforeSaving(user, test);
            testRepository.save(test);

            if (test instanceof TestCase) {
                saveTestCaseSteps((TestCase) test);
            }
        } catch (Exception e) {
            throw new ValidationException(e);
        }
        LOGGER.traceExit(test);
    }

    @Override
    @Transactional
    public void create(User user, List<Test> tests) throws NotFoundException, ValidationException {
        create(user, new HashSet<>(tests), null);
    }

    private void create(User user, Set<Test> tests, TestSuite parent) throws NotFoundException, ValidationException {
        for (final Test test : tests) {
            if (parent != null) {
                test.setParent(parent);
            }

            if (test instanceof TestCase) {
                create(user, test);
            } else {
                final TestSuite testSuite = (TestSuite) test;
                final Set<Test> testsInSuite = testSuite.getTests();

                testSuite.setTests(new HashSet<>());
                create(user, testSuite);
                create(user, testsInSuite, testSuite);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Test get(User user, Long projectId, Long testId) throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        final Test test = testRepository.findOne(testId);
        checkAccess(user, project, test);

        if (test == null) {
            throw new NotFoundException("Could not find a Test Case with the id " + testId
                    + " in the project " + projectId + ".");
        }

        loadLazyRelations(test);

        return test;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Test> get(User user, Long projectId, List<Long> ids) throws NotFoundException, UnauthorizedException {
        final List<Test> tests = new ArrayList<>();
        for (Long id : ids) {
            tests.add(get(user, projectId, id));
        }
        return tests;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Test> getByType(User user, Long projectId, String type)
            throws NotFoundException, UnauthorizedException, IllegalArgumentException {

        final Project project = projectRepository.findOne(projectId);
        projectDAO.checkAccess(user, project);

        final List<Test> tests = testRepository.findAllByProject_Id(projectId);
        tests.forEach(this::loadLazyRelations);

        if (type == null) {
            return tests;
        }

        switch (type) {
            case "case":
                return tests.stream()
                        .filter(TestCase.class::isInstance)
                        .collect(Collectors.toList());
            case "suite":
                return tests.stream()
                        .filter(TestSuite.class::isInstance)
                        .collect(Collectors.toList());
            default:
                throw new IllegalArgumentException("Invalid type parameter. Allowed values: ['case', 'suite']");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Test getRoot(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findOne(projectId);
        projectDAO.checkAccess(user, project);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        loadLazyRelations(root);

        return root;
    }

    @Override
    @Transactional
    public void update(User user, Test test) throws NotFoundException {
        final Project project = projectRepository.findOne(test.getProjectId());
        checkAccess(user, project, test);

        // make sure the name of the Test Case is unique
        Test testInDB = testRepository.findOneByParent_IdAndName(test.getParentId(), test.getName());
        if (testInDB != null && !testInDB.getId().equals(test.getId())) {
            throw new ValidationException("To update a test case or suite its name must be unique within its parent.");
        }

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(test.getProjectId());
        if (test.getId().equals(root.getId()) && !test.getName().equals("Root")) {
            throw new ValidationException("The name of the root test suite may not be changed.");
        }

        testInDB = get(user, test.getProjectId(), test.getId());

        try {
            test.setId(testInDB.getId());
            test.setProject(testInDB.getProject());

            if (test.getParentId() != null) {
                Test parent = get(user, test.getProjectId(), test.getParentId());

                if (parent instanceof TestCase) {
                    throw new ValidationException("The parent can only be a Test Suite.");
                }

                test.setParent(parent);
            }

            if (test instanceof TestSuite) {
                updateTestSuite(user, (TestSuite) test);
            } else if (test instanceof TestCase) {
                updateTestCase(user, (TestCase) test);
            }
        } catch (Exception e) {
            throw new NotFoundException("Update failed: Could not find the Test with the id " + test.getId()
                    + " in the project " + test.getProjectId() + ".", e);
        }
    }

    private void updateTestCase(User user, TestCase testCase) throws NotFoundException {
        beforeSaving(user, testCase);
        testRepository.save(testCase);

        // delete all test case steps that have been removed in the update.
        final List<Long> stepIds = testCase.getSteps().stream()
                .filter(s -> s.getId() != null)
                .map(TestCaseStep::getId)
                .collect(Collectors.toList());

        if (stepIds.isEmpty()) {
            testCaseStepRepository.deleteAllByTestCase_Id(testCase.getId());
        } else {
            testCaseStepRepository.deleteAllByTestCase_IdAndIdNotIn(testCase.getId(), stepIds);
        }

        saveTestCaseSteps(testCase);
    }

    private void updateTestSuite(User user, TestSuite testSuite) throws NotFoundException {
        testSuite.getTests().forEach(t -> t.setParent(null));
        beforeSaving(user, testSuite);
        testRepository.save(testSuite);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long testId) throws NotFoundException, ValidationException {
        final Project project = projectRepository.findOne(projectId);
        final Test test = testRepository.findOne(testId);
        checkAccess(user, project, test);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        if (root.getId().equals(testId)) {
            throw new ValidationException("The root test suite cannot be deleted");
        }

        final Test parent = test.getParent();
        if (parent != null) {
            ((TestSuite) parent).getTests().remove(test);
            test.setParent(null);
        }

        testRepository.delete(test);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, IdsList ids) throws NotFoundException, ValidationException {
        for (long id : ids) {
            delete(user, projectId, id);
        }
    }

    @Override
    public void checkAccess(User user, Project project, Test test) throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (test == null) {
            throw new NotFoundException("The test could not be found.");
        }

        if (!test.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the test.");
        }
    }

    private void saveTestCaseSteps(TestCase testCase) {
        for (int i = 0; i < testCase.getSteps().size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            step.setNumber(i);
        }

        testCaseStepRepository.save(testCase.getSteps());

        // save the parameter values after the test case step is saved so that
        // we won't get an entity detached exception.
        testCase.getSteps().forEach(step -> {

            // if a parameter value has no id yet, because it is imported, we have to set the reference
            // to the parameter manually.
            // name -> parameter
            final Map<String, SymbolInputParameter> parameterMap = new HashMap<>();
            step.getSymbol().getInputs().stream()
                    .filter(input -> input.getParameterType().equals(SymbolParameter.ParameterType.STRING))
                    .forEach(input -> parameterMap.put(input.getName(), input));

            step.getParameterValues().forEach(value -> {
                value.setStep(step);
                value.setParameter(parameterMap.get(value.getParameter().getName()));
            });

            symbolParameterValueRepository.save(step.getParameterValues());
        });
    }

    private void loadLazyRelations(Test test) {
        Hibernate.initialize(test.getProject());
        Hibernate.initialize(test.getProject().getUrls());

        if (test instanceof TestSuite) {
            TestSuite testSuite = (TestSuite) test;
            Hibernate.initialize(testSuite.getTests());
            testSuite.getTests().forEach(this::loadLazyRelations);
        } else if (test instanceof TestCase) {
            TestCase testCase = (TestCase) test;
            Hibernate.initialize(testCase.getSteps());
            testCase.getSteps().forEach(step -> SymbolDAOImpl.loadLazyRelations((step.getSymbol())));
        }
    }

    private void beforeSaving(User user, Test test) throws NotFoundException {
        long projectId = test.getProjectId();

        if (test instanceof TestSuite) {
            TestSuite testSuite = (TestSuite) test;
            for (Long testId : testSuite.getTestsAsIds()) {
                Test otherTest = get(user, projectId, testId);
                testSuite.addTest(otherTest);
            }
        } else if (test instanceof TestCase) {
            TestCase testCase = (TestCase) test;

            for (TestCaseStep step : testCase.getSteps()) {
                step.setTestCase(testCase);
                final Symbol symbol = symbolDAO.get(user, projectId, step.getSymbol().getId());
                step.setSymbol(symbol);
            }
        }
    }
}
