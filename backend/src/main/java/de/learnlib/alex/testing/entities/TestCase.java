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
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

/** Test case. */
@Entity
@DiscriminatorValue("case")
@JsonTypeName("case")
public class TestCase extends Test {

    private static final long serialVersionUID = 5961810799472877062L;

    /** The status of the test. */
    public enum Status {

        /** If it does not contain any steps. */
        EMPTY,

        /** If if contains at least one unimplemented symbol. */
        WORK_IN_PROGRESS,

        /** If not empty and there are no unimplemented symbols. */
        DONE
    }

    /**
     * Steps that are executed before the actual test. All steps have to pass in order for the test steps to be
     * executed.
     */
    @OrderColumn(name = "pre")
    private List<TestCaseStep> preSteps;

    /** The steps the test case is composed of. */
    @OrderColumn(name = "intermediate")
    private List<TestCaseStep> steps;

    /**
     * Steps that are executed after the test. The steps are also executed if the test fails. The result of the post
     * steps is ignored.
     */
    @OrderColumn(name = "post")
    private List<TestCaseStep> postSteps;

    /** Constructor. */
    public TestCase() {
        super();
        this.steps = new ArrayList<>();
        this.preSteps = new ArrayList<>();
        this.postSteps = new ArrayList<>();
    }

    @OneToMany(
            orphanRemoval = true
    )
    @JoinTable(
            name = "testCase_steps",
            joinColumns = {@JoinColumn(name = "testCaseId", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "testCaseStepId", referencedColumnName = "id")}
    )
    @OrderBy("number ASC")
    public List<TestCaseStep> getSteps() {
        return steps;
    }

    public void setSteps(List<TestCaseStep> steps) {
        this.steps = steps;
    }

    @OneToMany(
            orphanRemoval = true
    )
    @JoinTable(
            name = "testCase_preSteps",
            joinColumns = {@JoinColumn(name = "testCaseId", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "testCaseStepId", referencedColumnName = "id")}
    )
    @OrderBy("number ASC")
    public List<TestCaseStep> getPreSteps() {
        return preSteps;
    }

    public void setPreSteps(List<TestCaseStep> preSteps) {
        this.preSteps = preSteps;
    }

    @OneToMany(
            orphanRemoval = true
    )
    @JoinTable(
            name = "testCase_postSteps",
            joinColumns = {@JoinColumn(name = "testCaseId", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "testCaseStepId", referencedColumnName = "id")}
    )
    @OrderBy("number ASC")
    public List<TestCaseStep> getPostSteps() {
        return postSteps;
    }

    public void setPostSteps(List<TestCaseStep> postSteps) {
        this.postSteps = postSteps;
    }

    @Transient
    @JsonProperty("status")
    public Status getStatus() {
        if (this.steps.isEmpty()) {
            return Status.EMPTY;
        } else {
            for (TestCaseStep step : steps) {
                if (step.getPSymbol().getSymbol().getSteps().isEmpty()) {
                    return Status.WORK_IN_PROGRESS;
                }
            }
            return Status.DONE;
        }
    }

    @JsonProperty("status")
    public void setStatus(Status status) {
    }

    public boolean behavesLike(TestCase testCase) {
        return areSameSteps(preSteps, testCase.preSteps)
                && areSameSteps(postSteps, testCase.postSteps)
                && areSameSteps(steps, testCase.steps);
    }

    private boolean areSameSteps(List<TestCaseStep> stepsA, List<TestCaseStep> stepsB) {
        if (stepsA.size() != stepsB.size()) return false;

        for (int i = 0; i < stepsA.size(); i++) {
            if (!stepsA.get(i).behavesLike(stepsB.get(i))) return false;
        }

        return true;
    }
}
