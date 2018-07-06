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
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON Attribute with a specific value.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeValue")
@JsonTypeName("rest_checkAttributeValue")
public class CheckAttributeValueAction extends RESTSymbolAction {

    private static final long serialVersionUID = -3411541294360335382L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

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

    /**
     * Get the field name of the requested attribute.
     *
     * @return The name of the attribute.
     */
    public String getAttribute() {
        return attribute;
    }

    /**
     * Get the field name of the requested attribute.
     * All variables and counters will be replaced with their values.
     *
     * @return The name of the attribute.
     */
    @JsonIgnore
    public String getAttributeWithVariableValues() {
        return insertVariableValues(attribute);
    }

    /**
     * Set the field name of the attribute which should be searched for.
     *
     * @param attribute
     *         The name of the attribute.
     */
    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * Get the expected value of the attribute.
     *
     * @return The expected attribute value.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the expected value of the attribute.
     * All variables and counters will be replaced with their values.
     *
     * @return The expected attribute value.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the expected value of the attribute.
     *
     * @param value
     *         The new expected attribute value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Should the value be treated as regular expression while searching for a text?
     *
     * @return true, if value should be a regular expression: false otherwise.
     */
    public boolean isRegexp() {
        return regexp;
    }

    /**
     * Set the flag if the value is a regular expression for the text search.
     *
     * @param regexp
     *         true if the value is a regular expression.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, getAttributeWithVariableValues());

        boolean result = valueInTheBody != null
                            && SearchHelper.search(getValueWithVariableValues(), valueInTheBody, regexp);

        LOGGER.info(LEARNER_MARKER, "Check if the attribute '{}' has the value '{}' in '{}' => {} "
                                        + "(regexp: {}, ignoreFailure: {}, negated: {}).",
                    attribute, value, body, result, regexp, ignoreFailure, negated);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

}
