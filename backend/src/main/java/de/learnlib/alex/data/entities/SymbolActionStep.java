/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.io.Serializable;

/**
 * Executes an action on the SUL.
 */
@Entity
@JsonTypeName("action")
public class SymbolActionStep extends SymbolStep implements Serializable {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final long serialVersionUID = 5116902783136721652L;

    /** The action to execute. */
    @OneToOne
    private SymbolAction action;

    /** Constructor. */
    public SymbolActionStep() {
    }

    /**
     * Constructor.
     *
     * @param action
     *         The action to execute.
     */
    public SymbolActionStep(SymbolAction action) {
        this.action = action;
    }

    @Override
    public ExecuteResult execute(int i, ConnectorManager connectors) {
        try {
            return getExecuteResult(i, connectors, action.executeAction(connectors));
        } catch (Exception e) {
            LOGGER.error(LoggerMarkers.LEARNER, "The action could not be executed.", e);
            return new ExecuteResult(false, String.valueOf(i + 1));
        }
    }

    public SymbolAction getAction() {
        return action;
    }

    public void setAction(SymbolAction action) {
        this.action = action;
    }
}
