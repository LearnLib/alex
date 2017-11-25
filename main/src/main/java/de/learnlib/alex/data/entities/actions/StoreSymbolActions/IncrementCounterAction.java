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

package de.learnlib.alex.data.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Increment a counter by 1.
 */
@Entity
@DiscriminatorValue("incrementCounter")
@JsonTypeName("incrementCounter")
public class IncrementCounterAction extends SymbolAction {

    private static final Logger LOGGER = LogManager.getLogger("learner");

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the counter to increment. */
    @NotBlank
    private String name;

    /** The value by which the counter should be incremented. */
    @NotNull
    private int incrementBy;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector counterConnector = connector.getConnector(CounterStoreConnector.class);
        counterConnector.incrementBy(symbol.getProjectId(), name, incrementBy);

        LOGGER.info(LEARNER_MARKER, "Incremented counter '{}' by '{}' (ignoreFailure: {}, negated: {}).",
                    name, incrementBy, ignoreFailure, negated);
        return getSuccessOutput();
    }

    /** @return {@link #name}. */
    public String getName() {
        return name;
    }

    /** @param name {@link #name}. */
    public void setName(String name) {
        this.name = name;
    }

    /** @return {@link #incrementBy}. */
    public int getIncrementBy() {
        return incrementBy;
    }

    /** @param incrementBy {@link #incrementBy}. */
    public void setIncrementBy(int incrementBy) {
        this.incrementBy = incrementBy;
    }
}
