/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.integrationtests.repositories;

import static de.learnlib.alex.integrationtests.repositories.SymbolGroupRepositoryIT.createGroup;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import java.util.Arrays;
import java.util.List;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

public class SymbolRepositoryIT extends AbstractRepositoryIT {

    @Autowired
    private SymbolGroupRepository symbolGroupRepository;

    @Autowired
    private SymbolRepository symbolRepository;

    private Project project;

    @BeforeEach
    public void before() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);

        Project project = createProject(user, "Test Project 1");
        this.project = projectRepository.save(project);
    }

    @Test
    public void shouldSaveAValidSymbol() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol symbol = createSymbol(project, group, 0L, "Test Symbol");
        symbol = symbolRepository.save(symbol);

        assertNotNull(symbol.getId());
    }

    @Test
    public void shouldFailToSaveASymbolWithoutAProject() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol symbol = createSymbol(null, group, 0L, "Test Symbol");
        assertThrows(DataIntegrityViolationException.class, () -> symbolRepository.save(symbol));
    }

    @Test
    public void shouldFailToSaveASymbolWithoutAGroup() {
        Symbol symbol = createSymbol(project, null, 0L, "Test Symbol");
        assertThrows(DataIntegrityViolationException.class, () -> symbolRepository.save(symbol));
    }

    @Test
    public void shouldFailToSaveASymbolWithoutAName() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol symbol = createSymbol(project, group, 0L, null);
        assertThrows(ValidationException.class, () -> symbolRepository.save(symbol));
    }

    @Test
    public void shouldFetchOneSymbolById() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol s1 = createSymbol(project, group, null, "Test Symbol 1");
        s1 = symbolRepository.save(s1);
        Symbol s2 = createSymbol(project, group, null, "Test Symbol 2");
        symbolRepository.save(s2);

        Symbol symbolFromDB = symbolRepository.findById(s1.getId()).orElse(null);

        assertEquals(s1, symbolFromDB);
    }

    @Test
    public void shouldFetchSymbolsByIds() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol s1 = createSymbol(project, group, null, "Test Symbol 1");
        s1 = symbolRepository.save(s1);
        Symbol s2 = createSymbol(project, group, null, "Test Symbol 2");
        s2 = symbolRepository.save(s2);

        List<Symbol> symbolsFromDB = symbolRepository.findAllByIdIn(Arrays.asList(s1.getId(), s2.getId()));

        assertEquals(2, symbolsFromDB.size());
        assertTrue(symbolsFromDB.contains(s1));
        assertTrue(symbolsFromDB.contains(s2));
    }

    private Symbol createSymbol(Project project, SymbolGroup group, Long id, String name) {
        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setId(id);
        symbol.setGroup(group);
        symbol.setName(name);
        return symbol;
    }
}
