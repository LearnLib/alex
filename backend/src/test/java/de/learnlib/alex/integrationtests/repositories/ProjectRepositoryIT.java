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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.transaction.TransactionSystemException;

import javax.inject.Inject;
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
    private SymbolGroupRepository symbolGroupRepository;

    private User user;

    @Before
    public void before() {
        User user = createUser("alex@test.example");
        this.user = userRepository.save(user);
    }

    @Test
    public void shouldSaveAValidProject() {
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        assertTrue(project.getId() > 0L);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAProjectWithoutAnUser() {
        ProjectUrl url = new ProjectUrl();
        url.setUrl("http://localhost");
        url.setDefault(true);

        Project project = new Project();
        project.setName("Test Project");
        project.getUrls().add(url);

        projectRepository.save(project); // should fail
    }

    @Test(expected = TransactionSystemException.class)
    public void shouldFailToSaveAProjectWithoutAName() {
        ProjectUrl url = new ProjectUrl();
        url.setUrl("http://localhost");
        url.setDefault(true);

        Project project = new Project();
        project.setUser(user);
        project.getUrls().add(url);

        projectRepository.save(project); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveAProjectsWithADuplicateNamesForOneUser() {
        Project project1 = createProject(user, "Test Project");
        projectRepository.save(project1);
        Project project2 = createProject(user, "Test Project");
        projectRepository.save(project2); // should fail
    }

    @Test
    public void shouldSaveAProjectsWithADuplicateNameForMultipleUsers() {
        User otherUser = createUser("foo@test.example");
        otherUser = userRepository.save(otherUser);

        Project project = createProject(user, "Test Project");
        projectRepository.save(project);
        Project otherProject = createProject(otherUser, "Test Project");

        otherProject = projectRepository.save(otherProject);

        assertTrue(otherProject.getId() > 0L);
    }

    @Test
    public void shouldFetchAllProjectsOfAUser() {
        User otherUser = createUser("foo2@test.example");
        otherUser = userRepository.save(otherUser);

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
        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());

        assertThat(projects, is(equalTo(Collections.EMPTY_LIST)));
    }

    @Test
    public void shouldFetchAProjectOfAUserByItsID() {
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        Project projectFromDB = projectRepository.findById(project.getId()).orElse(null);

        assertThat(projectFromDB, is(equalTo(project)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingProjectOfAUserByItsID() {
        Project projectFromDB = projectRepository.findById(-1L).orElse(null);

        assertNull(projectFromDB);
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingProjectsOfAUserByItsName() {
        Project projectFromDB = projectRepository.findById(-1L).orElse(null);

        assertNull(projectFromDB);
    }

    @Test
    public void shouldDeleteAProject() {
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);

        assertThat(symbolGroupRepository.count(), is(equalTo(1L)));

        projectRepository.delete(project);

        assertThat(projectRepository.count(), is(equalTo(0L)));
        assertThat(symbolGroupRepository.count(), is(equalTo(0L)));
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingProject() {
        projectRepository.deleteById(-1L);
    }
}
