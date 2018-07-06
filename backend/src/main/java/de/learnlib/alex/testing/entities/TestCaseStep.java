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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.SymbolRepresentation;
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
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
            fetch = FetchType.EAGER
    )
    @JsonIgnore
    private Symbol symbol;

    /** The values for the parameters defined in {@link #symbol}. */
    @OneToMany(
            cascade = {CascadeType.MERGE, CascadeType.REMOVE},
            fetch = FetchType.EAGER
    )
    private List<SymbolParameterValue> parameterValues;

    /** If the step should fail. This eliminates the need to create a separate symbol. */
    @NotNull
    private boolean shouldFail;

    /** The expected result of the step in a natural language. */
    @Column(columnDefinition = "MEDIUMTEXT")
    private String expectedResult;

    /** Constructor. */
    public TestCaseStep() {
        this.shouldFail = false;
        this.parameterValues = new ArrayList<>();
        this.expectedResult = "";
    }

    /**
     * Executes the step.
     *
     * @param connectors
     *         The connector manager.
     * @return The result of the step.
     */
    public ExecuteResult execute(ConnectorManager connectors) {
        return symbol.execute(connectors);
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

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    @JsonProperty("symbol")
    public SymbolRepresentation getSymbolId() {
        return new SymbolRepresentation(symbol);
    }

    /**
     * Set the symbol by a symbol ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     */
    @JsonProperty("symbol")
    public void setSymbolId(Long symbolId) {
        symbol = new Symbol();
        symbol.setId(symbolId);
    }

    public List<SymbolParameterValue> getParameterValues() {
        return parameterValues;
    }

    public void setParameterValues(List<SymbolParameterValue> parameterValues) {
        this.parameterValues = parameterValues;
    }

    public boolean isShouldFail() {
        return shouldFail;
    }

    public void setShouldFail(boolean shouldFail) {
        this.shouldFail = shouldFail;
    }

    public String getExpectedResult() {
        return expectedResult;
    }

    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult == null ? "" : expectedResult;
    }
}
