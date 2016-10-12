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

package de.learnlib.alex.core.repositories;

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository to persist Symbols.
 */
@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {

    /**
     * Find all revisions of a Symbol.
     *
     * @param userId
     *         The ID the User the Symbol belong to.
     * @param projectId
     *         The ID the Project the Symbol belong to.
     * @param id
     *         The ID of the Symbol.
     * @return The requested Symbol with all its revisions.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.idRevisionPair.id = ?3")
    List<Symbol> findOne(Long userId, Long projectId, Long id);

    /**
     * Find a Symbol with a given ID and revision.
     *
     * @param userId
     *         The ID the User the Symbol belong to.
     * @param projectId
     *         The ID the Project the Symbol belong to.
     * @param id
     *         The ID of the Symbol.
     * @param revision
     *         The revision of the Symbol.
     * @return The Symbol or null.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.idRevisionPair.id = ?3"
            + "      AND s.idRevisionPair.revision = ?4")
    Symbol findOne(Long userId, Long projectId, Long id, Long revision);

    /**
     * Find all Symbol with given ID and revision pairs.
     *
     * @param userId
     *         The ID the User the Symbols belong to.
     * @param projectId
     *         The ID the Project the Symbol belong to.
     * @param idRevisionPairs
     *         The ID and revision to look for.
     * @return The Symbols.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.idRevisionPair IN ?3 "
            + "ORDER BY s.idRevisionPair.id ASC, s.idRevisionPair.revision ASC")
    List<Symbol> findAll(Long userId, Long projectId, List<IdRevisionPair> idRevisionPairs);

    /**
     * Get symbols of a user and project with a specific name.
     *
     * @param userId
     *      The ID of the user the symbols belong to.
     * @param projectId
     *      The ID of the project the symbol belongs to.
     * @param name
     *      The name of the Symbol.
     * @return The symbols.
     */
    @Query("SELECT COUNT(s) "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?2"
            + "      AND NOT s.idRevisionPair.id = ?1"
            + "      AND s.project.id = ?3"
            + "      AND ((s.name = ?4) OR (s.abbreviation =?5))")
    Long countSymbolsWithSameNameOrAbbreviation(Long symbolId, Long userId, Long projectId, String name,
                                                   String abbreviation);

    /**
     * Find all highest / latest revisions of Symbols.
     *
     * @param userId
     *         The ID the User the Symbols belong to.
     * @param projectId
     *         The ID the Project the Symbols belong to.
     * @param hidden
     *         The visibility level to look for. true = hidden, false = visible, {false, true} = both.
     * @return The Symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.hidden IN ?3"
            + "      AND s.idRevisionPair.revision = (SELECT MAX(s_.idRevisionPair.revision)"
            + "                                       FROM  Symbol s_"
            + "                                       WHERE s_.user.id = ?1"
            + "                                             AND s_.project.id = ?2"
            + "                                             AND s.hidden IN ?3"
            + "                                             AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Boolean[] hidden);

    /**
     * Find all highest / latest revisions of Symbols in a SymbolGroup.
     *
     * @param userId
     *         The ID the User the Symbols belong to.
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
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.group.id = ?3"
            + "      AND s.hidden IN ?4"
            + "      AND s.idRevisionPair.revision = (SELECT MAX(s_.idRevisionPair.revision)"
            + "                                       FROM  Symbol s_"
            + "                                       WHERE s_.user.id = ?1"
            + "                                             AND s_.project.id = ?2"
            + "                                             AND s.group.id = ?3"
            + "                                             AND s.hidden IN ?4"
            + "                                             AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Long groupId, Boolean[] hidden);

    /**
     * Find all highest / latest revisions of Symbols by their IDs.
     *
     * @param userId
     *         The ID the User the Symbols belong to.
     * @param projectId
     *         The ID the Project the Symbols belong to.
     * @param ids
     *         The IDs to look for.
     * @return The Symbols that matched the criteria.
     */
    @Query("SELECT s "
            + "FROM  Symbol s "
            + "WHERE s.user.id = ?1"
            + "      AND s.project.id = ?2"
            + "      AND s.idRevisionPair.id IN ?3"
            + "      AND s.idRevisionPair.revision = (SELECT MAX(s_.idRevisionPair.revision)"
            + "                                       FROM  Symbol s_"
            + "                                       WHERE s_.user = ?1 "
            + "                                             AND s_.project = ?2"
            + "                                             AND s.idRevisionPair.id IN ?3"
            + "                                             AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Long... ids);

}
