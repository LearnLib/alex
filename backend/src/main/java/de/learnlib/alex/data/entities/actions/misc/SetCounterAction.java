/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Action to set a counter to a specific value.
 */
@Entity
@DiscriminatorValue("setCounter")
@JsonTypeName("setCounter")
public class SetCounterAction extends SymbolAction {

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
    @Column(name = "\"value\"")
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
            logger.info(LoggerMarkers.LEARNER, "Could not set the counter '{}' to the value '{}' ", name, value, e);

            return getFailedOutput();
        }

        counterStoreConnector.set(symbol.getProjectId(), name, val);

        logger.info(LoggerMarkers.LEARNER, "Set the counter '{}' to the value '{}'.", name, value);
        return getSuccessOutput();
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

    public ValueType getValueType() {
        return valueType;
    }

    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }
}
