package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.Learner;

import java.util.Date;

/**
 * Class to provide information about the current learn process.
 */
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerStatus {

    @JsonIgnore
    private final User user;

    /**
     * The learn process to observe.
     */
    @JsonIgnore
    private final Learner learner;

    /**
     * Statistics Class for the learner status.
     */
    @JsonPropertyOrder(alphabetic = true)
    private class LearnerStatusStatistics {

        private Date startDate;

        private Long mqsUsed;

        public LearnerStatusStatistics(Date startDate, Long mqsUsed) {
            this.startDate = startDate;
            this.mqsUsed = mqsUsed;
        }

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS+00:00", timezone = "UTC")
        public Date getStartDate() {
            return startDate;
        }

        public Long getMqsUsed() {
            return mqsUsed;
        }
    }

    /**
     * Constructor.
     *
     * @param learner The learner to get the information from.
     */
    public LearnerStatus(User user, Learner learner) {
        this.user = user;
        this.learner = learner;
    }

    public User getUser() {
        return user;
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
        return learner.isActive(user);
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
            LearnerResult result = learner.getResult(user);
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
            LearnerResult result = learner.getResult(user);
            if (result == null) {
                return 0L;
            }
            return result.getTestNo();
        } else {
            return null;
        }
    }

    @JsonProperty
    public LearnerStatusStatistics getStatistics() {
        if (!learner.isActive(user)) {
            return null;
        } else {
            return new LearnerStatusStatistics(learner.getStartDate(user), learner.getMQsUsed(user));
        }
    }
}
