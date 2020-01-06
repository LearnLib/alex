/*
 * Copyright 2015 - 2020 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Entity to hold the information needed to resume a learning process.
 */
public class LearnerResumeConfiguration extends AbstractLearnerConfiguration implements Serializable {

    private static final long serialVersionUID = 2713088191086667675L;

    /** The test no from where to continue. */
    @NotNull
    private Long testNo;

    /** The step number from where to continue. */
    @NotNull
    @Min(0)
    private int stepNo;

    /** The ids of the symbols to add. */
    private List<ParameterizedSymbol> symbolsToAdd;

    /** Constructor. */
    public LearnerResumeConfiguration() {
        super();
        this.symbolsToAdd = new ArrayList<>();
    }

    @Override
    public void checkConfiguration() throws IllegalArgumentException {
        // one should be able to continue learning if the sample eq oracle is used without
        // having specified a counterexample if a new symbol is added.
        if (eqOracle instanceof SampleEQOracleProxy) {
            try {
                eqOracle.checkParameters();
            } catch (IllegalArgumentException e) { // counterexamples are empty
                if (symbolsToAdd.isEmpty()) {
                    throw new IllegalArgumentException("You haven't specified neither a counterexample nor a symbol to add.");
                }
            }
        } else {
            super.check();
        }

        if (stepNo <= 0) {
            throw new IllegalArgumentException("The step number may not be less than 1");
        }
    }

    public int getStepNo() {
        return stepNo;
    }

    public void setStepNo(int stepNo) {
        this.stepNo = stepNo;
    }

    public Long getTestNo() {
        return testNo;
    }

    public void setTestNo(Long testNo) {
        this.testNo = testNo;
    }

    public List<ParameterizedSymbol> getSymbolsToAdd() {
        return symbolsToAdd;
    }

    public void setSymbolsToAdd(List<ParameterizedSymbol> symbolsToAdd) {
        this.symbolsToAdd = symbolsToAdd;
    }

    @JsonIgnore
    public List<Long> getSymbolIds() {
        return symbolsToAdd.stream()
                .map(ps -> ps.getSymbol().getId())
                .collect(Collectors.toList());
    }
}
