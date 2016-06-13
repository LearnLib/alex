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

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CounterRepository extends JpaRepository<Counter, Long> {

    @Transactional(readOnly = true)
    List<Counter> findByUser_IdAndProject(Long userId, Project project);

    @Transactional(readOnly = true)
    List<Counter> findAllByUser_IdAndProjectAndNameIn(Long userId, Project project, String... name);

    @Transactional(readOnly = true)
    Counter findByUser_IdAndProjectAndName(Long userId, Project project, String name);

}
