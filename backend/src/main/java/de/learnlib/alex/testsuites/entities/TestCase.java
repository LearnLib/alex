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

package de.learnlib.alex.testsuites.entities;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/** Test case. */
@Entity
@DiscriminatorValue("case")
@JsonTypeName("case")
public class TestCase extends Test implements Serializable {

    /** The map with the variables for the test case. */
    private HashMap<String, String> variables;

    /** If the test case execution should pass. */
    private boolean shouldPass;

    /** The steps the test case is composed of. */
    private List<TestCaseStep> steps;

    /** Constructor. */
    public TestCase() {
        super();
        this.steps = new ArrayList<>();
        this.variables = new HashMap<>();
        this.shouldPass = true;
    }

    @OneToMany(
            mappedBy = "testCase",
            orphanRemoval = true
    )
    @OrderBy("number ASC")
    public List<TestCaseStep> getSteps() {
        return steps;
    }

    public void setSteps(List<TestCaseStep> steps) {
        this.steps = steps;
    }

    @Lob
    public HashMap<String, String> getVariables() {
        return variables;
    }

    public void setVariables(HashMap<String, String> variables) {
        this.variables = variables;
    }

    public boolean isShouldPass() {
        return shouldPass;
    }

    public void setShouldPass(boolean shouldPass) {
        this.shouldPass = shouldPass;
    }
}
