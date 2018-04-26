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
import de.learnlib.alex.data.entities.SymbolRepresentation;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import java.io.Serializable;

/** Wrapper for {@link de.learnlib.alex.data.entities.ExecuteResult} that allows persistence for tests. */
@Entity
public class TestExecuteResult extends ExecuteResult implements Serializable {

    private static final long serialVersionUID = -3528131025646284916L;

    /** The referenced test result. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "testResultUuid")
    @JsonIgnore
    private TestCaseResult result;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "symbolId")
    private Symbol symbol;

    /** Constructor. */
    public TestExecuteResult() {
        super();
    }

    /**
     * Constructor.
     *
     * @param result The output of the SUL.
     */
    public TestExecuteResult(ExecuteResult result) {
        super(result.isSuccess(), result.getOutput());
    }

    public TestCaseResult getResult() {
        return result;
    }

    public void setResult(TestCaseResult result) {
        this.result = result;
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    @Transient
    @JsonProperty("symbol")
    public SymbolRepresentation getSymbolRepresentation() {
        return new SymbolRepresentation(symbol);
    }
}
