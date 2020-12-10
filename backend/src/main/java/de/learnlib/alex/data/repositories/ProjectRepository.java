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

import de.learnlib.alex.data.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    @Query(value =  "select p from Project p where " +
                    "       p in (select p from Project p Join p.owners o where o.id = :id)" +
                    "    or p in (select p from Project p Join p.members m where m.id = :id)")
    List<Project> findAllByUser_Id(@Param("id") Long userId);

    @Query(value =  "select p from Project p where " +
                    "       p in (select p from Project p Join p.owners o where o.id = :id and p.name = :name)" +
                    "    or p in (select p from Project p Join p.members m where m.id = :id and p.name = :name)")
    Project findByUser_IdAndName(@Param("id") Long userId, @Param("name") String name);

    @Query(value =  "select p from Project p where " +
                    "       p in (select p from Project p Join p.owners o where o.id = :id and p.name = :name and p.id <> :projectId)" +
                    "    or p in (select p from Project p Join p.members m where m.id = :id and p.name = :name and p.id <> :projectId)")
    Project findByUser_IdAndNameAndIdNot(@Param("id") Long userId, @Param("name") String name, @Param("projectId") Long projectId);
}
