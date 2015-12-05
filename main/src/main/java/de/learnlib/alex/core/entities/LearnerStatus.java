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
    
    private final boolean active;

    private final Long projectId;

    private final Long testNo;

    private final LearnerStatusStatistics statistics;

    /**
     * Statistics Class for the learner status.
     */
    @JsonPropertyOrder(alphabetic = true)
    private class LearnerStatusStatistics {

        private final Date startDate;

        private final Long mqsUsed;

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
//        LogManager.getLogger("server").trace("Create new LearnerStatus for user" + user);
        this.user = user;
        this.active = learner.isActive(user);

        if (active) {
            // because there is an active thread, this will return not null
            LearnerResult result = learner.getResult(user);

            this.projectId = result.getProjectId();
            this.testNo = result.getTestNo();
            this.statistics = new LearnerStatusStatistics(learner.getStartDate(user), learner.getMQsUsed(user));
        } else {
            // if not active, those fields should not be included in the final JSON -> set them to null
            this.projectId = null;
            this.testNo = null;
            this.statistics = null;
        }
    }

    public User getUser() {
        return user;
    }

    /**
     * Is the learn process active?
     *
     * @return true if the learn process is active; false otherwise
     */
    public boolean isActive() {
        return active;
    }

    /**
     * The project id of the currently active project.
     * Only included if the learner is active.
     *
     * @return The active project id.
     */
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * The test no in the active project of the currently active learn process.
     * Only included if the learner is active.
     *
     * @return The active test no in the project.
     */
    public Long getTestNo() {
        return testNo;
    }

    public LearnerStatusStatistics getStatistics() {
        return statistics;
    }
}
