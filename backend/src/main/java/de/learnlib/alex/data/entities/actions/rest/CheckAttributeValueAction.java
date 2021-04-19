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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.JSONHelpers;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON Attribute with a specific value.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeValue")
@JsonTypeName("rest_checkAttributeValue")
public class CheckAttributeValueAction extends RESTSymbolAction {

    /** The name of the attribute to check for. */
    @NotBlank
    private String attribute;

    /** The expected value of the attribute. */
    @NotBlank
    @Column(name = "\"value\"")
    private String value;

    /** Field to determine if the search string is a regular expression. */
    @NotNull
    @Column(name = "\"regexp\"")
    private boolean regexp;

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, getAttributeWithVariableValues());

        boolean result = valueInTheBody != null
                && SearchHelper.search(getValueWithVariableValues(), valueInTheBody, regexp);

        logger.info(LoggerMarkers.LEARNER, "Check if the attribute '{}' has the value '{}' in '{}' => {} (regexp: {}).",
                attribute, value, body, result, regexp);
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

    public String getValue() {
        return value;
    }

    /**
     * Get the expected value of the attribute. All variables and counters will be replaced with their values.
     *
     * @return The expected attribute value.
     */
    @Transient
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

}
