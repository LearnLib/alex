package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.entities.learnlibproxies.AlphabetProxy;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.core.entities.learnlibproxies.DefaultQueryProxy;
import net.automatalib.automata.transout.MealyMachine;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.annotations.NaturalId;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * Entity class to store the result of a test run, i.e. the outcome of a learn iteration and must not be the final
 * result.
 * The result contains the configuration of the learning process, the resulting hypothesis and some meta data
 * (duration, #EQ, ...).
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerResult implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = 4619722174562257862L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** Standard DateTimeFormatter that will create a nice ISO 8160 string with milliseconds and a time zone. */
    public static final DateTimeFormatter DATE_TIME_FORMATTER
                                                        = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    /** A ZonedDateTime object based at the unix time 0. */
    public static final ZonedDateTime UNIX_TIME_START = ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00");

    /**
     * Embeddable statistics object to hold all the statistics together.
     */
    @Embeddable
    @JsonPropertyOrder(alphabetic = true)
    public static class Statistics implements Serializable {

        /** to be serializable. */
        private static final long serialVersionUID = -5221139436025380739L;

        /**
         * Date and Time when the learning step was started.
         * The format is conform with the ISO 8601 (JavaScript-Style).
         */
        @JsonIgnore
        private ZonedDateTime startDate;

        /**
         * The 'time' the test started in nanoseconds.
         * This is just internally user to calculate the duration and the Java value for the used 'nanoTime' has no
         * real world meaning.
         * */
        @JsonIgnore
        private long startTime;

        /** The duration of the learn step. */
        private long duration;

        /** The amount of equivalence queries. */
        private long eqsUsed;

        /** The amount of membership queries/ SUL resets. */
        private long mqsUsed;

        /** The amount of actual symbols called during the learning process. */
        private long symbolsUsed;

        /**
         * Default constructor.
         */
        public Statistics() {
            this.startDate = UNIX_TIME_START;
            this.startTime = 0;
            this.duration  = 0;
        }

        /**
         * Get the start time of the learn step.
         *
         * @return The start time.
         */
        public long getStartTime() {
            return startTime;
        }

        /**
         * Set the start time.
         *
         * @param startTime
         *          The time in ns
         */
        public void setStartTime(long startTime) {
            this.startTime = startTime;
        }

        /**
         * Get the date of when the test run started.
         *
         * @return The date
         */
        @JsonIgnore
        public ZonedDateTime getStartDate() {
            return startDate;
        }

        /**
         * Set the date when the test started.
         *
         * @param startDate
         *          The date object
         */
        @JsonIgnore
        public void setStartDate(ZonedDateTime startDate) {
            this.startDate = startDate;
        }

        /**
         * @return When the learning was started as nice ISO 8160 string, including milliseconds and zone.
         */
        @Transient
        @JsonProperty("startDate")
        public String getStartDateAsString() {
            return startDate.format(DATE_TIME_FORMATTER);
        }

        /**
         * @param dateAsString The point in time when the learning was started.
         */
        @JsonProperty("startDate")
        public void setStartDateByString(String dateAsString) {
            this.startDate = ZonedDateTime.parse(dateAsString);
        }

        /**
         * Get the duration the learn step took.
         *
         * @return The duration of the learn step.
         */
        public long getDuration() {
            return duration;
        }

        /**
         * Set how long the learn step took.
         *
         * @param duration
         *         The new duration.
         */
        public void setDuration(long duration) {
            this.duration = duration;
        }

        /**
         * Get the amount of equivalence oracles used during the learning.
         *
         * @return The amount of eq oracles.
         */
        public long getEqsUsed() {
            return eqsUsed;
        }

        /**
         * Set the amount of equivalence oracles used during the learning.
         *
         * @param eqsUsed
         *         The new amount of eq oracles.
         */
        public void setEqsUsed(long eqsUsed) {
            this.eqsUsed = eqsUsed;
        }

        /**
         * Get the amount of resets done while learning.
         *
         * @return The amount of resets during the learn step.
         */
        public long getMqsUsed() {
            return mqsUsed;
        }

        /**
         * Set the amount of resets done while learning.
         *
         * @param mqsUsed
         *         The amount of resets during the learn step.
         */
        public void setMqsUsed(long mqsUsed) {
            this.mqsUsed = mqsUsed;
        }

        /**
         * Get the total amount of symbols executed during the learning.
         *
         * @return The total amount of symbols used.
         */
        public long getSymbolsUsed() {
            return symbolsUsed;
        }

        /**
         * Set the total amount of symbols executed during the learning.
         *
         * @param symbolsUsed
         *         The new amount of symbols used during the learning.
         */
        public void setSymbolsUsed(long symbolsUsed) {
            this.symbolsUsed = symbolsUsed;
        }
    }

    /** The user of the LearnerResult. */
    private User user;

    /** The id of the LearnerResult in the DB. */
    private Long id;

    /** The reference to the Project the test run belongs to. */
    private Project project;

    /** The test no. within a Project which lead to the result. */
    private Long testNo;

    /** The step no. within a test run which lead to the result. */
    private Long stepNo;

    /** The LearnerConfiguration which was used to create the result. */
    private LearnerConfiguration configuration;

    /** The statistics of the result. */
    private Statistics statistics;

    /** The Alphabet used while learning. */
    private AlphabetProxy sigma;

    /** The hypothesis of the result. */
    private CompactMealyMachineProxy hypothesis;

    /** The last found counterexample. */
    private DefaultQueryProxy counterExample;

    /** This is an optional property and can contain things like the internal data structure. */
    private String algorithmInformation;

    /**
     * If this field is set some sort of error occurred during the learning.
     * In this case this field stores more information about the error.
     * All other field can still have data, that are valid to some extend and should only be used carefully.
     */
    private String errorText;

    /**
     * Default constructor.
     */
    public LearnerResult() {
        this.configuration = new LearnerConfiguration();
        this.statistics = new Statistics();
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
     * Get the project the result belongs to.
     *
     * @return The connected Project.
     */
    @NaturalId
    @ManyToOne
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
     * Set the related Project new by a project id.
     *
     * @param projectId
     *         The id of the new Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public void setUser(User user) {
        this.user = user;
    }

    @NaturalId
    @ManyToOne
    @JsonIgnore
    public User getUser() {
        return user;
    }

    @Transient
    @JsonProperty("user")
    public Long getUserId() {
        if (user == null) {
            return 0L;
        }

        return user.getId();
    }

    @JsonProperty("user")
    public void setUserId(Long userId) {
        user = new User(userId);
    }

    /**
     * Get the no. of the test run the result took place in.
     *
     * @return The no. of the related test run.
     */
    @NaturalId
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
     * Get the step number of the result, i.e. the number of the result within the test run.
     *
     * @return The step no. of the result within the test run.
     */
    @NaturalId
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
     * Get the LearnerConfiguration used to create the result.
     *
     * @return The LearnerConfiguration used during the learning which lead to the result.
     */
    @JsonProperty("configuration")
    @Embedded
    public LearnerConfiguration getConfiguration() {
        return configuration;
    }

    /**
     * Set the LearnerConfiguration used while learning which lead to the result.
     *
     * @param configuration
     *         The new LearnerConfiguration.
     */
    @JsonProperty("configuration")
    public void setConfiguration(LearnerConfiguration configuration) {
        this.configuration = configuration;
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
     * Get the Alphabet used during the learning process. This Alphabet is also used in the hypothesis.
     *
     * @return The Alphabet of the learning process & the hypothesis.
     */
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
     * Get the latest counterexample that was found..
     *
     * @return The latest counterexample or null.
     */
//    @Column
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
            return counterExample.toString();
        }
    }

    /**
     * Get more (internal) information about the algorithm used during the learning.
     *
     * @return More (internal) information of the algorithm as string.
     */
    @Column(columnDefinition = "CLOB")
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
    public Boolean isError() {
        if (errorText == null) {
            return null; // null instead of false, so that it will not appear in the JSON
        } else {
            return Boolean.TRUE;
        }
    }

    /**
     * Does nothing but prevents the JSON deserializer from throwing an error when the learner has an error that
     * results in the reset symbol and the symbols not being fetched.
     *
     * @param error - dummy
     */
    public void setError(Boolean error) {
        // do nothing :)
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

    //CHECKSTYLE.OFF: NeedBraces|OperatorWrap - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LearnerResult that = (LearnerResult) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(project, that.project) &&
                Objects.equals(testNo, that.testNo) &&
                Objects.equals(stepNo, that.stepNo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, project, testNo, stepNo);
    }
    //CHECKSTYLE.ON: NeedBraces|OperatorWrap

    @Override
    public String toString() {
        return "[LearnerResult " + id + "] " + getUserId() + " / " +  getProjectId() + " / " + testNo + " / "
                + stepNo + ": " + sigma + ", " + hypothesis;
    }

}
