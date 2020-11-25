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
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertTrue;

public class SymbolGroupRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private SymbolGroupRepository symbolGroupRepository;

    private User user;

    private Project project;

    @Before
    public void before() {
        User user = createUser("alex@test.example");
        this.user = userRepository.save(user);

        Project project = createProject(user, "Test Project 1");
        this.project = projectRepository.save(project);
    }

    @Test
    public void shouldSaveAValidGroup() {
        SymbolGroup group = createGroup(project, 1L, "Test Group");
        group = symbolGroupRepository.save(group);

        assertTrue(group.getId() > 0L);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupWithoutAProject() {
        SymbolGroup group = new SymbolGroup();
        group.setId(1L);
        group.setName("Test Group");

        project.getGroups().add(group);

        symbolGroupRepository.save(group); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailToSaveAGroupWithoutAName() {
        SymbolGroup group = new SymbolGroup();
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(1L);

        symbolGroupRepository.save(group); // should fail
    }

    @Test
    public void shouldSaveGroupsWithADuplicateIDsInDifferentProjects() {
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);

        SymbolGroup group1 = createGroup(project, 1L, "Test Group 1");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(project2, 1L, "Test Group 2");
        group2 = symbolGroupRepository.save(group2);

        assertTrue(group2.getId() > 0L);
    }

    @Test
    public void shouldSaveGroupsWithADuplicateNamesInDifferentProjects() {
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);

        SymbolGroup group1 = createGroup(project, 1L, "Test Group");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(project2, 1L, "Test Group");

        group2 = symbolGroupRepository.save(group2);

        assertTrue(group2.getId() > 0L);
    }

    @Test
    public void shouldFetchAllGroupsOfAProject() {
        SymbolGroup group1 = createGroup(project, null, "Test Group 1");
        group1 = symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(project, null, "Test Group 2");
        group2 = symbolGroupRepository.save(group2);

        List<SymbolGroup> groups = symbolGroupRepository.findAllByProject_Id(project.getId());

        assertThat(groups.size(), is(equalTo(3))); // our 2 + 1 default group
        assertThat(groups, hasItem(equalTo(group1)));
        assertThat(groups, hasItem(equalTo(group2)));
    }

    @Test
    public void shouldFetchAGroupOfAProjectByItsID() {
        SymbolGroup group = createGroup(project, null, "Test Group 1");
        group = symbolGroupRepository.save(group);

        SymbolGroup groupFromDB = symbolGroupRepository.findById(group.getId()).orElse(null);

        assertThat(groupFromDB.getProject(), is(equalTo(project)));
        assertThat(groupFromDB.getId(), is(equalTo(group.getId())));
    }

    @Test
    public void shouldDeleteAGroup() {
        SymbolGroup group = createGroup(project, 1L, "Test Group 1");
        group = symbolGroupRepository.save(group);

        symbolGroupRepository.delete(group);

        assertThat(symbolGroupRepository.count(), is(equalTo(1L))); // only default group left
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingGroup() {
        symbolGroupRepository.deleteById(55L); // random uuid
    }

    static SymbolGroup createGroup(Project project, Long id, String name) {
        SymbolGroup group = new SymbolGroup();
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(id);
        group.setName(name);
        return group;
    }

}
