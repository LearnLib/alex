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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entity class to store the result of a test run, i.e. the outcome of a learn iteration and must not be the final
 * result. The result contains the configuration of the learning process, the resulting hypothesis and some meta data
 * (duration, #EQ, ...).
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class LearnerResult implements Serializable {

    private static final long serialVersionUID = 4619722174562257862L;

    public enum Status {
        PENDING,
        IN_PROGRESS,
        FINISHED,
        ABORTED
    }

    /** The id of the LearnerResult in the DB. */
    private Long id;

    /** The reference to the Project the test run belongs to. */
    private Project project;

    /** The test no. within a Project which lead to the result. */
    private Long testNo;

    /** The setup that has been used for the learning process. */
    private LearnerSetup setup;

    /** The steps of the LearnerResult. */
    private List<LearnerResultStep> steps;

    /** A comment to describe the intention / setting of the learn process. This field is optional. */
    private String comment;

    /** The current status. */
    private Status status;

    /** The user who started the learn process. */
    private User executedBy;

    /** Constructor. */
    public LearnerResult() {
        this.steps = new ArrayList<>();
        this.comment = "";
        this.status = Status.PENDING;
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(optional = false)
    @JsonIgnore
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

    @Column(nullable = false)
    public Long getTestNo() {
        return testNo;
    }

    public void setTestNo(Long testNo) {
        this.testNo = testNo;
    }

    @OneToMany(
            mappedBy = "result",
            orphanRemoval = true
    )
    @OrderBy("stepNo ASC")
    public List<LearnerResultStep> getSteps() {
        return steps;
    }

    public void setSteps(List<LearnerResultStep> steps) {
        this.steps = steps;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @OneToOne(cascade = CascadeType.REMOVE)
    public LearnerSetup getSetup() {
        return setup;
    }

    public void setSetup(LearnerSetup setup) {
        this.setup = setup;
    }

    /**
     * Get the statistic of this learn step.
     *
     * @return The learning statistics.
     */
    @JsonProperty
    @Transient
    public Statistics getStatistics() {
        final Statistics statistics = new Statistics();
        steps.forEach(s -> statistics.updateBy(s.getStatistics()));
        if (!steps.isEmpty()) {
            statistics.setStartDate(steps.get(0).getStatistics().getStartDate());
        }
        return statistics;
    }

    public void setStatistics(Statistics statistics) {
    }

    /**
     * Did some kind of error occurred during the learning, i.e. the error text property is set.
     *
     * @return true if the result represents a failed learning process; null otherwise.
     */
    @Transient
    @JsonProperty("error")
    public Boolean isError() {
        return steps.stream().anyMatch(s -> s.getErrorText() != null);
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "executedById")
    @JsonProperty("executedBy")
    public User getExecutedBy() {
        return executedBy;
    }

    @JsonIgnore
    public void setExecutedBy(User executedBy) {
        this.executedBy = executedBy;
    }

    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LearnerResult result = (LearnerResult) o;
        return Objects.equals(id, result.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "[LearnerResult " + id + "] " + project + " / " + testNo;
    }
}
