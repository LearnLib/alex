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

import de.learnlib.alex.data.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository to persist Projects.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Find all projects of an User.
     *
     * @param userId
     *         The ID the User the Projects belongs to.
     * @return The Projects of the User.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Project> findAllByUser_Id(Long userId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Project findByUser_IdAndName(Long userId, String name);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Project findByUser_IdAndNameAndIdNot(Long userId, String name, Long projectId);
}
