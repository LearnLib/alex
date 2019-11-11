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

import de.learnlib.alex.data.entities.ProjectEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProjectEnvironmentRepository extends JpaRepository<ProjectEnvironment, Long> {

    @Transactional(readOnly = true)
    List<ProjectEnvironment> findAllByProject_Id(Long projectId);

    @Transactional(readOnly = true)
    ProjectEnvironment findByProject_IdAndNameAndIdNot(Long projectId, String name, Long envId);

    @Transactional(readOnly = true)
    ProjectEnvironment findByProject_IdAndName(Long projectId, String name);

    @Transactional(readOnly = true)
    @Query(nativeQuery = true, value = "select * from PUBLIC.project_environment where project_id = ? and is_default = ? limit 1")
    ProjectEnvironment findByProject_IdAndIs_Default(Long projectId, Boolean isDefault);

    @Transactional(readOnly = true)
    List<ProjectEnvironment> findAllByIdIn(List<Long> ids);
}
