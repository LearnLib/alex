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

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

/** Test case. */
@Entity
@DiscriminatorValue("case")
@JsonTypeName("case")
public class TestCase extends Test {

    private static final long serialVersionUID = 5961810799472877062L;

    /** The steps the test case is composed of. */
    private List<TestCaseStep> steps;

    /** Constructor. */
    public TestCase() {
        super();
        this.steps = new ArrayList<>();
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
}
