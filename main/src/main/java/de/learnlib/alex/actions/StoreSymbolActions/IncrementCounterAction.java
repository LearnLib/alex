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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Increment a counter by 1.
 */
@Entity
@DiscriminatorValue("incrementCounter")
@JsonTypeName("incrementCounter")
public class IncrementCounterAction extends SymbolAction {

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /** The name of the counter to increment. */
    @NotBlank
    private String name;

    /**
     * Get the name of the counter.
     *
     * @return The counter name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set a new counter by its name.
     *
     * @param name
     *         The new name of the counter to use.
     */
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        storeConnector.increment(user.getId(), project.getId(), name);

        LOGGER.info("    Incremented counter '{}' (ignoreFailure: {}, negated: {}).", name, ignoreFailure, negated);

        return getSuccessOutput();
    }
}
