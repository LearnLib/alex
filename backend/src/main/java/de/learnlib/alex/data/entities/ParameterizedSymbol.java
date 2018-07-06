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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Symbol that is executed on the SUL that uses parameters. A symbol will then be used displayed as e.g. "NAME <value1,
 * value2>" where "value1" and "value2" are values for the parameters. This way, a symbol can be used in multiple
 * configurations during a learning process.
 */
@Entity
public class ParameterizedSymbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    private static final long serialVersionUID = -87489928962763046L;

    /** The ID of the parameterized symbol in the database. */
    @Id
    @GeneratedValue
    private Long id;

    /** The symbol to execute. */
    @OneToOne(
            fetch = FetchType.EAGER
    )
    private Symbol symbol;

    /** The parameter values for the symbol to execute. */
    @OneToMany(
            fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST}
    )
    private List<SymbolParameterValue> parameterValues;

    /** Constructor. */
    public ParameterizedSymbol() {
        this.parameterValues = new ArrayList<>();
    }

    /**
     * Constructor.
     *
     * @param symbol
     *         The symbol to execute.
     */
    public ParameterizedSymbol(Symbol symbol) {
        this();
        this.symbol = symbol;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connectors) throws SULException {
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);
        final VariableStoreConnector localVariableStore = variableStore.clone();
        connectors.addConnector(localVariableStore);

        parameterValues.forEach(v -> {
            if (v.getValue() != null) {
                final String value = v.getValue() == null ?
                        null :
                        SearchHelper.insertVariableValues(connectors, symbol.getProjectId(), v.getValue());
                localVariableStore.set(v.getParameter().getName(), value);
            }
        });

        return symbol.execute(connectors);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    @JsonProperty("symbol")
    public SymbolRepresentation getSymbolId() {
        return new SymbolRepresentation(symbol);
    }

    /**
     * Set the symbol by an ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     */
    @JsonProperty("symbol")
    public void setSymbolId(Long symbolId) {
        symbol = new Symbol();
        symbol.setId(symbolId);
    }

    @JsonProperty("symbolFromName")
    public void setSymbolFromName(String symbolName) {
        symbol = new Symbol();
        symbol.setName(symbolName);
    }

    public List<SymbolParameterValue> getParameterValues() {
        return parameterValues;
    }

    public void setParameterValues(List<SymbolParameterValue> parameterValues) {
        this.parameterValues = parameterValues;
    }

    /**
     * If there are no parameter values defined, the name will be "NAME". Otherwise it will be "NAME <value1, value2>"
     * where "value1" and "value2" are concrete values for the parameters.
     *
     * @return The computed name based on the parameters.
     */
    @JsonIgnore
    public String getComputedName() {
        final List<String> parameters = parameterValues.stream()
                .filter(pv -> !((SymbolInputParameter) pv.getParameter()).isPrivate() && pv.getValue() != null)
                .map(SymbolParameterValue::getValue)
                .collect(Collectors.toList());
        final String suffix = parameters.isEmpty() ? "" : " <" + String.join(", ", parameters) + ">";
        return getSymbol().getName() + suffix;
    }

    /**
     * Copies the parameterized symbol. There are new instances created that do not contain IDs so that the copy can be
     * saved directly in the database.
     *
     * @return The copied parameterized symbol.
     */
    public ParameterizedSymbol copy() {
        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(symbol);
        pSymbol.setParameterValues(
                parameterValues.stream().map(pv -> {
                    final SymbolParameterValue value = new SymbolParameterValue();
                    value.setParameter(pv.getParameter());
                    value.setValue(pv.getValue());
                    return value;
                }).collect(Collectors.toList())
        );
        return pSymbol;
    }
}
