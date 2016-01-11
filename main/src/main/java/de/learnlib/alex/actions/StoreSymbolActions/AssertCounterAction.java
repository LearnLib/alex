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
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
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
    private enum Operator {
        /** '<'. */
        LESS_THAN,

        /** '<='. */
        LESS_OR_EQUAL,

        /** '=='. */
        EQUAL,

        /** '>='. */
        GREATER_OR_EQUAL,

        /** '>'. */
        GREATER_THAN
    }

    /**
     * The name of the variable to assert.
     */
    @NotBlank
    private String name;

    /**
     * The value to assert the variable content with.
     */
    @NotNull
    private Integer value;

    /**
     * The method to compare the counterVariable value with the one given.
     */
    @NotNull
    private Operator operator;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        Integer counterValue = storeConnector.get(getUser().getId(), project.getId(), name);
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

        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    // auto generated getter & setter
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
