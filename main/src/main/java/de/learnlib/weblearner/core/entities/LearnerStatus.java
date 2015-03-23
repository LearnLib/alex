package de.learnlib.weblearner.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.weblearner.core.learner.Learner;

/**
 * Class to provide information about the current learn process.
 */
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerStatus {

    /** The learn process to observe. */
    @JsonIgnore
    private final Learner learner;

    /**
     * Constructor.
     *
     * @param learner The learner to get the information from.
     */
    public LearnerStatus(Learner learner) {
        this.learner = learner;
    }

    /**
     * Get the learner which is observed.
     *
     * @return The current learner.
     */
    @JsonIgnore
    public Learner getLearner() {
        return learner;
    }

    /**
     * Is the learn process active?
     *
     * @return true if the learn process is active; false otherwise
     */
    @JsonProperty
    public boolean isActive() {
        return learner.isActive();
    }

    /**
     * The project id of the currently active project.
     * Only included if the learner is active.
     *
     * @return The active project id.
     */
    @JsonProperty("project")
    public Long getProjectId() {
        if (isActive()) {
            LearnerResult result = learner.getResult();
            if (result == null) {
                return 0L;
            }
            return result.getProjectId();
        } else {
            return null;
        }
    }

    /**
     * The test no in the active project of the currently active learn process.
     * Only included if the learner is active.
     *
     * @return The active test no in the project.
     */
    @JsonProperty
    public Long getTestNo() {
        if (isActive()) {
            LearnerResult result = learner.getResult();
            if (result == null) {
                return 0L;
            }
            return result.getTestNo();
        } else {
            return null;
        }
    }

}
