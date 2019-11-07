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

import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.entities.webdrivers.HtmlUnitDriverConfig;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * The configuration class for running multiple tests in a batch.
 */
@Entity
public class TestExecutionConfig implements Serializable {

    private static final long serialVersionUID = -1523151999366958537L;

    /** The id of the config in the database. */
    @Id
    @GeneratedValue
    private Long id;

    /** The ids of the tests to execute. */
    @ManyToMany
    private List<Test> tests;

    /** The configuration for the web driver. */
    @NotNull
    @OneToOne(cascade = CascadeType.ALL)
    private AbstractWebDriverConfig driverConfig;

    /** The id of the URL to use for testing. */
    @NotNull
    @OneToOne
    private ProjectEnvironment environment;

    /** The project where the config is saved. */
    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;

    private boolean isDefault;

    /** Constructor. */
    public TestExecutionConfig() {
        this(new ArrayList<>(), new HtmlUnitDriverConfig());
    }

    /**
     * Constructor.
     *
     * @param testIds
     *         The ids of the tests.
     * @param driverConfig
     *         The configuration for the web driver.
     */
    public TestExecutionConfig(List<Long> testIds, AbstractWebDriverConfig driverConfig) {
        this.setTestIds(testIds);
        this.driverConfig = driverConfig;
        this.isDefault = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Test> getTests() {
        return tests;
    }

    public void setTests(List<Test> tests) {
        this.tests = tests;
    }

    @Transient
    @JsonProperty("tests")
    public List<Long> getTestIds() {
        return tests.stream().map(Test::getId).collect(Collectors.toList());
    }

    @JsonProperty("tests")
    public void setTestIds(List<Long> testIds) {
        this.tests = testIds.stream()
                .map(Test::new)
                .collect(Collectors.toList());
    }

    public ProjectEnvironment getEnvironment() {
        return environment;
    }

    public void setEnvironment(ProjectEnvironment environment) {
        this.environment = environment;
    }

    @Transient
    @JsonProperty("environment")
    public Long getEnvironmentId() {
        return environment.getId();
    }

    @JsonProperty("environment")
    public void setEnvironmentId(Long environmentId) {
        this.environment = new ProjectEnvironment();
        this.environment.setId(environmentId);
    }

    public AbstractWebDriverConfig getDriverConfig() {
        return driverConfig;
    }

    public void setDriverConfig(AbstractWebDriverConfig driverConfig) {
        this.driverConfig = driverConfig;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return project == null ? null : project.getId();
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces")
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TestExecutionConfig)) return false;
        TestExecutionConfig that = (TestExecutionConfig) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

}
