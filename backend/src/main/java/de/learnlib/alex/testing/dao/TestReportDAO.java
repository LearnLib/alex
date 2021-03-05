/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import de.learnlib.alex.testing.repositories.TestResultRepository;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.commons.io.FileUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The implementation of the test report DAO . */
@Service
@Transactional(rollbackFor = Exception.class)
public class TestReportDAO {

    private final TestReportRepository testReportRepository;
    private final TestResultRepository testResultRepository;
    private final ProjectRepository projectRepository;
    private final ProjectEnvironmentDAO projectEnvironmentDAO;
    private final ProjectDAO projectDAO;
    private final TestResultDAO testResultDAO;

    @Value("${alex.filesRootDir}")
    private String filesRootDir;

    @Autowired
    public TestReportDAO(
            TestReportRepository testReportRepository,
            ProjectRepository projectRepository,
            ProjectDAO projectDAO,
            ProjectEnvironmentDAO projectEnvironmentDAO,
            TestResultRepository testResultRepository,
            TestResultDAO testResultDAO
    ) {
        this.testReportRepository = testReportRepository;
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.projectEnvironmentDAO = projectEnvironmentDAO;
        this.testResultRepository = testResultRepository;
        this.testResultDAO = testResultDAO;
    }

    public TestReport create(User user, Long projectId, TestReport testReport) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        testReport.setId(null);
        testReport.setExecutedBy(user);
        testReport.setProject(project);
        testReport.getTestResults().forEach((testResult) -> {
            testResult.setTestReport(testReport);
            testResult.setProject(project);
        });

        final ProjectEnvironment env = projectEnvironmentDAO.getByID(user, testReport.getEnvironment().getId());
        testReport.setEnvironment(env);

