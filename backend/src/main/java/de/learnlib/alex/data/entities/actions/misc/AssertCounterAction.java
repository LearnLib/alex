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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Action to assert the value of a counter.
 */
@Entity
@DiscriminatorValue("assertCounter")
@JsonTypeName("assertCounter")
public class AssertCounterAction extends SymbolAction {

    /**
     * Assert types to mimic the different operators.
     */
    public enum Operator {

        /** '<'. */
        LESS_THAN,

        /** '<='. */
        LESS_OR_EQUAL,

        /** '=='. */
        EQUAL,

        /** '>='. */
        GREATER_OR_EQUAL,

        /** '>'. */
        GREATER_THAN;

        /**
         * Parser function to handle the enum names case insensitive.
         *
         * @param name
         *         The enum name.
         * @return The corresponding CookieType.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        @JsonCreator
        public static Operator fromString(String name) throws IllegalArgumentException {
            return Operator.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }

    }

    private static final long serialVersionUID = -8210218030257177422L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The name of the counter to assert.
     */
    @NotBlank
    private String name;

    /**
     * The value to assert the counter content with.
     */
    @NotNull
    @Column(name = "assert_counter_value")
    private Integer value;

    /**
     * The method to compare the counter value with the one given.
     */
    @NotNull
    private Operator operator;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        Integer counterValue = storeConnector.get(name);
        boolean result;

        switch (operator) {
            case LESS_THAN:
                result = counterValue < value;
                break;
            case LESS_OR_EQUAL:
                result = counterValue <= value;
                break;
            case EQUAL:
                result = counterValue.equals(value);
                break;
            case GREATER_OR_EQUAL:
                result = counterValue >= value;
                break;
            case GREATER_THAN:
                result = counterValue > value;
                break;
            default:
                result = false;
                break;
        }

        LOGGER.info(LoggerMarkers.LEARNER, "Asserting counter '{}' with value '{}' against '{}' using {} => {}.",
                name, counterValue, value, operator, result);

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

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Operator getOperator() {
        return operator;
    }

    public void setOperator(Operator assertMethod) {
        this.operator = assertMethod;
    }

}
