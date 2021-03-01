/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.modelchecking.repositories;

import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LtsFormulaSuiteRepository extends JpaRepository<LtsFormulaSuite, Long> {

    List<LtsFormulaSuite> findAllByProject_Id(Long projectId);

    List<LtsFormulaSuite> findAllByProject_IdAndNameIn(Long projectId, Set<String> names);

    LtsFormulaSuite findByProject_IdAndName(Long projectId, String name);
}
