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

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

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
        LOGGER.info("check if the returned status code '" + returnedStatus + " is equal to '" + status + "' "
                    + "(ignoreFailure : " + ignoreFailure + ", negated: " + negated + ").");

        if (this.status == returnedStatus) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }
}
