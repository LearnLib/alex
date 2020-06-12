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

package de.learnlib.alex.learning.entities;

import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;

/**
 * Helper object that is used to test words.
 */
public class ReadOutputConfig {

    /**
     * The sequence of symbols that should be tested.
     */
    private SymbolSet symbols;

    /**
     * The web browser the word should be executed in.
     */
    private AbstractWebDriverConfig driverConfig;

    /**
     * Constructor.
     */
    public ReadOutputConfig() {
    }

    /**
     * Constructor.
     * @param symbols The symbols.
     * @param driverConfig The driver config.
     */
    public ReadOutputConfig(SymbolSet symbols, AbstractWebDriverConfig driverConfig) {
        this.symbols = symbols;
        this.driverConfig = driverConfig;
    }

    public SymbolSet getSymbols() {
        return symbols;
    }

    public void setSymbols(SymbolSet symbols) {
        this.symbols = symbols;
    }

    public AbstractWebDriverConfig getDriverConfig() {
        return driverConfig;
    }

    public void setDriverConfig(AbstractWebDriverConfig driverConfig) {
        this.driverConfig = driverConfig;
    }
}
