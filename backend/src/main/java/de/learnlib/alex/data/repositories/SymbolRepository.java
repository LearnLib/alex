/*
 * Copyright 2015 - 2019 TU Dortmund
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository to persist Symbols.
 */
@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {

    /**
     * Find all Symbol with given IDs.
     *
     * @param ids
     *         The ID to look for.
     * @return The Symbols.
     */
    @Transactional(readOnly = true)
    List<Symbol> findAllByIdIn(List<Long> ids);

    /**
     * Find a symbol by a specific name in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @param name
     *         The name of the symbol.
     * @return The symbol with that name.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Symbol findOneByProject_IdAndName(Long projectId, String name);

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
    @Transactional(readOnly = true)
    List<Symbol> findAll(Long projectId, Boolean[] hidden);

    /**
     * Final all symbols in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @return The symbols in the project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Symbol> findAllByProject_Id(Long projectId);

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
    @Transactional(readOnly = true)
    List<Symbol> findAll(Long projectId, Long groupId, Boolean[] hidden);

}
