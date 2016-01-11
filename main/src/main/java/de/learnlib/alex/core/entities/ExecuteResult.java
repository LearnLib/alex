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
    void setFailedActionNumber(Integer failedActionNumber) {
        this.failedActionNumber = failedActionNumber;
    }

    @Override
    public String toString() {
        if (failedActionNumber == null) {
            return this.name(); // most likely OK
        } else {
            return this.name() + "(" + (failedActionNumber + 1) + ")";
        }
    }
}
