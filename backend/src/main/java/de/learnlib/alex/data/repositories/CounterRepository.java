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

package de.learnlib.alex.data.repositories;

import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Repository to persist Counters.
 */
@Repository
public interface CounterRepository extends JpaRepository<Counter, UUID> {

    /**
     * Find all counters in a Project of an User.
     *
     * @param project
     *         The ID the Project the Counter belongs to.
     * @return The Counters in the Project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Counter> findAllByProject(Project project);

    /**
     * Find all counters by their names in a Project of an User.
     *
     * @param project
     *         The ID the Project the Counters belongs to.
     * @param name
     *         The names of the Counters.
     * @return The Counters with the given name in the given Project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<Counter> findAllByProjectAndNameIn(Project project, String... name);

    /**
     * Find a Counter by its name.
     *
     * @param project
     *         The ID the Project the Counters belongs to.
     * @param name
     *         The names of the Counter.
     * @return The Counter or null.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Counter findByProjectAndName(Project project, String name);

}
