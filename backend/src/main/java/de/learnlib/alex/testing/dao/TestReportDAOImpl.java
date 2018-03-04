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
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

/** The implementation of the test report DAO . */
@Service
public class TestReportDAOImpl implements TestReportDAO {

    /** The test report repository. */
    private TestReportRepository testReportRepository;

    /** The project DAO. */
    private ProjectDAO projectDAO;

    /**
     * Constructor.
     *
     * @param testReportRepository {@link #testReportRepository}
     * @param projectDAO           {@link #projectDAO}
     */
    @Inject
    public TestReportDAOImpl(TestReportRepository testReportRepository, ProjectDAO projectDAO) {
        this.testReportRepository = testReportRepository;
        this.projectDAO = projectDAO;
    }

    @Override
    @Transactional
    public void create(User user, Long projectId, TestReport testReport) throws NotFoundException {
        final Project project = projectDAO.getByID(user.getId(), projectId);
        testReport.setProject(project);
        testReport.getTestResults().forEach((testResult) -> {
            testResult.setTestReport(testReport);
            testResult.setProject(project);
        });

        final Long highestId = testReportRepository.findHighestId(projectId);
        testReport.setId(highestId == null ? 1 : highestId + 1);

        testReportRepository.save(testReport);
    }

    @Override
    @Transactional
    public List<TestReport> get(User user, Long projectId) throws NotFoundException {
        final List<TestReport> testReports = testReportRepository.findAllByProject_Id(projectId);
        testReports.forEach(this::loadLazyRelations);
        return testReports;
    }

    @Override
    @Transactional
    public TestReport get(User user, Long projectId, Long testReportId) throws NotFoundException {
        final TestReport testReport = testReportRepository.findOneByProject_IdAndId(projectId, testReportId);
        if (testReport == null) {
            throw new NotFoundException("The test report with the id " + testReportId + " could not be found");
        }
        loadLazyRelations(testReport);
        return testReport;
    }

    @Override
    @Transactional
    public TestReport getLatest(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId);

        final TestReport latestReport = testReportRepository.findFirstByProject_IdOrderByIdDesc(projectId);
        if (latestReport != null) {
            loadLazyRelations(latestReport);
            return latestReport;
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long testReportId) throws NotFoundException {
        final TestReport testReport = get(user, projectId, testReportId);
        if (testReport == null) {
            throw new NotFoundException("The test report with the id " + testReportId + " could not be found");
        }
        testReportRepository.delete(testReport);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, List<Long> testReportIds) throws NotFoundException {
        for (Long id : testReportIds) {
            delete(user, projectId, id);
        }
    }

    private void loadLazyRelations(TestReport testReport) {
        Hibernate.initialize(testReport.getProject());
        Hibernate.initialize(testReport.getTestResults());

        testReport.getTestResults().forEach((result) -> {
            if (result instanceof TestCaseResult) {
                Hibernate.initialize(((TestCaseResult) result).getOutputs());
            }
        });
    }
}
