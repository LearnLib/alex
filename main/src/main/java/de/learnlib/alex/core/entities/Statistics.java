package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import javax.persistence.Embeddable;
import javax.persistence.Transient;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Embeddable statistics object to hold all the statistics together.
 */
@Embeddable
@JsonPropertyOrder(alphabetic = true)
public class Statistics implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5221139436025380739L;

    /** Standard DateTimeFormatter that will create a nice ISO 8160 string with milliseconds and a time zone. */
    public static final DateTimeFormatter DATE_TIME_FORMATTER
                                                        = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    /** A ZonedDateTime object based at the unix time 0. */
    public static final ZonedDateTime UNIX_TIME_START = ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00");

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
     */
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
