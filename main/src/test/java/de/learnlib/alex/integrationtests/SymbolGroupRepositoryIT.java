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

package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.repositories.ProjectRepository;
import de.learnlib.alex.core.repositories.SymbolGroupRepository;
import de.learnlib.alex.core.repositories.UserRepository;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import org.junit.After;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.transaction.TransactionSystemException;

import javax.inject.Inject;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class SymbolGroupRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private UserRepository userRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private SymbolGroupRepository symbolGroupRepository;

    @After
    public void tearDown() {
        // deleting the user should (!) also delete all projects, groups, symbols, ... related to that user.
        userRepository.deleteAll();
    }

    @Test
    public void shouldSaveAValidGroup() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group");

        group = symbolGroupRepository.save(group);

        assertTrue(group.getId() > 0L);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupWithoutAnUser() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = new SymbolGroup();
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(1L);
        group.setName("Test Group");

        symbolGroupRepository.save(group); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupWithoutAProject() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = new SymbolGroup();
        group.setUser(user);
        project.getGroups().add(group);
        group.setId(1L);
        group.setName("Test Group");

        symbolGroupRepository.save(group); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupWithoutAnID() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = new SymbolGroup();
        group.setUser(user);
        group.setProject(project);
        project.getGroups().add(group);
        group.setName("Test Group");

        symbolGroupRepository.save(group); // should fail
    }

    @Test(expected = TransactionSystemException.class)
    public void shouldFailToSaveAGroupWithoutAName() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = new SymbolGroup();
        group.setUser(user);
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(1L);

        symbolGroupRepository.save(group); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupsWithADuplicateIDs() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        // 0L will be already used by the default group
        SymbolGroup group1 = createGroup(user, project, 0L, "Test Group");
        System.out.println(project.getGroups().size());

        symbolGroupRepository.save(group1); // should fail
    }

    @Test
    public void shouldSaveGroupsWithADuplicateIDsInDifferentProjects() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project1 = createProject(user, "Test Project 1");
        project1 = projectRepository.save(project1);
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);
        //
        SymbolGroup group1 = createGroup(user, project1, 1L, "Test Group 1");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(user, project2, 1L, "Test Group 2");

        group2 = symbolGroupRepository.save(group2);

        assertTrue(group2.getId() > 0L);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAGroupsWithADuplicateNames() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group1 = createGroup(user, project, 1L, "Test Group");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(user, project, 2L, "Test Group");

        symbolGroupRepository.save(group2); // should fail

        System.out.println(symbolGroupRepository.findAll());
    }

    @Test
    public void shouldSaveGroupsWithADuplicateNamesInDifferentProjects() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project1 = createProject(user, "Test Project 1");
        project1 = projectRepository.save(project1);
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);
        //
        SymbolGroup group1 = createGroup(user, project1, 1L, "Test Group");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(user, project2, 1L, "Test Group");

        group2 = symbolGroupRepository.save(group2);

        assertTrue(group2.getId() > 0L);
    }

    @Test
    public void shouldFetchAllGroupsOfAProject() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group1 = createGroup(user, project, 1L, "Test Group 1");
        symbolGroupRepository.save(group1);
        SymbolGroup group2 = createGroup(user, project, 2L, "Test Group 2");
        symbolGroupRepository.save(group2);

        List<SymbolGroup> groups = symbolGroupRepository.findAllByUser_IdAndProject_Id(user.getId(), project.getId());

        assertThat(groups.size(), is(equalTo(3))); // our 2 + 1 default group
        assertThat(groups, hasItem(equalTo(group1)));
        assertThat(groups, hasItem(equalTo(group2)));
    }

    @Test
    public void shouldFetchAGroupOfAProjectByItsID() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group 1");
        symbolGroupRepository.save(group);

        SymbolGroup groupFromDB = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(user.getId(),
                                                                                           project.getId(),
                                                                                           group.getId());

        assertThat(groupFromDB.getUser(), is(equalTo(user)));
        assertThat(groupFromDB.getProject(), is(equalTo(project)));
        assertThat(groupFromDB.getId(), is(equalTo(1L)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingGroupOfAProjectByItsID() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        SymbolGroup groupFromDB = symbolGroupRepository.findOneByUser_IdAndProject_IdAndId(user.getId(),
                                                                                           project.getId(),
                                                                                           -1L);

        assertNull(groupFromDB);
    }

    @Test
    public void shouldDeleteAGroup() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        SymbolGroup group = createGroup(user, project, 1L, "Test Group 1");
        group = symbolGroupRepository.save(group);

        symbolGroupRepository.delete(group);

        assertThat(symbolGroupRepository.count(), is(equalTo(1L))); // only default group left
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingGroup() {
        symbolGroupRepository.delete(-1L);
    }


    static SymbolGroup createGroup(User user, Project project, Long id, String name) {
        SymbolGroup group = new SymbolGroup();
        group.setUser(user);
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(id);
        group.setName(name);
        return group;
    }

}
