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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.learnlib.alex.data.entities.ParameterizedSymbol;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Set of symbols to manage a reset symbol and a list of symbols together.
 */
public class SymbolSet {

    /**
     * The actual Symbols that should be used as a reset Symbol. Only used internally.
     */
    private ParameterizedSymbol resetSymbol;

    /**
     * The actual list of Symbols used during the learning. Only used internally.
     */
    private List<ParameterizedSymbol> symbols;

    /** Constructor. */
    public SymbolSet() {
        this(null, new ArrayList<>());
    }

    /**
     * Constructor.
     *
     * @param resetSymbol
     *         The reset symbol.
     * @param symbols
     *         The symbols.
     */
    public SymbolSet(ParameterizedSymbol resetSymbol, List<ParameterizedSymbol> symbols) {
        this.resetSymbol = resetSymbol;
        this.symbols = symbols;
    }

    public ParameterizedSymbol getResetSymbol() {
        return resetSymbol;
    }

    public void setResetSymbol(ParameterizedSymbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    public List<ParameterizedSymbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(List<ParameterizedSymbol> symbols) {
        this.symbols = symbols;
    }

    @JsonIgnore
    public List<Long> getSymbolIds() {
        return symbols.stream().map(ps -> ps.getSymbol().getId()).collect(Collectors.toList());
    }

    /**
     * Get all symbols in the set.
     *
     * @return The list with the reset symbol and all others.
     */
    public List<ParameterizedSymbol> getAllSymbols() {
        List<ParameterizedSymbol> resultList = new LinkedList<>();
        resultList.add(resetSymbol);
        resultList.addAll(symbols);
        return resultList;
    }

}
