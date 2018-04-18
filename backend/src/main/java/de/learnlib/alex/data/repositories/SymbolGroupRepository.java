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

import de.learnlib.alex.data.entities.SymbolGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository to persist SymbolGroups.
 */
@Repository
public interface SymbolGroupRepository extends JpaRepository<SymbolGroup, Long> {

    /**
     * Find all SymbolGroups in a Project.
     *
     * @param projectId
     *         The ID the User the SymbolGroup belongs to.
     * @return The SymbolGroups.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<SymbolGroup> findAllByProject_Id(Long projectId);

    /**
     * Find a symbol group by its name.
     *
     * @param projectId
     *         The ID the project the symbol group belongs to.
     * @param name
     *         The name of the symbol group in the project.
     * @return The SymbolGroup or null.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    SymbolGroup findOneByProject_IdAndName(Long projectId, String name);

    /**
     * Get the default group of the project which is the one that is created during the project creation.
     *
     * @param projectId
     *         The id of the project.
     * @return The default symbol group.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    SymbolGroup findFirstByProject_IdOrderByIdAsc(Long projectId);
}
