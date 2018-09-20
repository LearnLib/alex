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
package de.learnlib.alex.testing.export;

import java.util.List;

import de.learnlib.alex.data.entities.ParameterizedSymbol;

/**
 * @author Philip Koch
 * @author frohme
 */
public class TestCaseExport {

    private final String name;

    private final List<ParameterizedSymbol> symbols;

    private final List<String> outputs;

    public TestCaseExport(String name, List<ParameterizedSymbol> symbols, List<String> outputs) {
        this.name = name;
        this.symbols = symbols;
        this.outputs = outputs;
    }

    public String getName() {
        return name;
    }

    public List<ParameterizedSymbol> getSymbols() {
        return symbols;
    }

    public List<String> getOutputs() {
        return outputs;
    }
}