        final TestReport createdTestReport = testReportRepository.save(testReport);
        loadLazyRelations(createdTestReport);
        return createdTestReport;
    }

    public List<TestReport> abortActiveTestReports() {
        final List<TestReport> pendingReports = testReportRepository.findAllByStatusIn(
                Arrays.asList(TestReport.Status.IN_PROGRESS, TestReport.Status.PENDING)
        );
        pendingReports.forEach(r -> r.setStatus(TestReport.Status.ABORTED));
        return testReportRepository.saveAll(pendingReports);
    }

    public Page<TestReport> getAll(User user, Long projectId, Pageable pageable) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final Page<TestReport> testReports = testReportRepository.findAllByProject_Id(projectId, pageable);
        testReports.forEach(this::loadLazyRelations);
        return testReports;
    }

    public TestReport get(User user, Long projectId, Long testReportId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport testReport = testReportRepository.findById(testReportId).orElse(null);
        checkAccess(user, project, testReport);

        loadLazyRelations(testReport);
        return testReport;
    }

    public TestReport getLatest(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final TestReport latestReport = testReportRepository.findFirstByProject_IdOrderByIdDesc(projectId);
        if (latestReport != null) {
            loadLazyRelations(latestReport);
            return latestReport;
        } else {
            return null;
        }
    }

    public TestReport update(User user, Long projectId, Long reportId, TestReport report) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport reportInDb = testReportRepository.findById(reportId).orElse(null);
        checkAccess(user, project, reportInDb);

        reportInDb.setStatus(report.getStatus());
        reportInDb.setTestResults(report.getTestResults());
        reportInDb.getTestResults().forEach((testResult) -> {
            testResult.setTestReport(reportInDb);
            testResult.setProject(project);
        });

        return testReportRepository.save(reportInDb);
    }

    public void delete(User user, Long projectId, Long testReportId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport testReport = testReportRepository.findById(testReportId).orElse(null);
        checkAccess(user, project, testReport);

        // delete screenshots
        testReport.getTestResults().forEach(testResult -> {
            if (testResult instanceof TestCaseResult) {
                if (((TestCaseResult) testResult).getBeforeScreenshot() != null) {
                    this.deleteScreenshot(user, projectId, testReportId, ((TestCaseResult) testResult).getBeforeScreenshot().getFilename());
                }
                ((TestCaseResult) testResult).getOutputs().forEach(testExecutionResult -> {
                    if (testExecutionResult.getTestScreenshot() != null) {
                        this.deleteScreenshot(user, projectId, testReportId, testExecutionResult.getTestScreenshot().getFilename());
                    }
                });
            }
        });

        testReportRepository.delete(testReport);
    }

    public void delete(User user, Long projectId, List<Long> testReportIds) {
        for (Long id : testReportIds) {
            delete(user, projectId, id);
        }
    }

    public File getScreenshot(User user, Long projectId, Long testReportId, String screenshotName) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport testReport = testReportRepository.findById(testReportId).orElse(null);
        checkAccess(user, project, testReport);

        String filePath = filesRootDir + "/test_screenshots/" + project.getId().toString() + "/" + screenshotName + ".png";
        File screenshot = Paths.get(filePath).toFile();
        if (!screenshot.exists()) {
            throw new NotFoundException("The requested screenshot does not exists.");
        }

        return screenshot;
    }

    public byte[] getScreenshotsAsZip(User user, Long projectId, Long testReportId, Long resultId) throws IOException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport testReport = testReportRepository.findById(testReportId).orElse(null);
        checkAccess(user, project, testReport);

        final var result = testResultRepository.findById(resultId);
        if (result.isEmpty()) {
            throw new NotFoundException("The requested test result does not exist.");
        }

        final var testResult = result.get();
        if (testResult instanceof TestSuiteResult) {
            throw new IllegalArgumentException("The requested test result is of type TestCaseResult.");
        }

        try (
                final var bos = new ByteArrayOutputStream();
                final var zos = new ZipOutputStream(bos);
        ) {
            final var testCaseResult = (TestCaseResult) testResult;

            final var beforeScreenshot = testCaseResult.getBeforeScreenshot();
            if (beforeScreenshot != null) {
                var beforeScreenshotFile = this.getScreenshot(user, projectId, testReportId, beforeScreenshot.getFilename());
                writeToZipFile(beforeScreenshotFile, "000__screenshot_after_pre_symbols.png", zos);
            }

            final var outputs = testCaseResult.getOutputs();
            for (int i = 0; i < outputs.size(); i++) {
                var output = outputs.get(i);
                if (output.getTestScreenshot() != null) {
                    var screenshotFile = this.getScreenshot(user, projectId, testReportId, output.getTestScreenshot().getFilename());
                    writeToZipFile(screenshotFile, getScreenshotFilename(i, outputs.get(i)), zos);
                }
            }

            return bos.toByteArray();
        }
    }

    public void deleteScreenshot(User user, Long projectId, Long testReportId, String screenshotName) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestReport testReport = testReportRepository.findById(testReportId).orElse(null);
        checkAccess(user, project, testReport);

        String filePath = filesRootDir + "/test_screenshots/" + project.getId().toString() + "/" + screenshotName + ".png";
        File screenshot = Paths.get(filePath).toFile();
        if (screenshot.exists()) {
            screenshot.delete();
        }
    }

    public void deleteScreenshotDirectory(User user, Long projectId) throws IOException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        this.projectDAO.checkAccess(user, project);

        String dirPath = filesRootDir + "/test_screenshots/" + project.getId().toString();
        File directory = Paths.get(dirPath).toFile();
        if (directory.exists()) {
            FileUtils.deleteDirectory(directory);
        }
    }

    public TestReport updateStatus(Long reportId, TestReport.Status status) {
        final var report = testReportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("report not found."));

        report.setStatus(status);

        final var updatedReport = testReportRepository.save(report);
        loadLazyRelations(updatedReport);

        return updatedReport;
    }

    public TestReport getByID(Long reportId) {
        final var report = testReportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("report not found."));

        loadLazyRelations(report);

        return report;
    }

    public void checkAccess(User user, Project project, TestReport report) {
        projectDAO.checkAccess(user, project);

        if (report == null) {
            throw new NotFoundException("The test report could not be found.");
        }

        if (!report.getProject().getId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the test report.");
        }
    }

    private void writeToZipFile(File file, String targetPath, ZipOutputStream zos) throws IOException {
        try (final var fis = new FileInputStream(file)) {
            var zipEntry = new ZipEntry(targetPath);
            zos.putNextEntry(zipEntry);

            byte[] bytes = new byte[1024];
            int length;
            while ((length = fis.read(bytes)) >= 0) {
                zos.write(bytes, 0, length);
            }

            zos.closeEntry();
        }
    }

    private String getScreenshotFilename(int i, TestExecutionResult testExecutionResult) {
        return String.format("%03d", i + 1)
                + "__"
                + testExecutionResult.getSymbol().getName().replaceAll("\\s", "_")
                + "__"
                + testExecutionResult.getOutput().replaceAll("\\s", "_")
                + ".png";
    }

    private void loadLazyRelations(TestReport testReport) {
        Hibernate.initialize(testReport.getProject());
        Hibernate.initialize(testReport.getTestResults());
        Hibernate.initialize(testReport.getEnvironment());
        ProjectEnvironmentDAO.loadLazyRelations(testReport.getEnvironment());
        testReport.getTestResults().forEach(testResultDAO::loadLazyRelations);
    }
}
