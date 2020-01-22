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

package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.List;

import static de.learnlib.alex.integrationtests.repositories.SymbolGroupRepositoryIT.createGroup;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class SymbolRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private SymbolGroupRepository symbolGroupRepository;

    @Inject
    private SymbolRepository symbolRepository;

    private Project project;

    @Before
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

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithoutAProject() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol symbol = createSymbol(null, group, 0L, "Test Symbol");
        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithoutAGroup() {
        Symbol symbol = createSymbol(project, null, 0L, "Test Symbol");
        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = TransactionSystemException.class)
    public void shouldFailToSaveASymbolWithoutAName() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        Symbol symbol = createSymbol(project, group, 0L, null);
        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldSaveSymbolsWithADuplicateIdRevisionPairInDifferentGroups() {
        SymbolGroup group1 = createGroup(project, 1L, "Test Group 1");
        group1 = symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(project, 2L, "Test Group 2");
        group2 = symbolGroupRepository.save(group2);

        Symbol symbol1 = createSymbol(project, group1, 0L, "Test Symbol");
        symbolRepository.save(symbol1);
        Symbol symbol2 = createSymbol(project, group2, 0L, "Test Symbol");
        symbol2 = symbolRepository.save(symbol2);

        assertNotNull(symbol2.getId());
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

        assertThat(symbolFromDB, is(equalTo(s1)));
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

        assertThat(symbolsFromDB.size(), is(equalTo(2)));
        assertThat(symbolsFromDB, hasItem(equalTo(s1)));
        assertThat(symbolsFromDB, hasItem(equalTo(s2)));
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
