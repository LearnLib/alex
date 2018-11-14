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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.mapper.api.SULMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Class to map the Symbols and their result to the values used in the learning process.
 */
public class SymbolMapper implements SULMapper<
        String,
        String,
        ContextExecutableInput<ExecuteResult, ConnectorManager>,
        ExecuteResult> {

    private static final Logger LOGGER = LogManager.getLogger();

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
                .collect(Collectors.toMap(ParameterizedSymbol::getComputedName, Function.identity()));
    }

    /**
     * Adds a new symbol to the mapper.
     *
     * @param symbol
     *         The symbol to add.
     */
    public void addSymbol(ParameterizedSymbol symbol) {
        this.symbolMap.putIfAbsent(symbol.getComputedName(), symbol);
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
        LOGGER.info("mapper mapped unwrapped exception", e);
        return null;
    }

    @Override
    public MappedException<? extends String> mapWrappedException(SULException e) throws SULException {
        LOGGER.info("mapper mapped wrapped exception", e);
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
        return new SymbolMapper(new ArrayList<>(symbolMap.values()));
    }
}
