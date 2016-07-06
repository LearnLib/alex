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
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Set a variable to a specific value.
 */
@Entity
@DiscriminatorValue("setVariable")
@JsonTypeName("setVariable")
public class SetVariableAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 1935478771410953466L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the variable to set a new value to. */
    @NotBlank
    protected String name;

    /** The new value. */
    @NotNull
    protected String value;

    /**
     * @return The name of the variable to set.
     */
    public String getName() {
        return name;
    }

    /**
     * @param name The new name of the variable to set.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return The value to set the variable to.
     */
    public String getValue() {
        return value;
    }

    /**
     * @param value The new value to set the variable to.
     */
    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        storeConnector.set(name, insertVariableValues(value));

        LOGGER.info(LEARNER_MARKER, "Set the variable '{}' to the value '{}' (ignoreFailure: {}, negated: {}).",
                    name, value, ignoreFailure, negated);
        return getSuccessOutput();
    }
}
