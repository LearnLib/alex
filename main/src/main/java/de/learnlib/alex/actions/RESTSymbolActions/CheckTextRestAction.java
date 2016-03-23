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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.utils.SearchHelper;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the response body of the last request contains a certain text.
 */
@Entity
@DiscriminatorValue("rest_checkForText")
@JsonTypeName("rest_checkForText")
public class CheckTextRestAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -681951086735590790L;

    /** The expected text in the response body of the last request. */
    @NotBlank
    private String value;

    /** Field to determine if the search string is a regular expression. */
    private boolean regexp;

    /**
     * Get the value which should be in the body of the last request.
     *
     * @return The value to search for.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the value which should be in the body of the last request.
     * All variables and counters will be replaced with their values.
     *
     * @return The value to search for.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the value which will be searched in the last response body.
     *
     * @param value
     *         The value to search for.
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
        if (SearchHelper.search(getValueWithVariableValues(), target.getBody(), regexp)) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

}
