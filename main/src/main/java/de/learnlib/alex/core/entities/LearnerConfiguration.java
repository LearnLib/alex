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

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;

import java.io.Serializable;

public abstract class LearnerConfiguration implements Serializable {

    private static final long serialVersionUID = 5863521579527593558L;

    /** The ID of the user related to the configuration. */
    @JsonProperty("user")
    protected Long userId;

    /** The ID of the project related to the configuration. */
    @JsonProperty("project")
    protected Long projectId;

    /** The type of EQ oracle to find a counter example. */
    protected AbstractEquivalenceOracleProxy eqOracle;

    /**
     * How many steps should the learner take before stopping the process.
     * Must be greater or equal to -1, but not 0.
     * -1 := Do not stop until no counterexample is found.
     */
    protected int maxAmountOfStepsToLearn;

    public abstract void checkConfiguration() throws IllegalArgumentException;

    /**
     * Check if the configuration is valid, i.e. it is possible to create a test based on the given data.
     *
     * @throws IllegalArgumentException If the configuration is invalid.
     */
    protected void check() throws IllegalArgumentException {
        if (maxAmountOfStepsToLearn < -1) {
            throw new IllegalArgumentException("The MaxAmountOfStep property must not be less than -1.");
        } else if (maxAmountOfStepsToLearn == 0) {
            throw new IllegalArgumentException("The MaxAmountOfStep property must not be equal to 0.");
        } else if (eqOracle == null) {
            throw new IllegalArgumentException("Could not find an EQ oracle.");
        }
        eqOracle.checkParameters();
    }

    /** Constructor. */
    public LearnerConfiguration() {
        this.eqOracle = new MealyRandomWordsEQOracleProxy();
        this.maxAmountOfStepsToLearn = -1;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    public int getMaxAmountOfStepsToLearn() {
        return maxAmountOfStepsToLearn;
    }

    public void setMaxAmountOfStepsToLearn(int maxAmountOfStepsToLearn) {
        this.maxAmountOfStepsToLearn = maxAmountOfStepsToLearn;
    }
}
