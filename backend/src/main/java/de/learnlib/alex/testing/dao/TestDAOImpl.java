/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.data.dao.ParameterizedSymbolDAO;
import de.learnlib.alex.data.dao.ParameterizedSymbolDAOImpl;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import de.learnlib.alex.testing.repositories.TestResultRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
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

    /** The injected DAP for parameterized symbols. */
    private ParameterizedSymbolDAO parameterizedSymbolDAO;

    /** The {@link TestResultRepository} to use. */
    private TestResultRepository testResultRepository;

    /**
     * Constructor.
     *
     * @param projectDAO
     *         The injected project DAO.
     * @param testRepository
     *         The injected repository for tests.
     * @param symbolDAO
     *         The injected symbol DAO.
     * @param testCaseStepRepository
     *         The injected repository for test case steps.
     * @param projectRepository
     *         The injected repository for projects.
     * @param parameterizedSymbolDAO
     *         The injected DAO for parameterized symbols.
     * @param testResultRepository
     *         The injected repository for test results.
     */
    @Inject
    public TestDAOImpl(ProjectDAO projectDAO, TestRepository testRepository, SymbolDAO symbolDAO,
            TestCaseStepRepository testCaseStepRepository, ProjectRepository projectRepository,
            ParameterizedSymbolDAO parameterizedSymbolDAO, TestResultRepository testResultRepository) {
        this.projectDAO = projectDAO;
        this.testRepository = testRepository;
        this.symbolDAO = symbolDAO;
        this.testCaseStepRepository = testCaseStepRepository;
        this.projectRepository = projectRepository;
        this.parameterizedSymbolDAO = parameterizedSymbolDAO;
        this.testResultRepository = testResultRepository;
    }

    @Override
    @Transactional
    public void createByGenerate(User user, Test test, Project project) {
        beforeSaving(user, test, project);
        if (test instanceof TestCase) {
            final TestCase testCase = (TestCase) test;

            final List<TestCaseStep> steps = testCase.getSteps();
            final List<TestCaseStep> preSteps = testCase.getPreSteps();
            final List<TestCaseStep> postSteps = testCase.getPostSteps();

            testCase.setSteps(new ArrayList<>());
            testCase.setPreSteps(new ArrayList<>());
            testCase.setPostSteps(new ArrayList<>());

            testRepository.save(test);

            testCase.setSteps(steps);
            testCase.setPreSteps(preSteps);
            testCase.setPostSteps(postSteps);

            saveTestCaseSteps(testCase.getPreSteps());
            saveTestCaseSteps(testCase.getSteps());
            saveTestCaseSteps(testCase.getPostSteps());
        }

        testRepository.save(test);
    }

    @Override
    @Transactional
    public void create(User user, Test test) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", test);

        test.setId(null);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(test.getProjectId());
        if (test.getParent() == null) {
            test.setParent(root);
        }

        // make sure the name of the test case is unique
        String name = test.getName();
        int i = 1;
        while (testRepository.findOneByParent_IdAndName(test.getParentId(), name) != null) {
            name = test.getName() + " - " + i;
            i++;
        }
        test.setName(name);

        Long projectId = test.getProjectId();
        Project project = projectDAO.getByID(user, projectId);
        test.setProject(project);

        if (test.getParentId() != null) {
            Test parent = get(user, projectId, test.getParentId());

            if (parent instanceof TestCase) {
                throw new ValidationException("The parent can only be a Test Suite.");
            }

            test.setParent(parent);
        }

        createByGenerate(user, test, project);
        LOGGER.traceExit(test);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void create(User user, List<Test> tests) throws NotFoundException, ValidationException {
        create(user, new ArrayList<>(tests), null);
    }

    private void create(User user, List<Test> tests, TestSuite parent) throws NotFoundException, ValidationException {
        for (final Test test : tests) {
            if (parent != null) {
                test.setParent(parent);
            }

            if (test instanceof TestCase) {
                create(user, test);
            } else {
                final TestSuite testSuite = (TestSuite) test;
                final List<Test> testsInSuite = testSuite.getTests();

                testSuite.setTests(new ArrayList<>());
                create(user, testSuite);
                create(user, testsInSuite, testSuite);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Test get(User user, Long projectId, Long testId) throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        return get(user, project, testId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Test> get(User user, Long projectId, List<Long> ids) throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        final List<Test> tests = testRepository.findAllByProject_IdAndIdIn(projectId, ids);
        for (Test t: tests) loadLazyRelations(t);
        return tests;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Test> getByType(User user, Long projectId, String type)
            throws NotFoundException, UnauthorizedException, IllegalArgumentException {

        final Project project = projectRepository.findById(projectId).orElse(null);
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
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        loadLazyRelations(root);

        return root;
    }

    @Override
    @Transactional
    public void update(User user, Test test) throws NotFoundException {
        final Project project = projectRepository.findById(test.getProjectId()).orElse(null);
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
            updateTestSuite(user, (TestSuite) test, test.getProject());
        } else if (test instanceof TestCase) {
            updateTestCase(user, (TestCase) test, test.getProject());
        }
    }

    private List<Long> getStepsWithIds(List<TestCaseStep> steps) {
        return steps.stream()
                .filter(s -> s.getId() != null)
                .map(TestCaseStep::getId)
                .collect(Collectors.toList());
    }

    private void updateTestCase(User user, TestCase testCase, Project project) throws NotFoundException {
        beforeSaving(user, testCase, project);

        final List<Long> allStepIds = new ArrayList<>(); // all ids that still exist in the db
        allStepIds.addAll(getStepsWithIds(testCase.getPreSteps()));
        allStepIds.addAll(getStepsWithIds(testCase.getSteps()));
        allStepIds.addAll(getStepsWithIds(testCase.getPostSteps()));

        testCaseStepRepository.deleteAllByTestCase_IdAndIdNotIn(testCase.getId(), allStepIds);

        // delete all test case steps that have been removed in the update.
        saveTestCaseSteps(testCase.getPreSteps());
        saveTestCaseSteps(testCase.getSteps());
        saveTestCaseSteps(testCase.getPostSteps());

        testRepository.save(testCase);
    }

    private void updateTestSuite(User user, TestSuite testSuite, Project project) throws NotFoundException {
        testSuite.getTests().forEach(t -> t.setParent(null));
        beforeSaving(user, testSuite, project);
        testRepository.save(testSuite);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long testId) throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Test test = testRepository.findById(testId).orElse(null);
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
    @Transactional(rollbackFor = Exception.class)
    public void delete(User user, Long projectId, IdsList ids) throws NotFoundException, ValidationException {
        for (long id : ids) {
            delete(user, projectId, id);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Test> move(User user, Long projectId, List<Long> testIds, Long targetId)
            throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<Test> tests = testRepository.findAllById(testIds);
        final Test targetTest = testRepository.findById(targetId).orElse(null);
        final Test rootTestSuite = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);

        // validation
        checkAccess(user, project, targetTest);
        if (targetTest instanceof TestCase) {
            throw new ValidationException("The target cannot be a test case.");
        }

        final TestSuite target = (TestSuite) targetTest;

        for (Test test : tests) {
            checkAccess(user, project, test);

            if (test.getId().equals(rootTestSuite.getId())) {
                throw new ValidationException("Cannot move the root test suite.");
            }

            if (test.getId().equals(target.getId())) {
                throw new ValidationException("A test cannot be a parent of itself.");
            }

            if (test instanceof TestSuite && target.isDescendantOf((TestSuite) test)) {
                throw new ValidationException("A test suite cannot be moved to one of its descendants.");
            }
        }

        // update references
        for (Test test : tests) {
            final TestSuite parent = (TestSuite) test.getParent();
            parent.getTests().remove(test);
            testRepository.save(parent);
            test.setParent(target);
        }

        target.getTests().addAll(tests);
        testRepository.save(target);

        final List<Test> movedTests = testRepository.saveAll(tests);
        movedTests.forEach(this::loadLazyRelations);

        return movedTests;
    }

    @Override
    @Transactional
    public List<TestCase> getTestCases(User user, Long projectId, Long testSuiteId, boolean includeChildTestSuites)
            throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Test test = testRepository.findById(testSuiteId).orElse(null);
        checkAccess(user, project, test);

        if (!(test instanceof TestSuite)) {
            throw new ValidationException("The ID has to belong to a test suite.");
        }

        final TestSuite testSuite = (TestSuite) test;
        final List<TestCase> testCases = new ArrayList<>();

        final ArrayDeque<TestSuite> queue = new ArrayDeque<>();
        queue.add(testSuite);

        while (!queue.isEmpty()) {
            final TestSuite currentTestSuite = queue.poll();
            for (Test t : currentTestSuite.getTests()) {
                if (t instanceof TestSuite) {
                    queue.addLast((TestSuite) t);
                } else {
                    loadLazyRelations(t);
                    testCases.add((TestCase) t);
                }
            }
        }

        return testCases;
    }

    @Override
    @Transactional
    public Page<TestResult> getResults(User user, Long projectId, Long testId, Pageable pageable) throws NotFoundException {
        get(user, projectId, testId);

        final Page<TestResult> results = testResultRepository.findAllByTest_IdOrderByTestReport_StartDateDesc(testId, pageable);
        results.forEach(this::loadLazyRelations);

        return results;
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

    private void saveTestCaseSteps(List<TestCaseStep> steps) {
        for (int i = 0; i < steps.size(); i++) {
            steps.get(i).setNumber(i);
        }

        testCaseStepRepository.saveAll(steps);

        // save the parameter values after the test case step is saved so that
        // we won't get an entity detached exception.
        steps.forEach(step -> {

            // if a parameter value has no id yet, because it is imported, we have to set the reference
            // to the parameter manually.
            // name -> parameter
            final Map<String, SymbolInputParameter> parameterMap = step.getPSymbol().getSymbol().getInputs().stream()
                    .collect(Collectors.toMap(SymbolInputParameter::getName, Function.identity()));

            step.getPSymbol().getParameterValues().forEach(value ->
                    value.setParameter(parameterMap.get(value.getParameter().getName()))
            );

            parameterizedSymbolDAO.create(step.getPSymbol());
        });
    }

    private Test get(User user, Project project, Long testId) {
        final Test test = testRepository.findById(testId).orElse(null);
        checkAccess(user, project, test);

        if (test == null) {
            throw new NotFoundException("Could not find a test with the id " + testId);
        }

        loadLazyRelations(test);

        return test;
    }

    private void loadLazyRelations(TestResult testResult) {
        if (testResult instanceof TestCaseResult) {
            Hibernate.initialize(((TestCaseResult) testResult).getOutputs());
            ((TestCaseResult) testResult).getOutputs().forEach(out -> Hibernate.initialize(out.getSymbol()));
        }
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
            testCase.getSteps().forEach(step -> ParameterizedSymbolDAOImpl.loadLazyRelations((step.getPSymbol())));
            Hibernate.initialize(testCase.getPreSteps());
            testCase.getPreSteps().forEach(step -> ParameterizedSymbolDAOImpl.loadLazyRelations((step.getPSymbol())));
            Hibernate.initialize(testCase.getPostSteps());
            testCase.getPostSteps().forEach(step -> ParameterizedSymbolDAOImpl.loadLazyRelations((step.getPSymbol())));
        }
    }

    private void beforeSaving(User user, Test test, Project project) throws NotFoundException {
        if (test instanceof TestSuite) {
            TestSuite testSuite = (TestSuite) test;
            for (Long testId : testSuite.getTestsAsIds()) {
                Test otherTest = get(user, project, testId);
                testSuite.addTest(otherTest);
            }
        } else if (test instanceof TestCase) {
            TestCase testCase = (TestCase) test;

            final List<TestCaseStep> steps = new ArrayList<>();
            steps.addAll(testCase.getPreSteps());
            steps.addAll(testCase.getSteps());
            steps.addAll(testCase.getPostSteps());

            for (TestCaseStep step : steps) {
                step.setTestCase(testCase);
                final Symbol symbol = symbolDAO.get(user, project, step.getPSymbol().getSymbol().getId());
                step.getPSymbol().setSymbol(symbol);
            }
        }
    }
}
