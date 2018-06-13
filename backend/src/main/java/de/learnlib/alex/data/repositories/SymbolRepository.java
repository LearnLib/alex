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

package de.learnlib.alex.data.repositories;

import de.learnlib.alex.data.entities.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository to persist Symbols.
 */
@Repository
public interface SymbolRepository extends JpaRepository<Symbol, UUID> {

    /**
     * Find a symbol with a given id.
     *
     * @param projectId
     *         The ID the Project the Symbol belong to.
     * @param id
     *         The ID of the Symbol.
     * @return The requested Symbol.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.id = ?2")
    Symbol findOne(Long projectId, Long id);

    /**
     * Find all Symbol with given IDs.
     *
     * @param projectId
     *         The ID the Project the Symbol belong to.
     * @param ids
     *         The ID to look for.
     * @return The Symbols.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.id IN ?2 "
            + "ORDER BY s.id ASC")
    List<Symbol> findByIds(Long projectId, List<Long> ids);

    /**
     * Get symbols of a user and project with a specific name.
     *
     * @param projectId
     *      The ID of the project the symbol belongs to.
     * @param name
     *      The name of the symbol.
     * @return The symbols.
     */
    @Query("SELECT s FROM Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.name = ?2")
    Symbol getSymbolByName(Long projectId, String name);

    /**
     * Find all symbols.
     *
     * @param projectId
     *         The ID the Project the Symbols belong to.
     * @param hidden
     *         The visibility level to look for. true = hidden, false = visible, {false, true} = both.
     * @return The Symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.hidden IN ?2")
    List<Symbol> findAll(Long projectId, Boolean[] hidden);

    /**
     * Find all symbols in a symbol group.
     *
     * @param projectId
     *         The ID the Project the Symbols belong to.
     * @param groupId
     *         The ID the SymbolGroup the Symbols belong to.
     * @param hidden
     *         The visibility level to look for. true = hidden, false = visible, {false, true} = both.
     * @return The Symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.group.id = ?2"
            + "      AND s.hidden IN ?3")
    List<Symbol> findAll(Long projectId, Long groupId, Boolean[] hidden);

}
