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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * RESTSymbolAction to check if the response body of the last request contains a certain text.
 */
@Entity
@DiscriminatorValue("rest_checkForText")
@JsonTypeName("rest_checkForText")
public class CheckTextRestAction extends RESTSymbolAction {

    private static final long serialVersionUID = -681951086735590790L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The expected text in the response body of the last request. */
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
        boolean result = SearchHelper.search(getValueWithVariableValues(), body, regexp);

        LOGGER.info(LoggerMarkers.LEARNER, "Check if the value '{}' is in '{}' => {} (regexp: {}).",
                value, value, body, result, regexp);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    public String getValue() {
        return value;
    }

    /**
     * Get the value which should be in the body of the last request. All variables and counters will be replaced with
     * their values.
     *
     * @return The value to search for.
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
