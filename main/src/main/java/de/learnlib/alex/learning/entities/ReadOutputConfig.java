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

package de.learnlib.alex.learning.entities;

import de.learnlib.alex.config.entities.BrowserConfig;

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
    private BrowserConfig browser;

    /**
     * Constructor.
     */
    public ReadOutputConfig() {
    }

    /**
     * @return The symbols.
     */
    public SymbolSet getSymbols() {
        return symbols;
    }

    /**
     * @param symbols The symbols.
     */
    public void setSymbols(SymbolSet symbols) {
        this.symbols = symbols;
    }

    /**
     * @return The browser.
     */
    public BrowserConfig getBrowser() {
        return browser;
    }

    /**
     * @param browser The browser.
     */
    public void setBrowser(BrowserConfig browser) {
        this.browser = browser;
    }
}
