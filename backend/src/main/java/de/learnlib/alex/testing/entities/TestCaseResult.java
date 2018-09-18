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
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
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
            fetch = FetchType.LAZY,
            cascade = {CascadeType.ALL}
    )
    private List<TestExecutionResult> outputs;

    /** If the test passed. */
    private boolean passed;

    /**
     * Constructor.
     */
    public TestCaseResult() {
        this.outputs = new ArrayList<>();
    }

    /**
     * Constructor.
     *
     * @param testCase
     *         The test case that has been executed.
     * @param outputs
     *         The recorded outputs.
     * @param passed
     *         If the test passed.
     * @param time
     *         The time it took to execute the test in ms.
     */
    public TestCaseResult(TestCase testCase, List<TestExecutionResult> outputs, boolean passed, long time) {
        super(testCase);
        this.outputs = outputs;
        this.passed = passed;
        this.time = time;

        this.outputs.forEach(out -> out.setResult(this));
    }

    public List<TestExecutionResult> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<TestExecutionResult> outputs) {
        this.outputs = outputs;
    }

    @Override
    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
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
}
