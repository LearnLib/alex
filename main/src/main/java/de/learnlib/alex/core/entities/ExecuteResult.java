package de.learnlib.alex.core.entities;

/**
 * An Enumeration to determine if the Symbol was executed correctly or not.
 */
public enum ExecuteResult {

    /** The Symbol was executed correctly. */
    OK,

    /** While executing the Symbol something went wrong. */
    FAILED;

    /**
     * Number to indicate the action of a Symbol that failed.
     * OK -> null value.
     * If an Action returns the ExecuteResult -> null.
     */
    private Integer failedActionNumber;

    /**
     * Get the number to indicate which action of a symbol failed.
     *
     * @return The number that indicates teh failed action. null if OK.
     */
    public Integer getFailedActionNumber() {
        return failedActionNumber;
    }

    /**
     * Set the number of the failed action of a Symbol.
     *
     * @param failedActionNumber
     *         Number to indicate the failed action . Must be null when OK.
     */
    public void setFailedActionNumber(Integer failedActionNumber) {
        this.failedActionNumber = failedActionNumber;
    }

    @Override
    public String toString() {
        if (this == FAILED) {
            return this.name() + "(" + failedActionNumber + ")";
        } else {
            return this.name();
        }
    }
}
