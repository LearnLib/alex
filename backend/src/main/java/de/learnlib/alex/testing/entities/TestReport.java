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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/** The test report. */
@Entity
public class TestReport implements Serializable {

    private static final long serialVersionUID = 1046158779314008741L;

    /** The date formatter for the report. */
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    public enum  Status {
        PENDING,
        IN_PROGRESS,
        FINISHED,
        ABORTED
    }

    /** The id in the database. */
    @Id
    @GeneratedValue
    private Long id;

    /** The project the report belongs to. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JsonIgnore
    private Project project;

    /** When the test started. */
    @JsonIgnore
    private ZonedDateTime startDate;

    /** The results of the tests that have been executed in the test run. */
    @OneToMany(
            mappedBy = "testReport",
            cascade = {CascadeType.ALL}
    )
    private List<TestResult> testResults;

    /** The environment that the test was executed in. */
    @OneToOne(fetch = FetchType.EAGER)
    private ProjectEnvironment environment;

    private Status status;

    /** Constructor. */
    public TestReport() {
        this.testResults = new ArrayList<>();
        this.startDate = ZonedDateTime.now();
        this.status = Status.PENDING;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    @JsonProperty("startDate")
    public String getStartDateAsString() {
        return startDate.format(DATE_TIME_FORMATTER);
    }

    @JsonProperty("startDate")
    public void setStartDateByString(String dateAsString) {
        this.startDate = ZonedDateTime.parse(dateAsString);
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @JsonProperty("project")
    public Long getProjectId() {
        return this.project == null ? 0L : this.project.getId();
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public ProjectEnvironment getEnvironment() {
        return environment;
    }

    public void setEnvironment(ProjectEnvironment environment) {
        this.environment = environment;
    }

    public List<TestResult> getTestResults() {
        return testResults;
    }

    public void setTestResults(List<TestResult> testResults) {
        this.testResults = testResults;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Evaluate if the test run passed.
     *
     * @return If the test run passed.
     */
    @Transient
    public boolean isPassed() {
        return this.status.equals(Status.FINISHED) && this.testResults.stream()
                .map(TestResult::isPassed)
                .reduce(true, (a, b) -> a && b);
    }

    /**
     * Calculate the time it took to execute the tests.
     *
     * @return The time in ms.
     */
    @Transient
    public Long getTime() {
        return this.testResults.stream()
                .filter(r -> r instanceof TestCaseResult)
                .map(TestResult::getTime)
                .reduce(0L, (a, b) -> a + b);
    }

    /**
     * Count the number of test cases that have been executed.
     *
     * @return The number of tests.
     */
    @Transient
    public Long getNumTests() {
        return this.testResults.stream()
                .filter(r -> r instanceof TestCaseResult)
                .count();
    }

    /**
     * Count the number of test cases that failed.
     *
     * @return The number of tests that failed.
     */
    @Transient
    public Long getNumTestsFailed() {
        return this.testResults.stream()
                .filter(r -> r instanceof TestCaseResult)
                .filter(r -> !r.isPassed())
                .count();
    }

    /**
     * Count the number of test cases that passed.
     *
     * @return The number of tests that passed.
     */
    @Transient
    public Long getNumTestsPassed() {
        return this.testResults.stream()
                .filter(r -> r instanceof TestCaseResult)
                .filter(TestResult::isPassed)
                .count();
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
