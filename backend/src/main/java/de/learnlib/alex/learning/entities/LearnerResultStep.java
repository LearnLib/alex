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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.alex.modelchecking.entities.ModelCheckingResult;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

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
     * information about the error. All other field can still have data, that are valid to some extent and should only
     * be used carefully.
     */
    private String errorText;

    private List<ModelCheckingResult> modelCheckingResults;

    /**
     * Default constructor.
     */
    public LearnerResultStep() {
        this.statistics = new Statistics();
        this.modelCheckingResults = new ArrayList<>();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "result_id")
    public LearnerResult getResult() {
        return result;
    }

    @JsonProperty("result")
    @Transient
    public Long getResultId() {
        return this.result == null ? null : this.result.getId();
    }

    @JsonProperty("result")
    @Transient
    public void setResultId(Long resultId) {
        this.result = new LearnerResult();
        this.result.setId(resultId);
    }

    public void setResult(LearnerResult result) {
        this.result = result;
    }

    @Column(nullable = false)
    public Long getStepNo() {
        return stepNo;
    }

    public void setStepNo(Long stepNo) {
        this.stepNo = stepNo;
    }

    @Column(columnDefinition = "BYTEA")
    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    @Embedded
    @JsonProperty("hypothesis")
    public CompactMealyMachineProxy getHypothesis() {
        return hypothesis;
    }

    @JsonProperty("hypothesis")
    public void setHypothesis(CompactMealyMachineProxy hypothesis) {
        this.hypothesis = hypothesis;
    }

    @Embedded
    public Statistics getStatistics() {
        return statistics;
    }

    public void setStatistics(Statistics statistics) {
        this.statistics = statistics;
    }

    @Embedded
    public DefaultQueryProxy getCounterExample() {
        return counterExample;
    }

    public void setCounterExample(DefaultQueryProxy counterExample) {
        this.counterExample = counterExample;
    }

    @Column(columnDefinition = "TEXT")
    public String getAlgorithmInformation() {
        return algorithmInformation;
    }

    public void setAlgorithmInformation(String algorithmInformation) {
        this.algorithmInformation = algorithmInformation;
    }

    @Column
    @JsonProperty("errorText")
    public String getErrorText() {
        return errorText;
    }

    @Transient
    @JsonProperty("error")
    public boolean isError() {
        return errorText != null;
    }

    @Column(columnDefinition = "BYTEA")
    @JsonIgnore
    public byte[] getState() {
        return state;
    }

    @JsonIgnore
    public void setState(byte[] state) {
        this.state = state;
    }

    public void setErrorText(String errorText) {
        this.errorText = errorText;
    }

    @OneToMany(
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    public List<ModelCheckingResult> getModelCheckingResults() {
        return modelCheckingResults;
    }

    public void setModelCheckingResults(List<ModelCheckingResult> modelCheckingResults) {
        this.modelCheckingResults = modelCheckingResults;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
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
