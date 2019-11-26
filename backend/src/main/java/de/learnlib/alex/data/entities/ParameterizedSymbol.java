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

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Symbol that is executed on the SUL that uses parameters. A symbol will then be used displayed as e.g. "NAME <value1,
 * value2>" where "value1" and "value2" are values for the parameters. This way, a symbol can be used in multiple
 * configurations during a learning process.
 */
@Entity
public class ParameterizedSymbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    private static final long serialVersionUID = -87489928962763046L;

    /**
     * The ID of the parameterized symbol in the database.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * The symbol to execute.
     */
    @OneToOne(
            fetch = FetchType.EAGER
    )
    private Symbol symbol;

    private String alias;

    /**
     * The parameter values for the symbol to execute.
     */
    @OneToMany(
            fetch = FetchType.EAGER,
            cascade = {CascadeType.PERSIST, CascadeType.REMOVE}
    )
    private List<SymbolParameterValue> parameterValues;

    /**
     * The parameter values for the symbol to execute.
     */
    @OneToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.REMOVE}
    )
    private List<SymbolOutputMapping> outputMappings;

    /**
     * Constructor.
     */
    public ParameterizedSymbol() {
        this.parameterValues = new ArrayList<>();
        this.outputMappings = new ArrayList<>();
    }

    /**
     * Constructor.
     *
     * @param symbol The symbol to execute.
     */
    public ParameterizedSymbol(Symbol symbol) {
        this();
        this.symbol = symbol;
    }

    private boolean allInputValuesDefined() {
        return parameterValues.isEmpty() || parameterValues.stream().allMatch(pv -> pv.getValue() != null);
    }

    @Override
    public ExecuteResult execute(ConnectorManager connectors) throws SULException {
        if (!allInputValuesDefined()) {
            return new ExecuteResult(false, "Undefined input value");
        }

        // global scope
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);
        final CounterStoreConnector counterStore = connectors.getConnector(CounterStoreConnector.class);

        // local scope
        final VariableStoreConnector localVariableStore = new VariableStoreConnector();
        final CounterStoreConnector localCounterStore = counterStore.copy();

        // user defined values for parameters (name -> value)
        final Map<String, String> pvMap = new HashMap<>();
        parameterValues.forEach(pv -> pvMap.put(pv.getParameter().getName(), pv.getValue()));

        // set values in local scope
        try {
            for (final SymbolInputParameter in : symbol.getInputs()) {
                if (in.getParameterType().equals(SymbolParameter.ParameterType.STRING)) {
                    final String userValue = pvMap.get(in.getName());
                    localVariableStore.set(in.getName(), SearchHelper.insertVariableValues(connectors, symbol.getProjectId(), userValue));
                } else {
                    localCounterStore.set(symbol.getProjectId(), in.getName(), counterStore.get(in.getName()));
                }
            }
        } catch (IllegalStateException e) {
            return new ExecuteResult(false, e.getMessage());
        }

        connectors.addConnector(localVariableStore);
        connectors.addConnector(localCounterStore);

        final ExecuteResult result = symbol.execute(connectors);

        // update global scope
        try {
            for (final SymbolOutputParameter out : symbol.getOutputs()) {
                if (out.getParameterType().equals(SymbolParameter.ParameterType.STRING) && result.isSuccess()) {
                    final SymbolOutputMapping outputMapping = getOutputMappingFor(out.getName());
                    variableStore.set(outputMapping.getName(), localVariableStore.get(out.getName()));
                } else if (out.getParameterType().equals(SymbolParameter.ParameterType.COUNTER)) {
                    counterStore.set(symbol.getProjectId(), out.getName(), localCounterStore.get(out.getName()));
                }
            }
        } catch (IllegalStateException e) {
            return new ExecuteResult(false, e.getMessage());
        }

        connectors.addConnector(variableStore);
        connectors.addConnector(counterStore);

        return result;
    }

    private SymbolOutputMapping getOutputMappingFor(String name) {
        for (SymbolOutputMapping m: outputMappings) {
            if (m.getParameter().getName().equals(name)) {
                return m;
            }
        }
        throw new IllegalStateException("No mapping for " + name + " found");
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

    public List<SymbolParameterValue> getParameterValues() {
        return parameterValues;
    }

    public void setParameterValues(List<SymbolParameterValue> parameterValues) {
        this.parameterValues = parameterValues;
    }

    public List<SymbolOutputMapping> getOutputMappings() {
        return outputMappings;
    }

    public void setOutputMappings(List<SymbolOutputMapping> outputMappings) {
        this.outputMappings = outputMappings;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        if (alias == null || alias.trim().equals("")) {
            this.alias = null;
        } else {
            this.alias = alias;
        }
    }

    /**
     * If there are no parameter values defined, the name will be "NAME". Otherwise it will be "NAME <value1, value2>"
     * where "value1" and "value2" are concrete values for the parameters.
     *
     * @return The computed name based on the parameters.
     */
    @JsonIgnore
    public String getAliasOrComputedName() {
        if (alias != null && !alias.equals("")) {
            return alias;
        } else {
            final List<String> parameters = parameterValues.stream()
                    .filter(pv -> pv.getValue() != null)
                    .map(SymbolParameterValue::getValue)
                    .collect(Collectors.toList());
            if (parameters.isEmpty()) {
                return getSymbol().getName();
            } else {
                return getSymbol().getName() + " <" + String.join(", ", parameters) + ">";
            }
        }
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
        pSymbol.setOutputMappings(
                outputMappings.stream().map(om -> {
                    final SymbolOutputMapping mapping = new SymbolOutputMapping();
                    mapping.setParameter(om.getParameter());
                    mapping.setName(om.getName());
                    return mapping;
                }).collect(Collectors.toList())
        );
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
