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

package de.learnlib.alex.modelchecking.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.ValidationException;

/** Configuration object for checking lts properties on a learned model. */
public class LtsCheckingConfig {

    /** The test number of the learner result. */
    private Long learnerResultId;

    /** The step number in the result. */
    private Integer stepNo;

    /** The formulas to check. */
    private List<LtsFormula> formulas;

    /** The IDs of the formulas to check. */
    private List<Long> formulaIds;

    /** How many unfolds are used for checking. */
    private Integer minUnfolds;

    /** The multiplier > 0. */
    private Double multiplier;

    /** Constructor. */
    public LtsCheckingConfig() {
        this.formulas = new ArrayList<>();
        this.formulaIds = new ArrayList<>();
        this.minUnfolds = 0;
        this.multiplier = 1.0;
    }

    public Long getLearnerResultId() {
        return learnerResultId;
    }

    public void setLearnerResultId(Long learnerResultId) {
        this.learnerResultId = learnerResultId;
    }

    public Integer getStepNo() {
        return stepNo;
    }

    public void setStepNo(Integer stepNo) {
        this.stepNo = stepNo;
    }

    public List<LtsFormula> getFormulas() {
        return formulas;
    }

    public void setFormulas(List<LtsFormula> formulas) {
        this.formulas = Optional.ofNullable(formulas).orElse(new ArrayList<>());
    }

    public Integer getMinUnfolds() {
        return minUnfolds;
    }

    public void setMinUnfolds(Integer minUnfolds) {
        this.minUnfolds = minUnfolds;
    }

    public Double getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(Double multiplier) {
        this.multiplier = multiplier;
    }

    public List<Long> getFormulaIds() {
        return formulaIds;
    }

    public void setFormulaIds(List<Long> formulaIds) {
        this.formulaIds = Optional.ofNullable(formulaIds).orElse(new ArrayList<>());
    }

    /**
     * Validate the config.
     *
     * @throws ValidationException
     *         If the config is not valid.
     */
    public void validate() throws ValidationException {
        if (learnerResultId == null || learnerResultId < 0) {
            throw new ValidationException("The ID of the learner result has to be > 0.");
        } else if (stepNo == null || stepNo < 1) {
            throw new ValidationException("The step number has to be > 0.");
        } else if (formulas.size() + formulaIds.size() == 0) {
            throw new ValidationException("There has to be at least one formula.");
        } else if (minUnfolds < 0) {
            throw new ValidationException("minUnfolds has to be >= 0.");
        } else if (multiplier <= 0.0) {
            throw new ValidationException("multiplier has to be > 0.0");
        }
    }

}
