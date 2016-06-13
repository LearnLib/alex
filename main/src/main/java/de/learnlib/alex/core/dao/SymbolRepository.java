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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {

    @Query("SELECT s FROM Symbol s WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.idRevisionPair.id = ?3")
    List<Symbol> findOne(Long userId, Long projectId, Long id);

    @Query("SELECT s FROM Symbol s WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.idRevisionPair.id = ?3 AND s.idRevisionPair.revision = ?4")
    Symbol findOne(Long userId, Long projectId, Long id, Long revision);

    @Query("SELECT s FROM Symbol s"
            + " WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.idRevisionPair IN ?3"
            + " ORDER BY s.idRevisionPair.id ASC, s.idRevisionPair.revision ASC")
    List<Symbol> findAll(Long userId, Long projectId, List<IdRevisionPair> idRevisionPairs);

    @Query("SELECT s"
            + " FROM  Symbol s"
            + " WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.hidden IN ?3 AND s.idRevisionPair.revision ="
            + "       (SELECT MAX(s_.idRevisionPair.revision)"
            + "          FROM Symbol s_"
            + "         WHERE s_.user.id = ?1 AND s_.project.id = ?2 AND s.hidden IN ?3 AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Boolean[] hidden);

    @Query("SELECT s"
            + " FROM  Symbol s"
            + " WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.group.id = ?3 AND s.hidden IN ?4 AND s.idRevisionPair.revision ="
            + "       (SELECT MAX(s_.idRevisionPair.revision)"
            + "          FROM Symbol s_"
            + "         WHERE s_.user.id = ?1 AND s_.project.id = ?2 AND s.group.id = ?3 AND s.hidden IN ?4  AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Long groupId, Boolean[] hidden);

    @Query("SELECT s"
            + " FROM  Symbol s"
            + " WHERE s.user.id = ?1 AND s.project.id = ?2 AND s.idRevisionPair.id IN ?3 AND s.idRevisionPair.revision ="
            + "       (SELECT MAX(s_.idRevisionPair.revision)"
            + "          FROM Symbol s_"
            + "         WHERE s_.user = ?1 AND s_.project = ?2 AND s.idRevisionPair.id IN ?3 AND s_.idRevisionPair.id = s.idRevisionPair.id)")
    List<Symbol> findAllWithHighestRevision(Long userId, Long projectId, Long... ids);

}
