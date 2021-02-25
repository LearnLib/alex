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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Action to assert the equality of the content of a variable with a given string.
 */
@Entity
@DiscriminatorValue("assertVariable")
@JsonTypeName("assertVariable")
public class AssertVariableAction extends SymbolAction {

    private static final long serialVersionUID = 6363724455992504221L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The name of the variable to assert.
     */
    @NotBlank
    private String name;

    /**
     * The value to assert the variable content with.
     */
    @NotBlank
    @Column(name = "\"value\"")
    private String value;

    /**
     * Whether the value of the variable is matched against a regular expression.
     */
    @NotNull
    @Column(name = "\"regexp\"")
    private boolean regexp;

    /** Constructor. */
    public AssertVariableAction() {
        this.regexp = false;
    }

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        final VariableStoreConnector variableStore = connector.getConnector(VariableStoreConnector.class);
        final String variableValue = variableStore.get(name);
        final String valueWithVariables = insertVariableValues(value);

        final boolean result;
        if (regexp) {
            result = variableValue.matches(valueWithVariables);
        } else {
            result = variableValue.equals(valueWithVariables);
        }

        LOGGER.info(LoggerMarkers.LEARNER, "Asserting variable '{}' with value '{}' against '{}' => {} (regex: {}).",
                name, variableValue, valueWithVariables, result, regexp);

        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
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
