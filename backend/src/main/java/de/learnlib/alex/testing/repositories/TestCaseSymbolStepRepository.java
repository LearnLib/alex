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

package de.learnlib.alex.testing.repositories;

import de.learnlib.alex.testing.entities.TestCaseSymbolStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** Repository for symbol steps of a test case. */
@Repository
public interface TestCaseSymbolStepRepository extends JpaRepository<TestCaseSymbolStep, UUID> {

    /**
     * Get all test case steps that use a certain symbol.
     *
     * @param symbolId
     *         The id of the symbol.
     * @return The list of steps that use the symbol.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<TestCaseSymbolStep> findAllBySymbol_Id(Long symbolId);
}
