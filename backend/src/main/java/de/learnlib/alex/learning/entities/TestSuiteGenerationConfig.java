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

package de.learnlib.alex.learning.entities;

import javax.validation.ValidationException;

/** The configuration class for the test suite generation. */
public class TestSuiteGenerationConfig {

    /** Which strategy is used for test generation. */
    public enum GenerationMethod {

        /** Use discrimination tree. */
        DT,

        /** Use w method. */
        W_METHOD,

        /** Use the wp method. */
        WP_METHOD,

        TRANS_COVER,
    }

    /** The number of the step. */
    private Long stepNo;

    /** The name of the generated test suite. */
    private String name;

    /** If concrete parameter values are generated as well. */
    private boolean includeParameterValues;

    private Long testSuiteToUpdateId;

    /** which method is used. */
    private GenerationMethod method;

    /** Constructor. */
    public TestSuiteGenerationConfig() {
        this.stepNo = 1L;
        this.name = "test suite";
        this.includeParameterValues = true;
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

    public boolean isIncludeParameterValues() {
        return includeParameterValues;
    }

    public void setIncludeParameterValues(boolean includeParameterValues) {
        this.includeParameterValues = includeParameterValues;
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

    /**
     * Validate the object.
     *
     * @throws ValidationException
     *         If one of the properties are not valid.
     */
    public void validate() throws ValidationException {
        if (stepNo == null || stepNo < 1) {
            throw new ValidationException("The step number must be greater than 0.");
        } else if (name == null || name.trim().equals("")) {
            throw new ValidationException("The name of the test suite may not be empty.");
        }
    }
}
