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

import javax.persistence.Transient;

/**
 * Entity to hold the information needed to resume a learning process.
 */
public class LearnerResumeConfiguration {

    /** The ID of the user related to the configuration. */
    private Long userId;

    /** The ID of the project related to the configuration. */
    private Long projectId;

    /**
     * The type of EQ oracle to find a counter example.
     * @requiredField
     */
    protected AbstractEquivalenceOracleProxy eqOracle;

    /**
     * @return The ID of the user related to the configuration.
     */
    @JsonProperty("user")
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId The new ID of the user related to the configuration.
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * @return The ID of the project related to the configuration.
     */
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * @param projectId The new ID of the project related to the configuration.
     */
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    /** How many steps should the learner take before stopping the process.
     * Must be greater or equal to -1, but not 0.
     * -1 := Do not stop until no counter example is found. */
    protected int maxAmountOfStepsToLearn;

    /**
     * Default constructor.
     */
    public LearnerResumeConfiguration() {
        this.eqOracle = new MealyRandomWordsEQOracleProxy();
        this.maxAmountOfStepsToLearn = -1; // infinity
    }

    /**
     * Get the EQ oracle (as proxy) to be used during the learning process.
     * @return The selected EQ oracle (as proxy).
     */
    @Transient
    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    /**
     * Set a new EQ oracle (as proxy) to be used during the learning.
     * @param eqOracle The new EQ oracle (as proxy).
     */
    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    /**
     * Get the amount of steps the learner should do before it stops learning.
     * The value 0 indicates no upper boundary.
     *
     * @return The max amount of steps to learn.
     */
    public int getMaxAmountOfStepsToLearn() {
        return maxAmountOfStepsToLearn;
    }

    /**
     * Set a new max amount of steps to learn.
     *
     * @param maxAmountOfStepsToLearn
     *         The new amount of steps to learn. It must be greater or equals to 0, where 0 indicates no boundary.
     */
    public void setMaxAmountOfStepsToLearn(int maxAmountOfStepsToLearn) {
        this.maxAmountOfStepsToLearn = maxAmountOfStepsToLearn;
    }

    /**
     * Check if the configuration is valid, i.e. it is possible to create a test based on the given data.
     *
     * @throws IllegalArgumentException
     *         If the configuration is invalid.
     */
    public void checkConfiguration() throws IllegalArgumentException {
        if (maxAmountOfStepsToLearn < -1) {
            throw new IllegalArgumentException("The MaxAmountOfStep property must not be less than -1.");
        } else if (maxAmountOfStepsToLearn == 0) {
            throw new IllegalArgumentException("The MaxAmountOfStep property must not be equal to 0.");
        }

        if (eqOracle == null) {
            throw new IllegalArgumentException("Could not find an EQ oracle.");
        }
        eqOracle.checkParameters();
    }

}
