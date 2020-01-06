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

import de.learnlib.alex.data.entities.ProjectUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** The repository for project URLs. */
@Repository
public interface ProjectUrlRepository extends JpaRepository<ProjectUrl, Long> {

    @Transactional
    void deleteByEnvironment_IdAndName(Long environmentId, String name);

    @Transactional(readOnly = true)
    ProjectUrl findByEnvironment_IdAndNameAndIdNot(Long environmentId, String name, Long urlId);

    @Transactional(readOnly = true)
    ProjectUrl findByEnvironment_IdAndName(Long environmentId, String name);

    @Transactional(readOnly = true)
    List<ProjectUrl> findByEnvironment_Project_IdAndIsDefault(Long projectId, boolean isDefault);

    @Transactional(readOnly = true)
    List<ProjectUrl> findByEnvironment_Project_IdAndName(Long projectId, String name);
}
