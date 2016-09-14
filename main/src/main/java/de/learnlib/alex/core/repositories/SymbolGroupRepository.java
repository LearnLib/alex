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

import de.learnlib.alex.core.entities.SymbolGroup;
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
     * @param userId
     *         The ID the User the SymbolGroup belongs to.
     * @param projectId
     *         The ID the User the SymbolGroup belongs to.
     * @return The SymbolGroups.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<SymbolGroup> findAllByUser_IdAndProject_Id(Long userId, Long projectId);

    /**
     * Find a SymbolGroup.
     *
     * @param userId
     *         The ID the User the SymbolGroup belongs to.
     * @param projectId
     *         The ID the User the SymbolGroup belongs to.
     * @param id
     *         The ID of the Project within the Project space.
     * @return The SymbolGroup or null.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    SymbolGroup findOneByUser_IdAndProject_IdAndId(Long userId, Long projectId, Long id);

}
