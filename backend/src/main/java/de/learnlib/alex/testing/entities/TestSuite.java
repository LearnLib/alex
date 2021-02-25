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
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Test suite.
 * Can contain other test suites or test cases.
 */
@Entity
@DiscriminatorValue("suite")
@JsonTypeName("suite")
public class TestSuite extends Test {

    private static final long serialVersionUID = 3997432889140612741L;

    /** The tests that belong to the test suite. */
    private List<Test> tests;

    /** The IDs of the tests that belong the the test suite. */
    private List<Long> testsAsIds;

    /** Constructor. */
    public TestSuite() {
        this.tests = new ArrayList<>();
        this.testsAsIds = new ArrayList<>();
    }

    @OneToMany(
            mappedBy = "parent",
            cascade = {CascadeType.PERSIST, CascadeType.REMOVE}
    )
    @JsonProperty("tests")
    public List<Test> getTests() {
        return tests;
    }

    /**
     * @return A list of Test IDs.
     */
    @Transient
    @JsonIgnore
    public List<Long> getTestsAsIds() {
        if (testsAsIds == null || testsAsIds.isEmpty()) {
            testsAsIds = new ArrayList<>();
        }
        return testsAsIds;
    }

    @JsonIgnore
    public void setTests(List<Test> tests) {
        if (tests == null) {
            this.tests = new ArrayList<>();
        } else {
            this.tests = tests;
            this.testsAsIds = tests.stream().map(Test::getId).collect(Collectors.toList());
        }
    }

    /**
     * @param testsAsIds A list of Test IDs.
     */
    @Transient
    @JsonProperty("testIds")
    public void setTestsAsIds(List<Long> testsAsIds) {
        this.testsAsIds = testsAsIds;
    }

    @Transient
    @JsonProperty("tests")
    public void setTestsAsTests(List<Test> tests) {
        this.tests = tests;
    }

    @JsonIgnore
    public void addTest(Test test) {
        this.tests.add(test);
        test.setParent(this);
    }

    /**
     * Check if the test suite is a descendant of another test suite.
     *
     * @param ancestor
     *         The ancestor in the test suite tree.
     * @return True, if the test suite is a descendant.
     */
    public boolean isDescendantOf(TestSuite ancestor) {
        if (ancestor.getId().equals(id)) {
            return false;
        }

        final List<TestSuite> testSuites = new ArrayList<>();
        ancestor.getTests().stream()
                .filter(TestSuite.class::isInstance)
                .forEach(ts -> testSuites.add((TestSuite) ts));

        for (TestSuite testSuite : testSuites) {
            boolean isDescendant = testSuite.getId().equals(id) || isDescendantOf(testSuite);
            if (isDescendant) {
                return true;
            }
        }

        return false;
    }

    @Transient
    @JsonIgnore
    public List<TestSuite> getTestSuites() {
        return tests.stream().filter(t -> t instanceof TestSuite).map(t -> (TestSuite) t).collect(Collectors.toList());
    }

    @Transient
    @JsonIgnore
    public List<TestCase> getTestCases() {
        return tests.stream().filter(t -> t instanceof TestCase).map(t -> (TestCase) t).collect(Collectors.toList());
    }

    public int indexOfTestCaseThatBehavesLike(TestCase testCase) {
        for (int i = 0; i < this.tests.size(); i++) {
            final Test test = this.tests.get(i);
            if (test instanceof TestCase && ((TestCase) test).behavesLike(testCase)) {
                return i;
            }
        }
        return -1;
    }
}

