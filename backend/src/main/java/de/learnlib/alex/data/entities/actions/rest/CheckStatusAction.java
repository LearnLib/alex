/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.data.entities.actions.rest;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * RESTSymbolAction to check if the last call returned a specific status code.
 */
@Entity
@DiscriminatorValue("rest_checkStatus")
@JsonTypeName("rest_checkStatus")
public class CheckStatusAction extends RESTSymbolAction {

    private static final long serialVersionUID = -4444604521120530087L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The smallest possible HTTP status. */
    private static final int MIN_HTTP_STATUS = 100;

    /** The status code to check. */
    @NotNull
    @Min(MIN_HTTP_STATUS)
    private int status;

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        int returnedStatus = target.getStatus();

        boolean result = this.status == returnedStatus;

        LOGGER.info(LoggerMarkers.LEARNER, "Checked if the returned status code '{}' is equal to '{}' => {}.",
                returnedStatus, status, result);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
