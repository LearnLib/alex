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
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to set a counter to a specific value.
 */
@Entity
@DiscriminatorValue("setCounter")
@JsonTypeName("setCounter")
public class SetCounterAction extends SymbolAction {

    private static final long serialVersionUID = -6023597222318880440L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * How {@link SetCounterAction#value} should be interpreted.
     */
    public enum ValueType {

        /**
         * As number.
         */
        NUMBER,

        /**
         * As value from a current variable.
         */
        VARIABLE
    }

    /**
     * The name of the counter to set a new value to.
     */
    @NotBlank
    private String name;

    /**
     * The new value.
     */
    @NotNull
    private String value;

    /**
     * How {@link SetCounterAction#value} should be interpreted.
     */
    @NotNull
    private ValueType valueType;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector counterStoreConnector = connector.getConnector(CounterStoreConnector.class);
        VariableStoreConnector variableStoreConnector = connector.getConnector(VariableStoreConnector.class);

        int val;
        try {
            switch (valueType) {
                case VARIABLE:
                    val = Integer.parseInt(variableStoreConnector.get(value));
                    break;
                case NUMBER:
                    val = Integer.parseInt(value);
                    break;
                default:
                    val = 0;
                    break;
            }
        } catch (NumberFormatException | IllegalStateException e) {
            return getFailedOutput();
        }

        counterStoreConnector.set(getUser().getId(), project.getId(), name, val);

        LOGGER.info(LEARNER_MARKER, "Set the counter '{}' to the value '{}' (ignoreFailure: {}, negated: {}).",
                name, value, ignoreFailure, negated);
        return getSuccessOutput();
    }

    /**
     * @return The name of the counter to set.
     */
    public String getName() {
        return name;
    }

    /**
     * @param name The new name of the counter to set.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return The value to set the counter to.
     */
    public String getValue() {
        return value;
    }

    /**
     * @param value The new value to set the counter to.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /** @return {@link SetCounterAction#value}. */
    public ValueType getValueType() {
        return valueType;
    }

    /** @param valueType {@link SetCounterAction#value}. */
    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }
}
