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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.data.entities.ParameterizedSymbol;

/**
 * DAO for parameterized symbols.
 */
public interface ParameterizedSymbolDAO {

    /**
     * Create a new parameterized symbol.
     *
     * @param projectId
     *         The ID of the project.
     * @param pSymbol
     *         The parameterized symbol to create.
     * @return The created parameterized symbol.
     */
    ParameterizedSymbol create(Long projectId, ParameterizedSymbol pSymbol);
}
