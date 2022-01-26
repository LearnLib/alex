/*
 * Copyright 2015 - 2022 TU Dortmund
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

import de.learnlib.alex.data.entities.ParameterizedSymbol;
import java.util.ArrayList;
import java.util.List;

/**
 * Helper object that is used to test words.
 */
public class ReadOutputConfig {

    private ParameterizedSymbol preSymbol;
    private List<ParameterizedSymbol> symbols = new ArrayList<>();
    private ParameterizedSymbol postSymbol;
    private WebDriverConfig driverConfig;

    public ReadOutputConfig() {
    }

    public ReadOutputConfig(ParameterizedSymbol preSymbol,
                            List<ParameterizedSymbol> symbols,
                            ParameterizedSymbol postSymbol,
                            WebDriverConfig driverConfig) {
        this.preSymbol = preSymbol;
        this.symbols = symbols;
        this.postSymbol = postSymbol;
        this.driverConfig = driverConfig;
    }

    public WebDriverConfig getDriverConfig() {
        return driverConfig;
    }

    public void setDriverConfig(WebDriverConfig driverConfig) {
        this.driverConfig = driverConfig;
    }

    public ParameterizedSymbol getPreSymbol() {
        return preSymbol;
    }

    public void setPreSymbol(ParameterizedSymbol preSymbol) {
        this.preSymbol = preSymbol;
    }

    public List<ParameterizedSymbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(List<ParameterizedSymbol> symbols) {
        this.symbols = symbols;
    }

    public ParameterizedSymbol getPostSymbol() {
        return postSymbol;
    }

    public void setPostSymbol(ParameterizedSymbol postSymbol) {
        this.postSymbol = postSymbol;
    }
}
