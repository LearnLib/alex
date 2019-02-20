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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * A step that is executed when a symbol is executed.
 */
@Entity
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "action", value = SymbolActionStep.class),
        @JsonSubTypes.Type(name = "symbol", value = SymbolPSymbolStep.class),
})
public abstract class SymbolStep {

    /** The ID of the step in the DB. */
    @Id
    @GeneratedValue
    protected Long id;

    /** If the step is disabled and therefor should not be executed. */
    protected boolean disabled;

    /** If the failure should be ignored. */
    protected boolean ignoreFailure;

    /** If the result should be negated. */
    protected boolean negated;

    /** The custom output if the execution of this action fails. */
    protected String errorOutput;

    /** The position in the step list. */
    protected Integer position;

    /** The symbol that contains the step. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "symbolId")
    private Symbol symbol;

    /** Constructor. */
    public SymbolStep() {
        this.disabled = false;
        this.ignoreFailure = false;
        this.negated = false;
    }

    /**
     * Execute the step.
     *
     * @param i
     *         The index of the step in the symbol.
     * @param connectors
     *         The context to execute the step with.
     * @return The result of the execution.
     */
    public abstract ExecuteResult execute(int i, ConnectorManager connectors);

    /**
     * Get the execute result.
     *
     * @param i
     *         The index of the step.
     * @param connectors
     *         The connector manager.
     * @param result
     *         The result from the step.
     * @return The final result.
     */
    protected ExecuteResult getExecuteResult(int i, ConnectorManager connectors, ExecuteResult result) {
        if (!result.isSuccess() && errorOutput != null && !errorOutput.trim().equals("")) {
            result.setMessage(errorOutput);
        }

        if (negated) {
            result.negate();
        }

        if (!result.isSuccess()) {
            final String message = result.getMessage();
            if (message != null && !message.trim().equals("")) {
                result.setMessage(SearchHelper.insertVariableValues(connectors, getSymbol().getProjectId(), message));
            } else {
                result.setMessage(String.valueOf(i + 1));
            }
        }

        return result;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    @JsonProperty("symbol")
    public Long getSymbolId() {
        return symbol == null ? null : symbol.getId();
    }

    /**
     * Set the referenced symbol by its ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     */
    @JsonProperty("symbol")
    public void setSymbolId(Long symbolId) {
        this.symbol = new Symbol();
        this.symbol.setId(symbolId);
    }

    @JsonProperty("position")
    public Integer getPosition() {
        return position;
    }

    @JsonProperty("position")
    public void setPosition(Integer position) {
        this.position = position;
    }

    public boolean isIgnoreFailure() {
        return ignoreFailure;
    }

    public void setIgnoreFailure(boolean ignoreFailure) {
        this.ignoreFailure = ignoreFailure;
    }

    public boolean isNegated() {
        return negated;
    }

    public void setNegated(boolean negated) {
        this.negated = negated;
    }

    public String getErrorOutput() {
        return errorOutput;
    }

    public void setErrorOutput(String errorOutput) {
        this.errorOutput = errorOutput;
    }
}
