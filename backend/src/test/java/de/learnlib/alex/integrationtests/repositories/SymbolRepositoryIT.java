/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import org.junit.After;
import org.junit.Ignore;
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
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

@Ignore
public class SymbolRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private UserRepository userRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SymbolGroupRepository symbolGroupRepository;

    @Inject
    private SymbolRepository symbolRepository;

    @After
    public void tearDown() {
        // deleting the user should (!) also delete all projects, groups, symbols, ... related to that user.
        userRepository.deleteAll();
    }

    @Test
    public void shouldSaveAValidSymbol() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol = createSymbol(user, project, group, 0L, "Test Symbol");

        symbol = symbolRepository.save(symbol);

        assertNotNull(symbol.getUUID());
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithoutAnUser() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol = createSymbol(null, project, group, 0L, "Test Symbol");

        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithoutAProject() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol = createSymbol(user, null, group, 0L, "Test Symbol");

        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithoutAGroup() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        Symbol symbol = createSymbol(user, project, null, 0L, "Test Symbol");

        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = TransactionSystemException.class)
    public void shouldFailToSaveASymbolWithoutAName() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol = createSymbol(user, project, group, 0L, null);

        symbolRepository.save(symbol); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveASymbolWithADuplicateIDRevisionPair() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol1 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1);
        //
        Symbol symbol2 = createSymbol(user, project, group, 0L, "Test Symbol 2");

        symbolRepository.save(symbol2); // should fail
    }


    @Test(expected = DataIntegrityViolationException.class)
    public void shouldSaveSymbolsWithADuplicateIdRevisionPairInDifferentGroups() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group1 = createGroup(user, project, 1L, "Test Group 1");
        group1 = symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(user, project, 2L, "Test Group 2");
        group2 = symbolGroupRepository.save(group2);
        //
        Symbol symbol1 = createSymbol(user, project, group1, 0L, "Test Symbol");
        symbolRepository.save(symbol1);
        Symbol symbol2 = createSymbol(user, project, group2, 0L, "Test Symbol");

        symbolRepository.save(symbol2);

        assertNotNull(symbol2.getUUID());
    }

    @Test
    public void shouldFetchOneSymbolById() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol1rev0 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev0);
        Symbol symbol1rev1 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev1);
        Symbol symbol2rev0 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev0);
        Symbol symbol2rev1 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev1);

        Symbol symbolFromDB = symbolRepository.findOne(project.getId(), 0L);

        assertThat(symbolFromDB, is(equalTo(symbol1rev0)));
    }

    @Test
    public void shouldFetchSymbolsByIds() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol1rev0 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev0);
        Symbol symbol1rev1 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev1);
        Symbol symbol2rev0 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev0);
        Symbol symbol2rev1 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev1);
        //
        List<Long> ids = Arrays.asList(symbol1rev0.getId(), symbol2rev1.getId());
        List<Symbol> symbolsFromDB = symbolRepository.findByIds(project.getId(), ids);

        assertThat(symbolsFromDB.size(), is(equalTo(2)));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol1rev0)));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol1rev1))));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol2rev0))));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol2rev1)));
    }

    @Test
    public void shouldFetchSymbolsWithHighestRevisions() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol1rev0 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev0);
        Symbol symbol1rev1 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev1);
        Symbol symbol2rev0 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev0);
        Symbol symbol2rev1 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev1);

        List<Symbol> symbolsFromDB = symbolRepository.findAll(user.getId(), project.getId(),
                                                              new Boolean[] {false, true});

        assertThat(symbolsFromDB.size(), is(equalTo(2)));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol1rev0))));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol1rev1)));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol2rev0))));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol2rev1)));
    }

    @Test
    public void shouldFetchSymbolsWithHighestRevisions2() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);
        //
        Symbol symbol1rev0 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev0);
        Symbol symbol1rev1 = createSymbol(user, project, group, 0L, "Test Symbol 1");
        symbolRepository.save(symbol1rev1);
        Symbol symbol2rev0 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev0);
        Symbol symbol2rev1 = createSymbol(user, project, group, 1L, "Test Symbol 2");
        symbolRepository.save(symbol2rev1);

        List<Symbol> symbolsFromDB = symbolRepository.findAll(project.getId(), group.getId(),
                                                              new Boolean[] {false, true});

        assertThat(symbolsFromDB.size(), is(equalTo(2)));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol1rev0))));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol1rev1)));
        assertThat(symbolsFromDB, not(hasItem(equalTo(symbol2rev0))));
        assertThat(symbolsFromDB, hasItem(equalTo(symbol2rev1)));
    }

    private Symbol createSymbol(User user, Project project, SymbolGroup group, Long id, String name) {
        Symbol symbol = new Symbol();
        symbol.setProject(project);
        symbol.setId(id);
        symbol.setGroup(group);
        symbol.setName(name);
        return symbol;
    }
}
