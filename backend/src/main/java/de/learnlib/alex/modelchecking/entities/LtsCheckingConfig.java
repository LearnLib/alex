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

package de.learnlib.alex.modelchecking.entities;

import java.util.List;

public class LtsCheckingConfig {

    private Long learnerResultId;

    private int stepNo;

    private List<Long> formulaIds;

    private int minUnfolds;

    private double multiplier;

    public Long getLearnerResultId() {
        return learnerResultId;
    }

    public void setLearnerResultId(Long learnerResultId) {
        this.learnerResultId = learnerResultId;
    }

    public int getStepNo() {
        return stepNo;
    }

    public void setStepNo(int stepNo) {
        this.stepNo = stepNo;
    }

    public List<Long> getFormulaIds() {
        return formulaIds;
    }

    public void setFormulaIds(List<Long> formulaIds) {
        this.formulaIds = formulaIds;
    }

    public int getMinUnfolds() {
        return minUnfolds;
    }

    public void setMinUnfolds(int minUnfolds) {
        this.minUnfolds = minUnfolds;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }
}
