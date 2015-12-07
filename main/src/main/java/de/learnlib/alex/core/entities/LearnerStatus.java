package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.Learner;

import java.time.ZonedDateTime;

/**
 * Class to provide information about the current learn process.
 */
@JsonPropertyOrder(alphabetic = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearnerStatus {

    /** The user that 'owns' the LearningThread and Status. */
    @JsonIgnore
    private final User user;

    /** Is the Learner active? */
    private final boolean active;

    /** The ID of the Project this test status belongs to. */
    private final Long projectId;

    /** The current test no. */
    private final Long testNo;

    /** The statistics of the learner. */
    private final LearnerStatusStatistics statistics;

    /**
     * Statistics Class for the learner status.
     */
    @JsonPropertyOrder(alphabetic = true)
    public static class LearnerStatusStatistics {

        /** When the learning started. */
        private final ZonedDateTime startDate;

        /** How many MQ where issued. */
        private final Long mqsUsed;

        /**
         * @param startDate When the learning was started.
         * @param mqsUsed How many MQ where issued during the learning.
         */
        public LearnerStatusStatistics(ZonedDateTime startDate, Long mqsUsed) {
            this.startDate = startDate;
            this.mqsUsed = mqsUsed;
        }

        /**
         * @return When the learning was started.
         */
        @JsonIgnore
        public ZonedDateTime getStartDate() {
            return startDate;
        }

        /**
         * @return When the learning was started as nice ISO 8160 string, including milliseconds and zone.
         */
        @JsonProperty("startDate")
        public String getStartDateAsString() {
            return startDate.format(LearnerResult.DATE_TIME_FORMATTER);
        }

        /**
         * @return How many MQ where issued during the learning.
         */
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

    /**
     * Additional Statistics of the learn process.
     * Only included if the learner is active.
     *
     * @return Additional statistics, e.g. the start date.
     */
    public LearnerStatusStatistics getStatistics() {
        return statistics;
    }
}
