/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import de.learnlib.alex.testing.repositories.TestResultRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class TestResultDAO {

    private final ProjectRepository projectRepository;
    private final TestReportDAO testReportDAO;
    private final TestReportRepository testReportRepository;

    @Autowired
    public TestResultDAO(
            ProjectRepository projectRepository,
            @Lazy TestReportDAO testReportDAO,
            TestReportRepository testReportRepository
    ) {
        this.projectRepository = projectRepository;
        this.testReportDAO = testReportDAO;
        this.testReportRepository = testReportRepository;
    }

    public TestResult getByID(User user, Long projectId, Long reportId, Long testResultId) {
        final var project = projectRepository.getOne(projectId);
        final var report = testReportRepository.getOne(reportId);
        final var result = report.getTestResults().stream()
                .filter(r -> r.getId().equals(testResultId))
                .findFirst()
                .orElse(null);

        checkAccess(user, project, report, result);
        loadLazyRelations(result);

        return result;
    }

    public void loadLazyRelations(TestResult testResult) {
        if (testResult instanceof TestCaseResult) {
            Hibernate.initialize(((TestCaseResult) testResult).getOutputs());
        }
    }

    public void checkAccess(User user, Project project, TestReport testReport, TestResult testResult) {
        testReportDAO.checkAccess(user, project, testReport);

        if (testResult == null) {
            throw new NotFoundException("The test result could not be found.");
        }

        if (!testResult.getTestReport().getId().equals(testReport.getId())) {
            throw new UnauthorizedException("You are not allowed to access the test result");
        }
    }
}
