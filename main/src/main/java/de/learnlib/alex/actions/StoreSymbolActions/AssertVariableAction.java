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

package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to assert the equality of the content of a variable with a given string.
 */
@Entity
@DiscriminatorValue("assertVariable")
@JsonTypeName("assertVariable")
public class AssertVariableAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 6363724455992504221L;

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /**
     * The name of the variable to assert.
     */
    @NotBlank
    private String name;

    /**
     * The value to assert the variable content with.
     */
    @NotNull
    private String value;

    /**
     * Whether the value of the variable is matched against a regular expression.
     */
    private boolean regexp;

    /**
     * @return The name of the variable to assert.
     */
    public String getName() {
        return name;
    }

    /**
     * @param name The new name of the variable to assert.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return The value to check the variable against.
     */
    public String getValue() {
        return value;
    }

    /**
     * @param value The new vlue to check the variable against.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * @return Treat the value as regexp?
     */
    public boolean isRegexp() {
        return regexp;
    }

    /**
     * @param regexp True, if the value is a regular expression; false otherwise.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        String variableValue = storeConnector.get(name);

        boolean result;
        if (regexp) {
            result = variableValue.matches(value);
        } else {
            result = variableValue.equals(value);
        }

        LOGGER.info("    Asserting variable '{}' with value '{}' against '{}' => {} "
                            + "(regex: {}, ignoreFailure: {}, negated: {}).",
                    name, variableValue, value, result, regexp, ignoreFailure, negated);

        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

}
