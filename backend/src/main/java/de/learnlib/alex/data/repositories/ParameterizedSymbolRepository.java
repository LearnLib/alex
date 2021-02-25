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

package de.learnlib.alex.data.repositories;

import de.learnlib.alex.data.entities.ParameterizedSymbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The JPA repository for parameterized symbols {@link ParameterizedSymbol}.
 */
@Repository
public interface ParameterizedSymbolRepository extends JpaRepository<ParameterizedSymbol, Long> {

    /**
     * Get all parameterized symbols by symbol ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     * @return The parameterized symbols.
     */
    List<ParameterizedSymbol> findAllBySymbol_Id(Long symbolId);

    /**
     * Count all by symbol ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     * @return The count.
     */
    Long countAllBySymbol_Id(Long symbolId);

    /**
     * Delete all parameterized symbols by project ID.
     *
     * @param projectId
     *         The ID of the project.
     * @return The number of deleted parameterized symbols.
     */
    Long deleteAllBySymbol_Project_Id(Long projectId);
}
