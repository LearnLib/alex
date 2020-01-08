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
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;

import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** The abstract learner configuration. */
public abstract class AbstractLearnerConfiguration implements Serializable {

    private static final long serialVersionUID = 5863521579527593558L;

    /** The ids of the URLs to use for learning. */
    @NotEmpty
    protected List<ProjectEnvironment> environments;

    /** The type of EQ oracle to find a counter example. */
    @NotNull
    protected AbstractEquivalenceOracleProxy eqOracle;

    /**
     * Checks if the configuration is correct.
     *
     * @throws IllegalArgumentException
     *         If the configuration is not valid.
     */
    public abstract void checkConfiguration() throws IllegalArgumentException;

    /**
     * Check if the configuration is valid, i.e. it is possible to create a test based on the given data.
     *
     * @throws IllegalArgumentException
     *         If the configuration is invalid.
     */
    protected void check() throws IllegalArgumentException {
        if (eqOracle == null) {
            throw new IllegalArgumentException("Could not find an EQ oracle.");
        } else if (environments.isEmpty()) {
            throw new IllegalArgumentException("At least one environment is required.");
        }
        eqOracle.checkParameters();
    }

    /** Constructor. */
    public AbstractLearnerConfiguration() {
        this.eqOracle = new MealyRandomWordsEQOracleProxy();
        this.environments = new ArrayList<>();
    }

    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    public List<ProjectEnvironment> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<ProjectEnvironment> environments) {
        this.environments = environments;
    }

    @Transient
    @JsonIgnore
    public List<Long> getEnvironmentIds() {
        return environments.stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList());
    }

    @JsonProperty("environments")
    public void setEnvironmentIds(List<Long> environmentIds) {
        this.environments = environmentIds.stream()
                .map(id -> {
                    final ProjectEnvironment env = new ProjectEnvironment();
                    env.setId(id);
                    return env;
                })
                .collect(Collectors.toList());
    }
}
