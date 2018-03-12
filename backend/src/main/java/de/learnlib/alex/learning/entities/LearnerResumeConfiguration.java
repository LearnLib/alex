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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Symbol;
import org.springframework.data.annotation.Transient;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity to hold the information needed to resume a learning process.
 */
public class LearnerResumeConfiguration extends AbstractLearnerConfiguration implements Serializable {

    private static final long serialVersionUID = 2713088191086667675L;

    /** The step number from where to continue. */
    @JsonProperty("stepNo")
    @NotNull
    private int stepNo;

    /** The ids of the symbols to add. */
    @JsonProperty("symbolsToAdd")
    @NotNull
    private List<Long> symbolsToAddAsIds;

    /** The ids of the symbols to add. */
    @JsonIgnore
    @Transient
    private List<Symbol> symbolsToAdd;

    /**
     * Constructor.
     */
    public LearnerResumeConfiguration() {
        super();
        this.symbolsToAddAsIds = new ArrayList<>();
        this.symbolsToAdd = new ArrayList<>();
    }

    @Override
    public void checkConfiguration() throws IllegalArgumentException {
        super.check();
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

    public List<Long> getSymbolsToAddAsIds() {
        return symbolsToAddAsIds;
    }

    public void setSymbolsToAddAsIds(List<Long> symbolsToAddAsIds) {
        this.symbolsToAddAsIds = symbolsToAddAsIds;
    }

    public List<Symbol> getSymbolsToAdd() {
        return symbolsToAdd;
    }

    public void setSymbolsToAdd(List<Symbol> symbolsToAdd) {
        this.symbolsToAdd = symbolsToAdd;
    }
}
