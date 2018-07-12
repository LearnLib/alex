/*
 * Copyright 2018 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.JSONHelpers;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON attribute with a specific name.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeExists")
@JsonTypeName("rest_checkAttributeExists")
public class CheckAttributeExistsAction extends RESTSymbolAction {

    private static final long serialVersionUID = 6739027451651950338L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The name of the attribute to check for. */
    @NotBlank
    private String attribute;

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();

        boolean result = JSONHelpers.getAttributeValue(body, getAttributeWithVariableValues()) != null;

        LOGGER.info(LoggerMarkers.LEARNER, "Check if the attribute '{}' exists in '{}' => {} (ignoreFailure: {}, negated: {}).",
                attribute, body, result, ignoreFailure, negated);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    public String getAttribute() {
        return attribute;
    }

    /**
     * Get the field name of the requested attribute. All variables and counters will be replaced with their values.
     *
     * @return The name of the attribute.
     */
    @Transient
    @JsonIgnore
    public String getAttributeWithVariableValues() {
        return insertVariableValues(attribute);
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

}
