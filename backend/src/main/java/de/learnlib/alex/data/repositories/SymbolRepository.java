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

    @Transactional(readOnly = true)
    List<Symbol> findAllByIdIn(List<Long> ids);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Symbol> findAllByProject_idAndIdIn(Long projectId, List<Long> ids);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Symbol findOneByProject_IdAndName(Long projectId, String name);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Symbol> findAllByProject_Id(Long projectId);

    /**
     * Find all symbols with a given visibility level.
     *
     * @param projectId
     *         The ID of the project
     * @param hidden
     *         The visibility level to look for. true = hidden, false = visible, {false, true} = both.
     * @return The symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.hidden IN ?2")
    @Transactional(readOnly = true)
    List<Symbol> findAll(Long projectId, Boolean[] hidden);

    /**
     * Find all symbols in a symbol group.
     *
     * @param projectId
     *         The ID of the project the symbols belong to.
     * @param groupId
     *         The ID the group the symbols belong to.
     * @param hidden
     *         The visibility level to look for. true = hidden, false = visible, {false, true} = both.
     * @return The symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.project.id = ?1"
            + "      AND s.group.id = ?2"
            + "      AND s.hidden IN ?3")
    @Transactional(readOnly = true)
    List<Symbol> findAll(Long projectId, Long groupId, Boolean[] hidden);

}
