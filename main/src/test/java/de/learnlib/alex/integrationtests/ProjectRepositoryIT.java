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

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import org.junit.After;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class ProjectRepositoryIT extends AbstractRepositoryIT {

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
    public void shouldSaveAValidProject() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");

        project = projectRepository.save(project);

        assertTrue(project.getId() > 0L);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAProjectWithoutAnUser() {
        Project project = new Project();
        project.setName("Test Project");
        project.setBaseUrl("http://localhost");

        projectRepository.save(project); // should fail
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldFailToSaveAProjectWithoutAName() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = new Project();
        project.setUser(user);
        project.setBaseUrl("http://localhost");

        projectRepository.save(project); // should fail
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldFailToSaveAProjectWithoutABaseURL() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = new Project();
        project.setUser(user);
        project.setName("Test Project");

        projectRepository.save(project); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAProjectsWithADuplicateNamesForOneUser() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project1 = createProject(user, "Test Project");
        projectRepository.save(project1);
        Project project2 = createProject(user, "Test Project");

        projectRepository.save(project2); // should fail
    }

    @Test
    public void shouldSaveAProjectsWithADuplicateNameForMultipleUsers() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        User otherUser = createUser("foo@test.example");
        otherUser = userRepository.save(otherUser);
        //
        Project project = createProject(user, "Test Project");
        projectRepository.save(project);
        Project otherProject = createProject(otherUser, "Test Project");

        otherProject = projectRepository.save(otherProject);

        assertTrue(otherProject.getId() > 0L);
    }

    @Test
    public void shouldFetchAllProjectsOfAUser() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        User otherUser = createUser("foo2@test.example");
        otherUser = userRepository.save(otherUser);
        //
        Project project1 = createProject(user, "Test Project 1");
        project1 = projectRepository.save(project1);
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);
        Project project3 = createProject(otherUser, "Test Project 3");
        projectRepository.save(project3);

        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());

        assertThat(projects.size(), is(equalTo(2)));
        assertThat(projects, hasItem(equalTo(project1)));
        assertThat(projects, hasItem(equalTo(project2)));
    }

    @Test
    public void shouldReturnEmptyListWhenFetchingAllProjectsOfAUserWhoHasNone() {
        User user = createUser("alex@test.example");
        userRepository.save(user);

        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());

        assertThat(projects, is(equalTo(Collections.EMPTY_LIST)));
    }

    @Test
    public void shouldFetchAProjectsOfAUserByItsID() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        Project projectFromDB = projectRepository.findOneByUser_IdAndId(user.getId(), project.getId());

        assertThat(projectFromDB, is(equalTo(project)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingProjectOfAUserByItsID() {
        User user = createUser("alex@test.example");
        userRepository.save(user);

        Project projectFromDB = projectRepository.findOneByUser_IdAndId(user.getId(), -1L);

        assertNull(projectFromDB);
    }

    @Test
    public void shouldFetchAProjectsOfAUserByItsName() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        Project projectFromDB = projectRepository.findOneByUser_IdAndName(user.getId(), project.getName());

        assertThat(projectFromDB, is(equalTo(project)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingProjectsOfAUserByItsName() {
        User user = createUser("alex@test.example");
        userRepository.save(user);

        Project projectFromDB = projectRepository.findOneByUser_IdAndId(user.getId(), null);

        assertNull(projectFromDB);
    }

    @Test
    public void shouldDeleteAProject() {
        User user = createUser("alex@test.example");
        userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        assertThat(symbolGroupRepository.count(), is(equalTo(1L)));
        assertTrue(project.getDefaultGroup().getGroupId() > 0);

        projectRepository.delete(project);

        assertThat(projectRepository.count(), is(equalTo(0L)));
        assertThat(symbolGroupRepository.count(), is(equalTo(0L)));
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingProject() {
        projectRepository.delete(-1L);
    }
}
