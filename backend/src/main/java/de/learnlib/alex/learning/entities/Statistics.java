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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.common.Constants;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Transient;

/** Embeddable statistics object that contains statistics related to a learning experiment. */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class Statistics implements Serializable {

    private static final long serialVersionUID = -5221139436025380739L;

    /** Sub Statistics class to store information by Learner and EqOracle. */
    @Embeddable
    public static class DetailedStatistics implements Serializable {

        private static final long serialVersionUID = -2601019208764457063L;

        /** Data of the Learner. */
        private long learner;

        /** Data of the EqOracle. */
        private long eqOracle;

        /** Constructor. */
        public DetailedStatistics() {
            this(0L, 0L);
        }

        /**
         * @param learner
         *         Data of the Learner.
         * @param eqOracle
         *         Data of the EqOracle.
         */
        public DetailedStatistics(long learner, long eqOracle) {
            this.learner = learner;
            this.eqOracle = eqOracle;
        }

        /**
         * @return The total data, i.e. Learner data + EqOracle data.
         */
        @Transient
        @JsonProperty("total")
        public long getTotal() {
            return learner + eqOracle;
        }

        @JsonProperty("learner")
        public long getLearner() {
            return learner;
        }

        public void setLearner(long learner) {
            this.learner = learner;
        }

        @JsonProperty("eqOracle")
        public long getEqOracle() {
            return eqOracle;
        }

        public void setEqOracle(long eqOracle) {
            this.eqOracle = eqOracle;
        }

        /**
         * Increment the values of the Learner and EqOracle data by another DetailedStatistics.
         *
         * @param offset
         *         A DetailedStatistics with the values to add.
         */
        public void updateBy(DetailedStatistics offset) {
            this.learner += offset.learner;
            this.eqOracle += offset.eqOracle;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            DetailedStatistics that = (DetailedStatistics) o;
            return learner == that.learner && eqOracle == that.eqOracle;
        }

        @Override
        public int hashCode() {
            return Objects.hash(learner, eqOracle);
        }
    }

    /**
     * Date and Time when the learning step was started.
     * The format is conform with the ISO 8601 (JavaScript-Style).
     */
    @JsonIgnore
    private ZonedDateTime startDate;

    /** The amount of equivalence queries. */
    private long eqsUsed;

    /** The duration of the learn step. */
    private DetailedStatistics duration;

    /** The amount of membership queries/ SUL resets. */
    private DetailedStatistics mqsUsed;

    /** The amount of actual symbols called during the learning process. */
    private DetailedStatistics symbolsUsed;

    /**
     * Default constructor.
     */
    public Statistics() {
        this.startDate = ZonedDateTime.now();
        this.eqsUsed = 0L;
        this.duration = new DetailedStatistics();
        this.mqsUsed = new DetailedStatistics();
        this.symbolsUsed = new DetailedStatistics();
    }

    /**
     * Update the statistics by given values.
     *
     * @param statistics
     *         The statistics whose values should be used to update the statistics.
     */
    public void updateBy(Statistics statistics) {
        eqsUsed += statistics.eqsUsed;
        duration.updateBy(statistics.duration);
        mqsUsed.updateBy(statistics.mqsUsed);
        symbolsUsed.updateBy(statistics.symbolsUsed);
    }

    @JsonIgnore
    public ZonedDateTime getStartDate() {
        return startDate;
    }

    @JsonIgnore
    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    @Transient
    @JsonProperty("startDate")
    public String getStartDateAsString() {
        return startDate.format(Constants.DATE_TIME_FORMATTER);
    }

    @JsonProperty("startDate")
    public void setStartDateByString(String dateAsString) {
        this.startDate = ZonedDateTime.parse(dateAsString);
    }

    public long getEqsUsed() {
        return eqsUsed;
    }

    public void setEqsUsed(long eqsUsed) {
        this.eqsUsed = eqsUsed;
    }

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "learner", column = @Column(name = "duration_learner")),
            @AttributeOverride(name = "eqOracle", column = @Column(name = "duration_eqOracle"))
    })
    public DetailedStatistics getDuration() {
        return duration;
    }

    public void setDuration(DetailedStatistics duration) {
        this.duration = duration;
    }

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "learner", column = @Column(name = "mqs_learner")),
            @AttributeOverride(name = "eqOracle", column = @Column(name = "mqs_eqOracle"))
    })
    public DetailedStatistics getMqsUsed() {
        return mqsUsed;
    }

    public void setMqsUsed(DetailedStatistics mqsUsed) {
        this.mqsUsed = mqsUsed;
    }

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "learner", column = @Column(name = "symbolsUsed_learner")),
            @AttributeOverride(name = "eqOracle", column = @Column(name = "symbolsUsed_eqOracle"))
    })
    public DetailedStatistics getSymbolsUsed() {
        return symbolsUsed;
    }

    public void setSymbolsUsed(DetailedStatistics symbolsUsed) {
        this.symbolsUsed = symbolsUsed;
    }
}
