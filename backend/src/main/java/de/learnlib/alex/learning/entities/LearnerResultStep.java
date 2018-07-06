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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import net.automatalib.automata.transout.MealyMachine;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.Objects;

/**
 * Entity class to store the result of a test run, i.e. the outcome of a learn iteration and must not be the final
 * result. The result contains the configuration of the learning process, the resulting hypothesis and some meta data
 * (duration, #EQ, ...).
 */
@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"result_id", "stepNo"})
)
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerResultStep implements Serializable {

    private static final long serialVersionUID = -6932946318109366918L;

    /** The id of the LearnerResult in the DB. */
    private Long id;

    /** The result the step is part of. */
    private LearnerResult result;

    /** The step no. within a test run which lead to the result. */
    private Long stepNo;

    /** The type of EQ oracle to find a counter example. */
    private AbstractEquivalenceOracleProxy eqOracle;

    /** The amount of steps to learn without user interaction. */
    private int stepsToLearn;

    /** The hypothesis of the result. */
    private CompactMealyMachineProxy hypothesis;

    /** The statistics of the result. */
    private Statistics statistics;

    /** The last found counterexample. */
    private DefaultQueryProxy counterExample;

    /** This is an optional property and can contain things like the internal data structure. */
    private String algorithmInformation;

    /** The internal state of the learner. */
    private byte[] state;

    /**
     * If this field is set some sort of error occurred during the learning. In this case this field stores more
     * information about the error. All other field can still have data, that are valid to some extend and should only
     * be used carefully.
     */
    private String errorText;

    /**
     * Default constructor.
     */
    public LearnerResultStep() {
        this.statistics = new Statistics();
    }

    @Id
    @GeneratedValue
    @JsonIgnore
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return The current LearnResult of the step.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "result_id")
    @JsonIgnore
    public LearnerResult getResult() {
        return result;
    }

    /**
     * @param result
     *         The new LearnResult for the step.
     */
    public void setResult(LearnerResult result) {
        this.result = result;
    }

    /**
     * Get the step number of the result, i.e. the number of the result within the test run.
     *
     * @return The step no. of the result within the test run.
     */
    @Column(nullable = false)
    public Long getStepNo() {
        return stepNo;
    }

    /**
     * Set a new step number of the result, i.e. the number of the result within the test run.
     *
     * @param stepNo
     *         The new step no. of the result within the test run.
     */
    public void setStepNo(Long stepNo) {
        this.stepNo = stepNo;
    }

    /**
     * @return The current eq oracle strategy of the step.
     */
    @Column(columnDefinition = "BLOB")
    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    /**
     * @param eqOracle
     *         The new eq oracle strategy for the step.
     */
    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    /**
     * @return The max amount of steps to learn without user interaction.
     */
    @Min(-1)
    public int getStepsToLearn() {
        return stepsToLearn;
    }

    /**
     * @param stepsToLearn
     *         The new max amount of steps to learn without user interaction.
     */
    public void setStepsToLearn(int stepsToLearn) {
        this.stepsToLearn = stepsToLearn;
    }

    /**
     * The hypothesis (as proxy) which is one of the core information of the result.
     *
     * @return The hypothesis (as proxy) of the result.
     */
    @Embedded
    @JsonProperty("hypothesis")
    public CompactMealyMachineProxy getHypothesis() {
        return hypothesis;
    }

    /**
     * Set a new hypothesis (as proxy) for the result.
     *
     * @param hypothesis
     *         The new hypothesis (as proxy).
     */
    @JsonProperty("hypothesis")
    public void setHypothesis(CompactMealyMachineProxy hypothesis) {
        this.hypothesis = hypothesis;
    }

    /**
     * Set a new hypothesis (as proxy) for the result based on a MealyMachine from the LearnLib.
     *
     * @param mealyMachine
     *         The new hypothesis as MealyMachine from the LearnLib.
     */
    @Transient
    @JsonIgnore
    public void createHypothesisFrom(MealyMachine<?, String, ?, String> mealyMachine) {
        this.hypothesis = CompactMealyMachineProxy.createFrom(mealyMachine, result.getSigma().createAlphabet());
    }

    /**
     * Get the statistic of this learn step.
     *
     * @return The learning statistics.
     */
    @Embedded
    public Statistics getStatistics() {
        return statistics;
    }

    /**
     * Set a new statistics object for the learning result.
     *
     * @param statistics
     *         The new statistics.
     */
    public void setStatistics(Statistics statistics) {
        this.statistics = statistics;
    }

    /**
     * Get the latest counterexample that was found..
     *
     * @return The latest counterexample or null.
     */
    @Embedded
    @JsonIgnore
    public DefaultQueryProxy getCounterExample() {
        return counterExample;
    }

    /**
     * Set the latest counterexample new.
     *
     * @param counterExample
     *         The new counterexample.
     */
    public void setCounterExample(DefaultQueryProxy counterExample) {
        this.counterExample = counterExample;
    }

    /**
     * Get the latest counterexample as string.
     *
     * @return The last counterexample or an empty string.
     */
    @Transient
    @JsonProperty("counterExample")
    public String getCounterExampleAsString() {
        if (counterExample == null) {
            return "";
        } else {
            return counterExample.createDefaultProxy().toString();
        }
    }

    /**
     * Get more (internal) information about the algorithm used during the learning.
     *
     * @return More (internal) information of the algorithm as string.
     */
    @Column(columnDefinition = "MEDIUMTEXT")
    public String getAlgorithmInformation() {
        return algorithmInformation;
    }

    /**
     * Set the internal or other information about the algorithm.
     *
     * @param algorithmInformation
     *         The new information about the algorithm.
     */
    public void setAlgorithmInformation(String algorithmInformation) {
        this.algorithmInformation = algorithmInformation;
    }

    /**
     * Get the current error text of the learning process.
     *
     * @return The current error text (can be null).
     */
    @Column
    @JsonProperty("errorText")
    public String getErrorText() {
        return errorText;
    }

    /**
     * Did some kind of error occurred during the learning, i.e. the error text property is set.
     *
     * @return true if the result represents a failed learning process; null otherwise.
     */
    @Transient
    @JsonProperty("error")
    public boolean isError() {
        return errorText != null;
    }

    @Column(columnDefinition = "BLOB")
    public byte[] getState() {
        return state;
    }

    public void setState(byte[] state) {
        this.state = state;
    }

    /**
     * Set an error text as part of the learning result. If a error text is set, it also implies that something during
     * the learning went wrong and {@link #isError()} will return True.
     *
     * @param errorText
     *         The new error text.
     */
    public void setErrorText(String errorText) {
        this.errorText = errorText;
    }

    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LearnerResultStep step = (LearnerResultStep) o;
        return Objects.equals(id, step.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        Long testNo = 0L;
        if (result != null) {
            testNo = result.getTestNo();
        }

        return "[LearnerResultStep " + this.id + "] " + result + " / " + testNo + " / " + stepNo + ": " + hypothesis;
    }

}
