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

package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the last call returned a specific status code.
 */
@Entity
@DiscriminatorValue("rest_checkStatus")
@JsonTypeName("rest_checkStatus")
public class CheckStatusAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -4444604521120530087L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The status code to check. */
    private int status;

    /**
     * Get the status code the last request should return.
     *
     * @return The status code to check.
     */
    public int getStatus() {
        return status;
    }

    /**
     * Set the status code the last request should return.
     *
     * @param status
     *         The status code to check.
     */
    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        int returnedStatus = target.getStatus();

        boolean result = this.status == returnedStatus;

        LOGGER.info(LEARNER_MARKER, "Checked if the returned status code '{}' is equal to '{}' => {}"
                                        + "(ignoreFailure: {}, negated: {}).",
                    returnedStatus, status, result, ignoreFailure, negated);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }
}
