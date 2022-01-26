/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Wrapper for {@link de.learnlib.alex.data.entities.ExecuteResult} that allows persistence for tests.
 */
@Entity
public class TestExecutionResult extends ExecuteResult implements Serializable {

    private static final long serialVersionUID = -3528131025646284916L;

    /**
     * The referenced test result.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "testResultId")
    @JsonIgnore
    private TestCaseResult result;

    /**
     * The symbols that produced the result.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "symbolId")
    private Symbol symbol;

    public TestExecutionResult() {
        super();
    }

    public TestExecutionResult(ExecuteResult result) {
        super(result.isSuccess(), result.getMessage(), result.getTrace(), result.getTime(), result.getTestScreenshot());
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
}
