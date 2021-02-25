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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;

/**
 * The result of the execution of a test case.
 */
@Entity
@DiscriminatorValue("case")
@JsonTypeName("case")
public class TestCaseResult extends TestResult {

    private static final long serialVersionUID = -5995216881702329004L;

    /** The outputs of the system. */
    @OneToMany(
            mappedBy = "result",
            cascade = {CascadeType.ALL}
    )
    @OrderBy
    private List<TestExecutionResult> outputs;

    private Long failedStep;

    @OneToOne(
            cascade = {CascadeType.ALL}
    )
    @JoinColumn(name = "beforeTestScreenshotId")
    private TestScreenshot beforeScreenshot;

    /**
     * Constructor.
     */
    public TestCaseResult() {
        this.outputs = new ArrayList<>();
        this.failedStep = -1L;
    }

    /**
     * Constructor.
     *
     * @param testCase
     *         The test case that has been executed.
     * @param outputs
     *         The recorded outputs.
     * @param failedStep
     *         If the test passed.
     * @param time
     *         The time it took to execute the test in ms.
     */
    public TestCaseResult(TestCase testCase, List<TestExecutionResult> outputs, long failedStep, long time) {
        super(testCase);
        this.outputs = outputs;
        this.time = time;
        this.failedStep = failedStep;

        this.outputs.forEach(out -> {
            out.setResult(this);
        });
    }

    public List<TestExecutionResult> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<TestExecutionResult> outputs) {
        this.outputs = outputs;
    }

    public Long getFailedStep() {
        return failedStep;
    }

    public void setFailedStep(Long failedStep) {
        this.failedStep = failedStep;
    }

    @Transient
    @JsonProperty("passed")
    public boolean isPassed() {
        return this.failedStep.equals(-1L);
    }

    @JsonIgnore
    @JsonProperty("passed")
    public void setPassed(boolean passed) {
    }

    @Transient
    @JsonProperty("failureMessage")
    public String getFailureMessage() {
        final List<String> parts = new ArrayList<>();
        outputs.stream().filter(out -> !out.isSuccess()).forEach(out ->
                parts.add(out.getSymbol().getName() + ": " + out.getMessage())
        );
        return parts.isEmpty() ? "" : String.join(", ", parts);
    }

    @JsonIgnore
    @JsonProperty("failureMessage")
    public void setFailureMessage(String failureMessage) {
    }

    public TestScreenshot getBeforeScreenshot() {
        return beforeScreenshot;
    }

    public void setBeforeScreenshot(TestScreenshot beforeScreenshot) {
        this.beforeScreenshot = beforeScreenshot;
    }
}
