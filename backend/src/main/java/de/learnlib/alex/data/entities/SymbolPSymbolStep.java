/*
 * Copyright 2015 - 2020 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.io.Serializable;

/**
 * Execute another symbol on the SUL.
 */
@Entity
@JsonTypeName("symbol")
public class SymbolPSymbolStep extends SymbolStep implements Serializable {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The symbol to execute. */
    @OneToOne(cascade = CascadeType.REMOVE)
    private ParameterizedSymbol pSymbol;

    @Override
    public ExecuteResult execute(int i, ConnectorManager connectors) {
        try {
            return getExecuteResult(i, connectors, pSymbol.execute(connectors));
        } catch (Exception e) {
            LOGGER.error(LoggerMarkers.LEARNER, "The symbol could not be executed.", e);
            return new ExecuteResult(false, String.valueOf(i + 1));
        }
    }

    @JsonProperty("pSymbol")
    public ParameterizedSymbol getPSymbol() {
        return pSymbol;
    }

    @JsonProperty("pSymbol")
    public void setPSymbol(ParameterizedSymbol symbol) {
        this.pSymbol = symbol;
    }
}
