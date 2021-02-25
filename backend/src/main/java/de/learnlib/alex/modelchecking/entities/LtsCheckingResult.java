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

package de.learnlib.alex.modelchecking.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.automatalib.words.Word;

import java.util.List;

/** The counterexample of a model check. */
public class LtsCheckingResult {

    /** The formula that has been checked. */
    private LtsFormula formula;

    /** The ID of the learner result. */
    private Long learnerResultId;

    /** Which hypothesis has been checked. */
    private Long learnerResultStepNo;

    /** The prefix of the counterexample. */
    private List<String> prefix;

    /** The loop part of the counterexample. */
    private List<String> loop;

    /** Constructor. */
    public LtsCheckingResult(LtsFormula formula, Long learnerResultId, Long learnerResultStepNo) {
        this(formula, learnerResultId, learnerResultStepNo, Word.epsilon(), Word.epsilon());
    }

    public LtsCheckingResult(LtsFormula formula, Long learnerResultId, Long learnerResultStepNo, Word<String> prefix, Word<String> loop) {
        this.formula = formula;
        this.learnerResultId = learnerResultId;
        this.learnerResultStepNo = learnerResultStepNo;
        this.prefix = prefix.asList();
        this.loop = loop.asList();
    }

    public List<String> getPrefix() {
        return prefix;
    }

    public void setPrefix(List<String> prefix) {
        this.prefix = prefix;
    }

    public List<String> getLoop() {
        return loop;
    }

    public void setLoop(List<String> loop) {
        this.loop = loop;
    }

    public LtsFormula getFormula() {
        return formula;
    }

    public void setFormula(LtsFormula formula) {
        this.formula = formula;
    }

    public Long getLearnerResultId() {
        return learnerResultId;
    }

    public void setLearnerResultId(Long learnerResultId) {
        this.learnerResultId = learnerResultId;
    }

    public Long getLearnerResultStepNo() {
        return learnerResultStepNo;
    }

    public void setLearnerResultStepNo(Long learnerResultStepNo) {
        this.learnerResultStepNo = learnerResultStepNo;
    }

    /**
     * Check if the model checker could find a counterexample.
     *
     * @return True if no counterexample could be found
     */
    @JsonProperty("passed")
    public boolean isPassed() {
        return this.prefix.isEmpty() && this.loop.isEmpty();
    }

}
