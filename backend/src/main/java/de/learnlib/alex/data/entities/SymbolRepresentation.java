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

import java.util.List;

/** Compact representation of a symbol. */
public class SymbolRepresentation {

    /** The id of the symbol. */
    private Long id;

    /** The name of the symbol. */
    private String name;

    /** The inputs of the symbol. */
    private List<SymbolInputParameter> inputs;

    /** The outputs of the symbol. */
    private List<SymbolOutputParameter> outputs;

    /**
     * Constructor.
     *
     * @param symbol The symbol.
     */
    public SymbolRepresentation(Symbol symbol) {
        this.id = symbol.getId();
        this.name = symbol.getName();
        this.inputs = symbol.getInputs();
        this.outputs = symbol.getOutputs();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SymbolInputParameter> getInputs() {
        return inputs;
    }

    public void setInputs(List<SymbolInputParameter> inputs) {
        this.inputs = inputs;
    }

    public List<SymbolOutputParameter> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<SymbolOutputParameter> outputs) {
        this.outputs = outputs;
    }
}
