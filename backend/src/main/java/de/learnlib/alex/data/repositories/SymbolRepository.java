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

package de.learnlib.alex.data.repositories;

import de.learnlib.alex.data.entities.Symbol;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository to persist Symbols.
 */
@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {

    List<Symbol> findAllByIdIn(List<Long> ids);

    List<Symbol> findAllByProject_idAndIdIn(Long projectId, List<Long> ids);

    Symbol findOneByProject_IdAndName(Long projectId, String name);

    List<Symbol> findAllByProject_Id(Long projectId);
}
