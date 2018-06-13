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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.alex.data.entities.Project;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.UUID;

/**
 * The result of a test execution.
 */
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "case", value = TestCaseResult.class),
        @JsonSubTypes.Type(name = "suite", value = TestSuiteResult.class),
})
public abstract class TestResult implements Serializable {

    private static final long serialVersionUID = -4509801862717378522L;

    /** The ID of the test result in the database. */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @JsonIgnore
    protected UUID uuid;

    /** The test that has been executed. */
    @ManyToOne
    @JoinColumn(name = "testId")
    @JsonIgnore
    private Test test;

    /** The test that has been executed. */
    @ManyToOne
    @JoinColumn(name = "testReportId")
    @JsonIgnore
    private TestReport testReport;

    /** The project the counter belongs to. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JsonIgnore
    private Project project;

    /** The time it took to execute the test in ms. */
    protected long time;

    /**
     * Constructor.
     */
    public TestResult() {
    }

    /**
     * Constructor.
     *
     * @param test
     *         The test that has been executed.
     */
    public TestResult(Test test) {
        this.test = test;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    @JsonProperty("test")
    public Test.TestRepresentation getTestRepresentation() {
        return new Test.TestRepresentation(test);
    }

    /**
     * The the associated test by its ID.
     *
     * @param id
     *         The ID of the test.
     */
    @JsonProperty("test")
    public void setTestId(Long id) {
        this.test = new Test();
        this.test.setId(id);
    }

    public TestReport getTestReport() {
        return testReport;
    }

    public void setTestReport(TestReport testReport) {
        this.testReport = testReport;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
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

    @Transient
    public abstract boolean isPassed();
}
