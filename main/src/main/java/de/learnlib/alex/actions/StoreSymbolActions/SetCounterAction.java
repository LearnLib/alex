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
 * Action to set a counter to a specific value.
 */
@Entity
@DiscriminatorValue("setCounter")
@JsonTypeName("setCounter")
public class SetCounterAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -6023597222318880440L;

    /** The name of the counter to set a new value to. */
    @NotBlank
    private String name;

    /** The new value. */
    @NotNull
    private Integer counterValue;

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
    public Integer getValue() {
        return counterValue;
    }

    /**
     * @param value The new value to set the counter to.
     */
    public void setValue(Integer value) {
        this.counterValue = value;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        storeConnector.set(getUser().getId(), project.getId(), name, counterValue);
        return getSuccessOutput();
    }
}
