package de.learnlib.weblearner.entities;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.learnlibproxies.CompactMealyMachineProxy;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import java.io.IOException;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Entity class to store the result of a test run, i.e. the outcome of a learn iteration and must not be the final
 * result.
 * The result contains the configuration of the learning process, the resulting hypothesis and some meta data
 * (duration, #EQ, ...).
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class LearnerResult implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = 4619722174562257862L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The id of the LearnerResult in the DB. */
    private long id;

    /** The reference to the Project the test run belongs to. */
    private Project project;

    /** The test no. within a Project which lead to the result. */
    private long testNo;

    /** The step no. within a test run which lead to the result. */
    private long stepNo;

    /** Buffer for the JSON which represents the result. */
    private String json;

    /** Internal helper field to determine if the json needs to be recalculated. */
    @JsonIgnore
    private boolean jsonChanged;

    /** The LearnerConfiguration which was used to create the result. */
    private LearnerConfiguration configuration;

    /** The type of the symbols used for the learning. */
    private SymbolTypes type;

    /** Date and Time when the learning step was started. The format is conform with the ISO 8601 (JavaScript-Style). */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS+00:00", timezone = "UTC")
    private Date startTime;

    /** The duration of the learn step. */
    private long duration;

    /** The amount of SUL resets if available. Otherwise -1. */
    private int amountOfResets;

    /** The Alphabet used while learning. */
    private Alphabet<String> sigma;

    /** The hypothesis of the result. */
    private CompactMealyMachineProxy hypothesis;

    /**
     * Default constructor.
     */
    public LearnerResult() {
        this.configuration = new LearnerConfiguration();
        this.jsonChanged = true;
        this.startTime = new Date(0);
    }

    /**
     * Get the ID of the result used in the DB.
     *
     * @return The ID of teh result.
     */
    @Id
    @GeneratedValue
    @JsonIgnore
    public long getId() {
        return id;
    }

    /**
     * Set a new ID for the result in the DB.
     *
     * @param id
     *         The new ID for the result.
     */
    public void setId(long id) {
        this.id = id;
        this.jsonChanged = true;
    }

    /**
     * Get the project the result belongs to.
     *
     * @return The connected Project.
     */
    @ManyToOne
    //@JoinColumn(name = "projectId")
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
        this.jsonChanged = true;
    }

    /**
     * Get the ID of the Project the result belongs to.
     *
     * @return The id of the Project related to the result.
     */
    @Transient
    @JsonProperty("project")
    public long getProjectId() {
        if (project == null) {
            return 0;
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
    public void setProjectId(long projectId) {
        this.project = new Project(projectId);
        this.jsonChanged = true;
    }

    /**
     * Get the no. of the test run the result took place in.
     *
     * @return The no. of the related test run.
     */
    public long getTestNo() {
        return testNo;
    }

    /**
     * Set a new no. of the test run the result belongs to.
     *
     * @param testNo
     *         The new no. of the test run.
     */
    public void setTestNo(long testNo) {
        this.testNo = testNo;
        this.jsonChanged = true;
    }

    /**
     * Get the step number of the result, i.e. the number of the result within the test run.
     *
     * @return The step no. of the result within the test run.
     */
    public long getStepNo() {
        return stepNo;
    }

    /**
     * Set a new step number of the result, i.e. the number of the result within the test run.
     *
     * @param stepNo
     *         The new step no. of the result within the test run.
     */
    public void setStepNo(long stepNo) {
        this.stepNo = stepNo;
        this.jsonChanged = true;
    }

    /**
     * Get the LearnerConfiguration used to create the result.
     *
     * @return The LearnerConfiguration used during the learning which lead to the result.
     */
    @JsonProperty("configuration")
    @Transient
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
        this.jsonChanged = true;
    }

    /**
     * Get the type of the symbols used while learning.
     *
     * @return The 'type*' of the learning process.
     */
    public SymbolTypes getType() {
        return type;
    }

    /**
     * Set the type of the symbols used while learning.
     *
     * @param type
     *         The new 'type' of the learning process.
     */
    public void setType(SymbolTypes type) {
        this.type = type;
        this.jsonChanged = true;
    }

    /**
     * Get the start time of the learn step.
     *
     * @return The start time.
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * Set the start time of the learn step.
     *
     * @param startTime
     *         The new start time.
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
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
     * Get the amount of resets done while learning.
     *
     * @return The amount of resets during the learn step.
     */
    public int getAmountOfResets() {
        return amountOfResets;
    }

    /**
     * Set the amount of resets done while learning.
     *
     * @param amountOfResets
     *         The amount of resets during the learn step.
     */
    public void setAmountOfResets(int amountOfResets) {
        this.amountOfResets = amountOfResets;
    }

    /**
     * Get the Alphabet used during the learning process. This Alphabet is also used in the hypothesis.
     *
     * @return The Alphabet of the learning process & the hypothesis.
     */
    @Transient
    @JsonProperty("sigma")
    public Alphabet<String> getSigma() {
        return sigma;
    }

    /**
     * Set a new Alphabet. The Alphabet should be the one used during the learning and must be used in the hypothesis.
     *
     * @param sigma
     *         The new Alphabet.
     */
    @JsonIgnore
    public void setSigma(Alphabet<String> sigma) {
        this.sigma = sigma;
        this.jsonChanged = true;
    }

    /**
     * Create and set the Alphabet used during learning and used in the hypotheses through a List of String.
     *
     * @param sigmaAsList
     *         The Alphabet encoded as List of String.
     */
    @JsonProperty("sigma")
    public void createSigmaFrom(List<String> sigmaAsList) {
        this.sigma = new SimpleAlphabet<>();

        for (String s : sigmaAsList) {
            this.sigma.add(s);
        }

        this.jsonChanged = true;
    }

    /**
     * The hypothesis (as proxy) which is one of the core information of the result.
     *
     * @return The hypothesis (as proxy) of the result.
     */
    @Transient
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
        this.jsonChanged = true;
    }

    /**
     * Set a new hypothesis (as proxy) for the result based on a MealyMachine from the LearnLib.
     *
     * @param mealyMachine
     *         The new hypothesis as MealyMachine from the LearnLib.
     */
    public void createHypothesisFrom(MealyMachine<?, String, ?, String> mealyMachine) {
        this.hypothesis = CompactMealyMachineProxy.createFrom(mealyMachine, sigma);
        this.jsonChanged = true;
    }

    /**
     * Get the result as JSON.
     * This method buffers the generated JSON.
     *
     * @return The result encoded as JSON data.
     */
    @Column(length = Integer.MAX_VALUE)
    @JsonIgnore
    public String getJSON() {
        if (jsonChanged) {
            this.json = generateJSON();
            this.jsonChanged = false;
        }

        return json;
    }

    /**
     * Generate the JSON of this object.
     *
     * @return This Object encoded as JSON.
     */
    private String generateJSON() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            json = objectMapper.writeValueAsString(this);
            return json;
        } catch (JsonProcessingException e) {
            LOGGER.warn("could not generate the JSON for the result '" + this.toString() + "'.", e);
            return "{}";
        }
    }

    /**
     * Set the result via JSON. This method will not only remember the JSON as String but will also parse the JSON and
     * set all other field according to the JSON data!
     *
     * @param json
     *         The new result encoded in JSON data.
     */
    @JsonIgnore
    public void setJSON(String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            LearnerResult newResult = objectMapper.readValue(json, LearnerResult.class);
            setProject(newResult.getProject());
            setTestNo(newResult.getTestNo());
            setStepNo(newResult.getStepNo());
            setType(newResult.type);
            setStartTime(newResult.startTime);
            setDuration(newResult.duration);
            setAmountOfResets(newResult.amountOfResets);
            setConfiguration(newResult.getConfiguration());
            setSigma(newResult.getSigma());
            setHypothesis(newResult.getHypothesis());

            this.json = json;
            this.jsonChanged = false;
        } catch (IOException e) {
            LOGGER.info("could not read the JSON '" + json + "' for a LearnerResult.", e);
        }
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LearnerResult result = (LearnerResult) o;

        if (stepNo != result.stepNo) return false;
        if (testNo != result.testNo) return false;
        if (project != null ? !project.equals(result.project) : result.project != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = project != null ? project.hashCode() : 0;
        result = 31 * result + (int) (testNo ^ (testNo >>> 32));
        result = 31 * result + (int) (stepNo ^ (stepNo >>> 32));
        return result;
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber|NeedBraces

    @Override
    public String toString() {
        return "[LearnerResult " + id + "] " + getProjectId() + " / " + testNo + " / " + stepNo + ": "
                + sigma + ", " + hypothesis;
    }

}
