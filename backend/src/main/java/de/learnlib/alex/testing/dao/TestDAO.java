/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.common.exceptions.EntityLockedException;
import de.learnlib.alex.common.exceptions.ForbiddenOperationException;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ParameterizedSymbolDAO;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.utils.SymbolOutputMappingUtils;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import de.learnlib.alex.testing.repositories.TestResultRepository;
import de.learnlib.alex.testing.services.TestService;
import de.learnlib.alex.websocket.services.TestPresenceService;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.time.ZonedDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/** The implementation of the test dao. */
@Service
@Transactional(rollbackFor = Exception.class)
public class TestDAO {

    private final ProjectDAO projectDAO;
    private final SymbolDAO symbolDAO;
    private final TestRepository testRepository;
    private final ProjectRepository projectRepository;
    private final TestCaseStepRepository testCaseStepRepository;
    private final ParameterizedSymbolDAO parameterizedSymbolDAO;
    private final TestResultRepository testResultRepository;
    private final TestPresenceService testPresenceService;
    private final TestService testService;
    private final TestExecutionConfigRepository testExecutionConfigRepository;

    @Autowired
    public TestDAO(ProjectDAO projectDAO, TestRepository testRepository, SymbolDAO symbolDAO,
                   TestCaseStepRepository testCaseStepRepository, ProjectRepository projectRepository,
                   ParameterizedSymbolDAO parameterizedSymbolDAO, TestResultRepository testResultRepository,
                   @Lazy TestPresenceService testPresenceService, @Lazy TestService testService, @Lazy TestExecutionConfigRepository testExecutionConfigRepository) {
        this.projectDAO = projectDAO;
        this.testRepository = testRepository;
        this.symbolDAO = symbolDAO;
        this.testCaseStepRepository = testCaseStepRepository;
        this.projectRepository = projectRepository;
        this.parameterizedSymbolDAO = parameterizedSymbolDAO;
        this.testResultRepository = testResultRepository;
        this.testPresenceService = testPresenceService;
        this.testService = testService;
        this.testExecutionConfigRepository = testExecutionConfigRepository;
    }

    public Test createByGenerate(User user, Project project, Test test) {
        beforeSaving(user, project, test);
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

            testCase.setLastUpdatedBy(user);
        }

