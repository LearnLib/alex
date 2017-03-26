/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.Learner;

/**
 * Class to provide information about the current learn process.
 */
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerStatus {

    /** Is the Learner active? */
    private final boolean active;

    /** The ID of the Project this test status belongs to. */
    private final Long projectId;

    /** The current test no. */
    private final Long testNo;

    /** The current step number. */
    private final Long stepNo;

    /** The statistics of the learner. */
    private final Statistics statistics;

    /** The phase the learner is in. */
    private final Learner.LearnerPhase learnerPhase;

    /**
     * Constructor for a status of an inactive thread.
     */
    public LearnerStatus() {
        this.active = false;
        this.projectId = null;
        this.testNo = null;
        this.stepNo = null;
        this.statistics = null;
        this.learnerPhase = null;
    }

    /**
     * Constructor for a status of an active thread.
     *
     * @param learnerResult
     *         The result that contain the interesting statistics and information for the status..
     */
    public LearnerStatus(LearnerResult learnerResult, Learner.LearnerPhase learnerPhase) {
        this.active = true;
        this.projectId = learnerResult.getProjectId();
        this.testNo = learnerResult.getTestNo();
        this.stepNo = (long) learnerResult.getSteps().size();
        this.statistics = learnerResult.getStatistics();
        this.learnerPhase = learnerPhase;
    }

    /**
     * Is the learn process active?
     *
     * @return true if the learn process is active; false otherwise
     */
    public boolean isActive() {
        return active;
    }

    /**
     * The project id of the currently active project.
     * Only included if the learner is active.
     *
     * @return The active project id.
     */
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * The test no in the active project of the currently active learn process.
     * Only included if the learner is active.
     *
     * @return The active test no in the project.
     */
    public Long getTestNo() {
        return testNo;
    }

    /**
     * Additional Statistics of the learn process.
     * Only included if the learner is active.
     *
     * @return Additional statistics, e.g. the start date.
     */
    public Statistics getStatistics() {
        return statistics;
    }

    /** @return {@link #stepNo}. */
    public Long getStepNo() {
        return stepNo;
    }

    /** @return {@link #learnerPhase}. */
    public Learner.LearnerPhase getLearnerPhase() {
        return learnerPhase;
    }

    @Override
    public String toString() {
        return "LearnerStatus for Project " + projectId + " and Test No. " + testNo + ": " + active;
    }
}
