/*
 * Copyright 2015 - 2020 TU Dortmund
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

import de.learnlib.alex.data.entities.SymbolAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * The repository for symbol actions.
 */
@Repository
public interface SymbolActionRepository extends JpaRepository<SymbolAction, Long> {

    /**
     * Delete all actions by a symbol ID.
     *
     * @param symbolId
     *         The ID of the symbol.
     */
    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    void deleteAllBySymbol_Id(Long symbolId);

    /**
     * Delete all actions by a project ID.
     *
     * @param projectId
     *         The ID of the project.
     */
    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    void deleteAllBySymbol_Project_Id(Long projectId);

    @Query("SELECT a FROM  SymbolAction a WHERE a.symbol.project.id = ?1 AND BASE_URL = ?2 AND (TYPE = 'web_goto' OR TYPE = 'rest_call')")
    @Transactional(readOnly = true)
    List<SymbolAction> findAllWithBaseUrl(Long projectId, String baseUrl);
}