        return testRepository.save(test);
    }

    private Test getParent(User user, Long projectId, Long parentId) {
        if (parentId == null) {
            return null;
        }

        final Test parent = get(user, projectId, parentId);
        if (parent instanceof TestCase) {
            throw new ValidationException("The parent can only be a Test Suite.");
        }

        return parent;
    }

    public synchronized Test create(User user, Long projectId, Test test) throws NotFoundException, ValidationException {
        test.setId(null);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
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

        final Project project = projectDAO.getByID(user, projectId);
        test.setProject(project);
        test.setParent(getParent(user, projectId, test.getParentId()));

        return createByGenerate(user, project, test);
    }

    public List<Test> create(User user, Long projectId, List<Test> tests) {
        return create(user, projectId, tests, null);
    }

    public List<Test> create(User user, Long projectId, List<Test> tests, Map<Long, Long> configRefMap) {
        return create(user, projectId, new ArrayList<>(tests), null, configRefMap);
    }

    public List<Test> importTests(User user, Long projectId, List<Test> tests, Map<Long, Long> configRefMap, Map<Long, Long> symbolRefMap) {
        projectDAO.getByID(user, projectId);

        // fetch symbols and map with oldSymbolIds as keys when a testRefMap is provided
        final Map<Long, Symbol> symbolMap = symbolDAO.getAll(user, projectId).stream()
                .collect(Collectors.toMap(s -> symbolRefMap != null ? symbolRefMap.get(s.getId()) : s.getId(), Function.identity()));

        mapSymbolsInTests(tests, symbolMap);

        return create(user, projectId, tests, configRefMap);
    }

    private void mapSymbolsInTests(List<Test> tests, Map<Long, Symbol> symbolMap) {
        for (Test test : tests) {
            if (test instanceof TestCase) {
                final TestCase tc = (TestCase) test;
                mapSymbolsInTestCaseSteps(tc.getPreSteps(), symbolMap);
                mapSymbolsInTestCaseSteps(tc.getSteps(), symbolMap);
                mapSymbolsInTestCaseSteps(tc.getPostSteps(), symbolMap);
            } else {
                mapSymbolsInTests(((TestSuite) test).getTests(), symbolMap);
            }
        }
    }

    private void mapSymbolsInTestCaseSteps(List<TestCaseStep> steps, Map<Long, Symbol> symbolMap) {
        for (TestCaseStep step : steps) {
            step.getPSymbol().setSymbol(symbolMap.get(step.getPSymbol().getSymbol().getId()));
        }
    }

    private List<Test> create(User user, Long projectId, List<Test> tests, TestSuite parent, Map<Long, Long> configRefMap) {
        final List<Test> createdTests = new ArrayList<>();

        for (final Test test : tests) {
            if (parent != null) {
                test.setParent(parent);
            }

            if (test instanceof TestCase) {
                var refTestId = test.getId();
                Test createdTest = create(user, projectId, test);
                if (configRefMap != null) {
                    configRefMap.put(refTestId, createdTest.getId());
                }
                createdTests.add(createdTest);
            } else {
                final TestSuite testSuite = (TestSuite) test;
                final List<Test> testsInSuite = testSuite.getTests();

                testSuite.setTests(new ArrayList<>());
                var refSuiteId = test.getId();
                Test createdTest = create(user, projectId, testSuite);
                if (configRefMap != null) {
                    configRefMap.put(refSuiteId, createdTest.getId());
                }
                createdTests.add(createdTest);
                create(user, projectId, testsInSuite, testSuite, configRefMap);
            }
        }

        return createdTests;
    }

    public Test get(User user, Long projectId, Long testId) {
        final var project = projectRepository.findById(projectId).orElse(null);
        final var test = testRepository.findById(testId).orElse(null);
        checkAccess(user, project, test);
        loadLazyRelations(test);
        return test;
    }

    public List<Test> get(User user, Long projectId, List<Long> ids) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        final List<Test> tests = testRepository.findAllByProject_IdAndIdIn(projectId, ids);
        for (Test t : tests) {
            loadLazyRelations(t);
        }
        return tests;
    }

    public Test getRoot(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final Test root = testRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        loadLazyRelations(root);

        return root;
    }

    public Test update(User user, Long projectId, Long testId, Test test) {
        final var project = projectRepository.findById(projectId).orElse(null);
        final var testInDB = testRepository.findById(testId).orElse(null);
        checkAccess(user, project, test);
        checkRunningTestProcess(user, project, test);

        // check lock status
        testPresenceService.checkLockStatus(projectId, test.getId(), user.getId());

        // make sure the name of the Test Case is unique
        final var testWithSameName = testRepository.findOneByParent_IdAndName(test.getParentId(), test.getName());
        if (testWithSameName != null && !testWithSameName.getId().equals(testInDB.getId())) {
            throw new ValidationException("To update a test case or suite its name must be unique within its parent.");
        }

        final var rootTestSuite = testRepository.findFirstByProject_IdOrderByIdAsc(test.getProjectId());
        if (test.getId().equals(rootTestSuite.getId()) && !test.getName().equals("Root")) {
            throw new ValidationException("The name of the root test suite may not be changed.");
        }

        if (testInDB instanceof TestSuite && test instanceof TestSuite) {
            final var updatedTestSuite = updateTestSuite((TestSuite) testInDB, (TestSuite) test);
            loadLazyRelations(updatedTestSuite);
            return updatedTestSuite;
        } else if (testInDB instanceof TestCase && test instanceof TestCase) {
            final var updatedTestCase = updateTestCase(user, (TestCase) testInDB, (TestCase) test);
            loadLazyRelations(updatedTestCase);
            return updatedTestCase;
        } else {
            throw new IllegalStateException("Cannot update a test case with a test suite or vice versa.");
        }
    }

    private Test updateTestCase(User user, TestCase testCaseInDB, TestCase testCase) {
        checkIfOutputMappingNamesAreUnique(testCase);

        testCaseInDB.setName(testCase.getName());
        testCaseInDB.setGenerated(false);
        testCaseInDB.setUpdatedOn(ZonedDateTime.now());
        testCaseInDB.setLastUpdatedBy(user);

        testCaseInDB.getPreSteps().clear();
        testCaseInDB.getSteps().clear();
        testCaseInDB.getPostSteps().clear();
        testRepository.save(testCaseInDB);

        testCaseInDB.getPreSteps().addAll(testCase.getPreSteps());
        testCaseInDB.getSteps().addAll(testCase.getSteps());
        testCaseInDB.getPostSteps().addAll(testCase.getPostSteps());
        removeIdsFromSteps(testCaseInDB);
        beforeSaving(user, testCaseInDB.getProject(), testCaseInDB);

        saveTestCaseSteps(testCaseInDB.getPreSteps());
        saveTestCaseSteps(testCaseInDB.getSteps());
        saveTestCaseSteps(testCaseInDB.getPostSteps());
        testRepository.save(testCaseInDB);

        return testCaseInDB;
    }

    private void removeIdsFromSteps(TestCase testCase) {
        Stream.of(testCase.getPreSteps(), testCase.getSteps(), testCase.getPostSteps())
                .flatMap(Collection::stream)
                .forEach(s -> {
                    s.setId(null);
                    s.getPSymbol().setId(null);
                    s.getPSymbol().getOutputMappings().forEach(om -> om.setId(null));
                    s.getPSymbol().getParameterValues().forEach(om -> om.setId(null));
                });
    }

    private void checkIfOutputMappingNamesAreUnique(TestCase testCase) {
        final ArrayList<TestCaseStep> steps = new ArrayList<>();
        steps.addAll(testCase.getPreSteps());
        steps.addAll(testCase.getSteps());
        steps.addAll(testCase.getPostSteps());

        final ArrayList<SymbolOutputMapping> oms = new ArrayList<>();
        steps.forEach(s -> oms.addAll(s.getPSymbol().getOutputMappings()));
        SymbolOutputMappingUtils.checkIfMappedNamesAreUnique(oms);
    }

    private Test updateTestSuite(TestSuite testSuiteInDB, TestSuite testSuite) {
        testSuiteInDB.setName(testSuite.getName());
        return testRepository.save(testSuiteInDB);
    }

    public void delete(User user, Long projectId, Long testId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Test test = testRepository.findById(testId).orElse(null);
        checkAccess(user, project, test);
        checkRunningTestProcess(user, project, test);

        // check lock status
        testPresenceService.checkLockStatusStrict(projectId, testId, user.getId());

        // check test configs
        if (!testExecutionConfigRepository.findAllByProject_IdAndTest_Id(projectId, testId).isEmpty()) {
            throw new ForbiddenOperationException("The test " +  test.getName() + " is associated with one or more test configs.");
        }

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

    public void delete(User user, Long projectId, List<Long> ids) {
        for (Long id : ids) {
            delete(user, projectId, id);
        }
    }

    public List<Test> move(User user, Long projectId, List<Long> testIds, Long targetId) {
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
        checkRunningTestProcess(user, project, target);

        for (Test test : tests) {
            checkAccess(user, project, test);

            //check lock status
            testPresenceService.checkLockStatusStrict(projectId, test.getId(), user.getId());

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

    public List<TestCase> getTestCases(User user, Long projectId, Long testSuiteId) {
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

    public Page<TestResult> getResults(User user, Long projectId, Long testId, Pageable pageable) {
        get(user, projectId, testId);

        final Page<TestResult> results = testResultRepository.findAllByTest_IdOrderByTestReport_StartDateDesc(testId, pageable);
        results.forEach(this::loadLazyRelations);

        return results;
    }

    public void checkAccess(User user, Project project, Test test) {
        projectDAO.checkAccess(user, project);

        if (test == null) {
            throw new NotFoundException("The test could not be found.");
        }

        if (!test.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the test.");
        }
    }

    public void checkRunningTestProcess(User user, Project project, Test test) {
        if (this.getActiveTests(user, project).stream().anyMatch(t -> t.getId().equals(test.getId()))) {
            throw new EntityLockedException("The test is currently used in the active test process.");
        }
    }

    public Set<Test> getActiveTests(User user, Project project) {
        Set<Test> result = new HashSet<>();

        TestStatus testStatus = this.testService.getStatus(user, project.getId());
        if (testStatus.isActive()) {
            Stream.of(List.of(testStatus.getCurrentTestRun()), testStatus.getTestRunQueue())
                    .flatMap(List::stream)
                    .filter(testQueueItem ->
                            testQueueItem.getReport().getStatus().equals(TestReport.Status.IN_PROGRESS)
                                    || testQueueItem.getReport().getStatus().equals(TestReport.Status.PENDING))
                    .map(TestQueueItem::getConfig)
                    .map(TestExecutionConfig::getTestIds)
                    .flatMap(Collection::stream)
                    .collect(Collectors.toSet()).stream()
                    .map(testIds -> get(user, project.getId(), testIds))
                    .forEach(test -> {
                        result.add(test);
                        result.addAll(extractDescendantTests(test));
                        result.addAll(extractAncestorTests(test));
                    });
        }

        return result;
    }

    private Set<Test> extractDescendantTests(Test test) {
        Set<Test> result = new HashSet<>();

        if (test instanceof TestSuite) {
            result.addAll(((TestSuite) test).getTestCases());
            ((TestSuite) test).getTestSuites().forEach(descendant -> {
                result.add(descendant);
                result.addAll(extractDescendantTests(descendant));
            });
        }

        return result;
    }

    private Set<Test> extractAncestorTests(Test test) {
        Set<Test> result = new HashSet<>();

        Optional.ofNullable(test.getParent())
                .ifPresent(ancestor -> {
                    result.add(ancestor);
                    result.addAll(extractAncestorTests(ancestor));
                });

        return result;
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
            final Map<String, SymbolInputParameter> inputMap = step.getPSymbol().getSymbol().getInputs().stream()
                    .collect(Collectors.toMap(SymbolInputParameter::getName, Function.identity()));

            step.getPSymbol().getParameterValues().forEach(value ->
                    value.setParameter(inputMap.get(value.getParameter().getName()))
            );

            // do the same for outputs
            final Map<String, SymbolOutputParameter> outputMap = step.getPSymbol().getSymbol().getOutputs().stream()
                    .collect(Collectors.toMap(SymbolOutputParameter::getName, Function.identity()));

            step.getPSymbol().getOutputMappings().forEach(om -> {
                om.setParameter(outputMap.get(om.getParameter().getName()));
            });

            parameterizedSymbolDAO.create(step.getPSymbol());
        });
    }

    private void loadLazyRelations(TestResult testResult) {
        if (testResult instanceof TestCaseResult) {
            Hibernate.initialize(((TestCaseResult) testResult).getOutputs());
            ((TestCaseResult) testResult).getOutputs().forEach(out -> Hibernate.initialize(out.getSymbol()));
        }
    }

    private void loadLazyRelations(Test test) {
        Hibernate.initialize(test.getProject());
        Hibernate.initialize(test.getProject().getEnvironments());

        if (test instanceof TestSuite) {
            TestSuite testSuite = (TestSuite) test;
            Hibernate.initialize(testSuite.getTests());
            testSuite.getTests().forEach(this::loadLazyRelations);
        } else if (test instanceof TestCase) {
            TestCase testCase = (TestCase) test;
            Hibernate.initialize(testCase.getSteps());
            testCase.getSteps().forEach(step -> ParameterizedSymbolDAO.loadLazyRelations((step.getPSymbol())));
            Hibernate.initialize(testCase.getPreSteps());
            testCase.getPreSteps().forEach(step -> ParameterizedSymbolDAO.loadLazyRelations((step.getPSymbol())));
            Hibernate.initialize(testCase.getPostSteps());
            testCase.getPostSteps().forEach(step -> ParameterizedSymbolDAO.loadLazyRelations((step.getPSymbol())));
            Hibernate.initialize(testCase.getLastUpdatedBy());
        }
    }

    private void beforeSaving(User user, Project project, Test test) {
        if (test instanceof TestSuite) {
            TestSuite testSuite = (TestSuite) test;
            for (Long testId : testSuite.getTestsAsIds()) {
                final var otherTest = testRepository.findById(testId).orElse(null);
                checkAccess(user, project, otherTest);
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
