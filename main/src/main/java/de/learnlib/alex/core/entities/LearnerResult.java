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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.core.entities.learnlibproxies.AlphabetProxy;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import net.automatalib.automata.transout.MealyMachine;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Entity class to store the result of a test run, i.e. the outcome of a learn iteration and must not be the final
 * result.
 * The result contains the configuration of the learning process, the resulting hypothesis and some meta data
 * (duration, #EQ, ...).
 */
@Entity
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "project_id", "testNo"})
)
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerResult implements Serializable {

    private static final long serialVersionUID = 4619722174562257862L;

    /** The id of the LearnerResult in the DB. */
    private Long id;

    /** The user of the LearnerResult. */
    private User user;

    /** The reference to the Project the test run belongs to. */
    private Project project;

    /** The test no. within a Project which lead to the result. */
    private Long testNo;

    /** The steps of the LearnerResult. */
    private List<LearnerResultStep> steps;

    /** The reset symbol to use during the learning. */
    private Symbol resetSymbol;

    /** The symbols to use during the learning. */
    private Set<Symbol> symbols;

    /** The Alphabet used while learning. */
    private AlphabetProxy sigma;

    /** The {@link AbstractLearningAlgorithm} to use during the learning. */
    @Cascade(CascadeType.ALL)
    private AbstractLearningAlgorithm<String, String> algorithm;

    /** The browser to use during the learning. */
    private BrowserConfig browser;

    /** A comment to describe the intention / setting of the learn process.
     *  This field is optional. */
    private String comment;

    /** The hypothesis of the result. */
    private CompactMealyMachineProxy hypothesis;

    /** The statistics of the result. */
    private Statistics statistics;

    /**
     * If this field is set some sort of error occurred during the learning.
     * In this case this field stores more information about the error.
     * All other field can still have data, that are valid to some extend and should only be used carefully.
     */
    private String errorText;

    /** If membership queries should be cached. */
    private boolean useMQCache;

    /**
     * Default constructor.
     */
    public LearnerResult() {
        this.symbols = new HashSet<>();
        this.steps = new LinkedList<>();
        this.browser = new BrowserConfig();
        this.comment = "";
        this.statistics = new Statistics();
        this.useMQCache = true;
    }

    /**
     * Get the ID of the result used in the DB.
     *
     * @return The ID of teh result.
     */
    @Id
    @GeneratedValue
    @JsonIgnore
    public Long getId() {
        return id;
    }

    /**
     * Set a new ID for the result in the DB.
     *
     * @param id
     *         The new ID for the result.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return Get the user of the result.
     */
    @ManyToOne(optional = false)
    @JsonIgnore
    public User getUser() {
        return user;
    }

    /**
     * @param user Set a new user for the result.
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * @return Get the ID of the user related to the result.
     */
    @Transient
    @JsonProperty("user")
    public Long getUserId() {
        if (user == null) {
            return 0L;
        }

        return user.getId();
    }

    /**
     * Get the project the result belongs to.
     *
     * @return The connected Project.
     */
    @ManyToOne(optional = false)
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    /**
     * Set a new reference to a Project the result belongs to.
     *
     * @param project
     *         The new Project the result is connected with.
     */
    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the ID of the Project the result belongs to.
     *
     * @return The id of the Project related to the result.
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        if (project == null) {
            return 0L;
        } else {
            return project.getId();
        }
    }

    /**
     * Get the no. of the test run the result took place in.
     *
     * @return The no. of the related test run.
     */
    @Column(nullable = false)
    public Long getTestNo() {
        return testNo;
    }

    /**
     * Set a new no. of the test run the result belongs to.
     *
     * @param testNo
     *         The new no. of the test run.
     */
    public void setTestNo(Long testNo) {
        this.testNo = testNo;
    }

    /**
     * @return Get the steps of the result.
     */
    @OneToMany(
            mappedBy = "result",
            orphanRemoval = true
    )
    @OrderBy("stepNo ASC")
    public List<LearnerResultStep> getSteps() {
        return steps;
    }

    /**
     * @param steps The new list of steps for the result.
     */
    public void setSteps(List<LearnerResultStep> steps) {
        this.steps = steps;
    }

    /**
     * @return The reset symbol used during the learning.
     */
    @ManyToOne
    @JsonIgnore
    public Symbol getResetSymbol() {
        return resetSymbol;
    }

    /**
     * @param resetSymbol The new reset symbol to use during the learning.
     */
    public void setResetSymbol(Symbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    /**
     * Return the reset symbol as ID and revision pair for the JSON output.
     *
     * @return The ID of the reset symbol.
     */
    @Transient
    @JsonProperty("resetSymbol")
    public Long getResetSymbolAsId() {
        if (resetSymbol == null) {
            return null;
        } else {
            return resetSymbol.getId();
        }
    }

    /**
     * @return Get the symbols used during the learning.
     */
    @ManyToMany
    @JsonIgnore
    public Set<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * @param symbols The new set of symbols used during the learning.
     */
    public void setSymbols(Set<Symbol> symbols) {
        this.symbols = symbols;
    }

    /**
     * Return the set of symbol as List of ID and revision pairs for the JSON output.
     *
     * @return The IDs of the symbols.
     */
    @Transient
    @JsonProperty("symbols")
    public List<Long> getSymbolsAsIds() {
        List<Long> ids = new LinkedList<>();
        symbols.stream().map(Symbol::getId).forEach(ids::add);
        return ids;
    }

    /**
     * Get the Alphabet used during the learning process. This Alphabet is also used in the hypothesis.
     *
     * @return The Alphabet of the learning process & the hypothesis.
     */
    @Column(name = "sigma", columnDefinition = "BLOB")
    @JsonProperty("sigma")
    public AlphabetProxy getSigma() {
        return sigma;
    }

    /**
     * Set a new Alphabet. The Alphabet should be the one used during the learning and must be used in the hypothesis.
     *
     * @param sigma
     *         The new Alphabet.
     */
    @JsonIgnore
    public void setSigma(AlphabetProxy sigma) {
        this.sigma = sigma;
    }

    /**
     * @return The algorithm to use during the learning.
     */
    public AbstractLearningAlgorithm<String, String> getAlgorithm() {
        return algorithm;
    }

    /**
     * @param algorithm The new algorithm to use during the learning.
     */
    public void setAlgorithm(AbstractLearningAlgorithm<String, String> algorithm) {
        this.algorithm = algorithm;
    }

    /**
     * @return The browser to use during the learning.
     */
    @Embedded
    public BrowserConfig getBrowser() {
        return browser;
    }

    /**
     * @param browser The new browser to use during the learning.
     */
    public void setBrowser(BrowserConfig browser) {
        this.browser = browser;
    }

    /**
     * @return The comment to describe the result. Can be empty.
     */
    public String getComment() {
        return comment;
    }

    /**
     * @param comment The new comment to describe the result. Can be empty.
     */
    public void setComment(String comment) {
        this.comment = comment;
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
        this.hypothesis = CompactMealyMachineProxy.createFrom(mealyMachine, sigma.createAlphabet());
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
     * Set an error text as part of the learning result.
     * If a error text is set, it also implies that something during the learning went wrong and
     * {@link #isError()} will return True.
     *
     * @param errorText
     *         The new error text.
     */
    public void setErrorText(String errorText) {
        this.errorText = errorText;
    }

    /**
     * Did some kind of error occurred during the learning, i.e. the error text property is set.
     *
     * @return true if the result represents a failed learning process; null otherwise.
     */
    @Transient
    @JsonProperty("error")
    public Boolean isError() {
        if (errorText == null) {
            return null; // null instead of false, so that it will not appear in the JSON
        } else {
            return Boolean.TRUE;
        }
    }

    /** @return {@link LearnerResult#useMQCache}. */
    public boolean isUseMQCache() {
        return useMQCache;
    }

    /** @param useMQCache {@link LearnerResult#useMQCache}. */
    public void setUseMQCache(boolean useMQCache) {
        this.useMQCache = useMQCache;
    }

    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LearnerResult result = (LearnerResult) o;
        return Objects.equals(id, result.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "[LearnerResult " + id + "] " + getUserId() + " / " +  getProjectId() + " / " + testNo + " / "
                + ": " + sigma + ", " + hypothesis;
    }

}
