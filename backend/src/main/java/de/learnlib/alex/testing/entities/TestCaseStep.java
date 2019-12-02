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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/** The step of a test case. */
@Entity
public class TestCaseStep implements Serializable {

    private static final long serialVersionUID = -8377670318070009082L;

    /** The database id. */
    @Id
    @GeneratedValue
    private Long id;

    /** The text case. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinTable(
            name = "testCase_testCaseStep",
            joinColumns = {@JoinColumn(name = "testCaseStepId", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "testCaseId", referencedColumnName = "id")}
    )
    @JsonIgnore
    private TestCase testCase;

    /** The order number in the test. */
    @JsonIgnore
    private int number;

    /** The symbol to execute. */
    @OneToOne(
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL
    )
    private ParameterizedSymbol pSymbol;

    /** The expected result of the step in a natural language. */
    @Column(columnDefinition = "MEDIUMTEXT")
    private String expectedResult;

    @NotNull
    private boolean expectedOutputSuccess;

    @NotNull
    private String expectedOutputMessage;

    /** Constructor. */
    public TestCaseStep() {
        this.expectedResult = "";
        this.expectedOutputSuccess = true;
        this.expectedOutputMessage = "";
    }

    @Transient
    @JsonIgnore
    public String getComputedOutput() {
        return new ExecuteResult(expectedOutputSuccess, expectedOutputMessage.equals("") ? null : expectedOutputMessage).getOutput();
    }

    /**
     * Executes the step.
     *
     * @param connectors
     *         The connector manager.
     * @return The result of the step.
     */
    public ExecuteResult execute(ConnectorManager connectors) {
        return pSymbol.execute(connectors);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TestCase getTestCase() {
        return testCase;
    }

    public void setTestCase(TestCase testCase) {
        this.testCase = testCase;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    @JsonProperty("pSymbol")
    public ParameterizedSymbol getPSymbol() {
        return pSymbol;
    }

    @JsonProperty("pSymbol")
    public void setPSymbol(ParameterizedSymbol pSymbol) {
        this.pSymbol = pSymbol;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult == null ? "" : expectedResult;
    }

    public boolean isExpectedOutputSuccess() {
        return expectedOutputSuccess;
    }

    public void setExpectedOutputSuccess(boolean expectedOutputSuccess) {
        this.expectedOutputSuccess = expectedOutputSuccess;
    }

    public String getExpectedOutputMessage() {
        return expectedOutputMessage;
    }

    public void setExpectedOutputMessage(String expectedOutputMessage) {
        this.expectedOutputMessage = expectedOutputMessage;
    }

    public boolean behavesLike(TestCaseStep step) {
        return getComputedOutput().equals(step.getComputedOutput())
                && pSymbol.getAliasOrComputedName().equals(step.getPSymbol().getAliasOrComputedName());
    }
}
