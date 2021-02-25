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

package de.learnlib.alex.learning.entities;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/** The configuration class for the test suite generation. */
public class TestSuiteGenerationConfig {

    /** Which strategy is used for test generation. */
    public enum GenerationMethod {
        DT,
        W_METHOD,
        WP_METHOD,
        TRANS_COVER,
    }

    /** The number of the step. */
    @NotNull
    @Min(1)
    private Long stepNo;

    /** The name of the generated test suite. */
    @NotEmpty
    private String name;

    /** The ID of the test suite to update. */
    @NotNull
    private Long testSuiteToUpdateId;

    /** which method is used. */
    @NotNull
    private GenerationMethod method;

    /** Constructor. */
    public TestSuiteGenerationConfig() {
        this.stepNo = 1L;
        this.name = "test suite";
        this.method = GenerationMethod.DT;
    }

    public Long getStepNo() {
        return stepNo;
    }

    public void setStepNo(Long stepNo) {
        this.stepNo = stepNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GenerationMethod getMethod() {
        return method;
    }

    public void setMethod(GenerationMethod method) {
        this.method = method;
    }

    public Long getTestSuiteToUpdateId() {
        return testSuiteToUpdateId;
    }

    public void setTestSuiteToUpdateId(Long testSuiteToUpdateId) {
        this.testSuiteToUpdateId = testSuiteToUpdateId;
    }
}
