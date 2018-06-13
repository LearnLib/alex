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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.services.Learner;

import java.util.List;

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

    /** The phase the learner is in. */
    private final Learner.LearnerPhase learnerPhase;

    /** The list of queries that are processed atm. */
    private final List<DefaultQueryProxy> currentQueries;

    /** The current learner result. */
    private final LearnerResult result;

    /**
     * Constructor for a status of an inactive thread.
     */
    public LearnerStatus() {
        this.active = false;
        this.projectId = null;
        this.testNo = null;
        this.stepNo = null;
        this.learnerPhase = null;
        this.currentQueries = null;
        this.result = null;
    }

    /**
     * Constructor for a status of an active thread.
     *
     * @param learnerResult
     *         The result that contain the interesting statistics and information for the status.
     * @param learnerPhase
     *         The current phase of the experiment.
     * @param currentQueries
     *         The queries that are executed at the moment.
     */
    public LearnerStatus(LearnerResult learnerResult, Learner.LearnerPhase learnerPhase,
            List<DefaultQueryProxy> currentQueries) {
        this.active = true;
        this.projectId = learnerResult.getProjectId();
        this.testNo = learnerResult.getTestNo();
        this.stepNo = (long) learnerResult.getSteps().size();
        this.learnerPhase = learnerPhase;
        this.currentQueries = currentQueries;
        this.result = learnerResult;
    }

    public boolean isActive() {
        return active;
    }

    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    public Long getTestNo() {
        return testNo;
    }

    public Long getStepNo() {
        return stepNo;
    }

    public Learner.LearnerPhase getLearnerPhase() {
        return learnerPhase;
    }

    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    public LearnerResult getResult() {
        return result;
    }

    @Override
    public String toString() {
        return "LearnerStatus{"
                + "active=" + active
                + ", projectId=" + projectId
                + ", testNo=" + testNo
                + ", stepNo=" + stepNo
                + '}';
    }
}
