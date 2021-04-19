/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.mapper.api.SULMapper;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Class to map the Symbols and their result to the values used in the learning process.
 */
public class SymbolMapper implements SULMapper<
        String,
        String,
        ContextExecutableInput<ExecuteResult, ConnectorManager>,
        ExecuteResult> {

    private static final Logger logger = LoggerFactory.getLogger(SymbolMapper.class);

    /** Map to manage the symbols according to their name in the Alphabet. */
    private final Map<String, ParameterizedSymbol> symbolMap;

    /**
     * Constructor. Initialize the map name -> symbol.
     *
     * @param symbols
     *         The symbols for the learning process.
     */
    public SymbolMapper(List<ParameterizedSymbol> symbols) {
        this.symbolMap = symbols.stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getAliasOrComputedName, Function.identity()));
    }

    /**
     * Private constructor for the {@link #fork()} method. Ensures that an existing symbol map is passed by reference
     * and therefore shared across multiple threads. This allows to use a single (global) symbol map across multiple
     * forked SULs, which only access the data in a read-only manner. Currently there exists no possibility to modify
     * the symbol map concurrently, so we should be safe.
     *
     * @param symbolMap
     *         Reference of the original symbolMap.
     */
    private SymbolMapper(Map<String, ParameterizedSymbol> symbolMap) {
        this.symbolMap = symbolMap;
    }

    /**
     * Adds a new symbol to the mapper.
     *
     * @param symbol
     *         The symbol to add.
     */
    public void addSymbol(ParameterizedSymbol symbol) {
        this.symbolMap.putIfAbsent(symbol.getAliasOrComputedName(), symbol);
    }

    @Override
    public ContextExecutableInput<ExecuteResult, ConnectorManager> mapInput(String abstractInput) {
        return symbolMap.get(abstractInput);
    }

    @Override
    public String mapOutput(ExecuteResult result) {
        return result.getOutput();
    }

    @Override
    public MappedException<? extends String> mapUnwrappedException(RuntimeException e) throws RuntimeException {
        logger.info("mapper mapped unwrapped exception", e);
        return null;
    }

    @Override
    public MappedException<? extends String> mapWrappedException(SULException e) throws SULException {
        logger.info("mapper mapped wrapped exception", e);
        return null;
    }

    @Override
    public void post() {
    }

    @Override
    public void pre() {
    }

    @Override
    public boolean canFork() {
        return true;
    }

    @Nonnull
    @Override
    public SULMapper<String, String, ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult> fork()
            throws UnsupportedOperationException {
        return new SymbolMapper(symbolMap);
    }
}
