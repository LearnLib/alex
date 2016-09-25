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

package de.learnlib.alex.actions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.utils.LoggerUtil;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;


/**
 * Action to execute another symbol.
 */
@Entity
@DiscriminatorValue("executeSymbol")
@JsonTypeName("executeSymbol")
public class ExecuteSymbolAction extends SymbolAction {

    private static final long serialVersionUID = 3143716533295082498L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * Reference to the Symbol that will be executed.
     *
     * @requiredField
     */
    @Transient
    @JsonProperty("symbolToExecute")
    private IdRevisionPair symbolToExecuteAsIdRevisionPair;

    /**
     * The actual reference to the Symbol that will be executed.
     * Only used internally.
     */
    @ManyToOne
    @JsonIgnore
    private Symbol symbolToExecute;

    /**
     * Indicates if the latest revision of the symbol should be used.
     */
    private boolean useLatestRevision;

    /**
     * Get the reference to the Symbol which will be executed.
     *
     * @return The reference as IdRevisionPair. Just add the project id ;)
     */
    public IdRevisionPair getSymbolToExecuteAsIdRevisionPair() {
        if (symbolToExecuteAsIdRevisionPair == null) {
            return new IdRevisionPair(symbolToExecute);
        }
        return symbolToExecuteAsIdRevisionPair;
    }

    /**
     * Set a new reference to the Symbol to execute.
     * This does not update the actual Symbol!
     *
     * @param symbolToExecuteAsIdRevisionPair The new IdRevisionPair of the Symbol to execute.
     */
    public void setSymbolToExecuteAsIdRevisionPair(IdRevisionPair symbolToExecuteAsIdRevisionPair) {
        this.symbolToExecuteAsIdRevisionPair = symbolToExecuteAsIdRevisionPair;
    }

    /**
     * Get the actual Symbol to execute.
     *
     * @return The Symbol which should be executed.
     */
    public Symbol getSymbolToExecute() {
        return symbolToExecute;
    }

    /**
     * Set a new Symbol to execute.
     * This does not update the reference (IdRevisionPair)!
     *
     * @param symbolToExecute The new Symbol which will be executed.
     */
    public void setSymbolToExecute(Symbol symbolToExecute) {
        this.symbolToExecute = symbolToExecute;
    }

    /**
     * Get the name of the Symbol to execute.
     * Readonly.
     *
     * @return The name of the Symbol to execute.
     */
    @JsonProperty("symbolToExecuteName")
    public String getSymbolToExecuteName() {
        if (symbolToExecute == null) {
            return "";
        }

        return symbolToExecute.getName();
    }

    /**
     * Checks if the latest revision of the symbols should be used.
     *
     * @return if the latest revision should be used.
     */
    public boolean isUseLatestRevision() {
        return useLatestRevision;
    }

    /**
     * Sets the flag that indicates if the latest revision of the symbol should be used.
     *
     * @param useLatestRevision the flag
     */
    public void setUseLatestRevision(boolean useLatestRevision) {
        this.useLatestRevision = useLatestRevision;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        if (symbolToExecute == null) {
            LOGGER.info(LEARNER_MARKER, "No other Symbol to execute was set (ignoreFailure: {}, negated: {}).",
                        ignoreFailure, negated);
            return getFailedOutput();
        }
        LOGGER.info(LEARNER_MARKER, "Executing other Symbol <{}:{}> (ignoreFailure: {}, negated: {}).",
                    symbolToExecute.getId(), symbolToExecute.getRevision(), ignoreFailure, negated);
        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.increaseIndent();
        }

        ExecuteResult symbolResult = symbolToExecute.execute(connector);

        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.decreaseIndent();
        }
        LOGGER.info(LEARNER_MARKER, "Executed other Symbol <{}:{}> => {} (ignoreFailure: {}, negated: {}).",
                    symbolToExecute.getId(), symbolToExecute.getRevision(), symbolResult, ignoreFailure, negated);
        if (symbolResult == ExecuteResult.OK) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }
}
