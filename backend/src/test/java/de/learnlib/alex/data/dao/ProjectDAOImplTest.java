/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import org.hamcrest.MatcherAssert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class ProjectDAOImplTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final int TEST_PROJECT_COUNT = 3;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private FileDAOImpl fileDAO;

    @Mock
    private LearnerResultRepository learnerResultRepository;

    @Mock
    private TestReportRepository testReportRepository;

    @Mock
    private SymbolStepRepository symbolStepRepository;

    @Mock
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    @Mock
    private SymbolActionRepository symbolActionRepository;

    @Mock
    private ProjectEnvironmentDAO environmentDAO;

    @Mock
    private ProjectUrlRepository projectUrlRepository;

    private ProjectDAO projectDAO;

    private User user;

    @Before
    public void setUp() {
        projectDAO = new ProjectDAOImpl(projectRepository, learnerResultRepository, testReportRepository, fileDAO,
                parameterizedSymbolRepository, symbolStepRepository, symbolActionRepository, environmentDAO,
                projectUrlRepository);
        user = new User();
        user.setId(USER_ID);
    }

    @Test
    public void shouldGetAllProjectsOfAnUser() {
        User user = new User();
        user.setId(USER_ID);

        List<Project> projects = createProjectList();
        given(projectRepository.findAllByUser_Id(USER_ID)).willReturn(projects);

        List<Project> allProjects = projectDAO.getAll(user);

        MatcherAssert.assertThat(allProjects.size(), is(equalTo(projects.size())));
        for (Project p : allProjects) {
            assertTrue(projects.contains(p));
        }
    }

    @Test
    public void shouldGetAProjectByItsID() throws NotFoundException {
        User user = new User(USER_ID);
        Project project = new Project();
        project.setUser(user);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));

        Project p = projectDAO.getByID(user, PROJECT_ID);

        assertThat(p, is(equalTo(project)));
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheProjectCanNotFoundByID() throws NotFoundException {
        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.empty());

        projectDAO.getByID(user, PROJECT_ID); // should fail
    }

    @Test
    public void shouldUpdateAProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        ProjectUrl url = new ProjectUrl();

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(projectRepository.save(project)).willReturn(project);

        projectDAO.update(user, project);

        verify(projectRepository).save(project);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowANotFoundExceptionWhenUpdatingAUnknownProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        ProjectUrl url = new ProjectUrl();

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        projectDAO.update(user, project);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnProjectUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);
        project.setId(PROJECT_ID);

        given(projectRepository.save(project)).willThrow(ConstraintViolationException.class);
        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));

        projectDAO.update(user, project); // should fail
    }

    @Test
    public void shouldDeleteAProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setUser(user);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));

        projectDAO.delete(user, PROJECT_ID);

        verify(projectRepository).delete(project);
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailToDeleteAProjectThatDoesNotExist() throws NotFoundException {
        User user = new User();

        projectDAO.delete(user, -1L);
    }


    private List<Project> createProjectList() {
        List<Project> projects = new ArrayList<>();
        for (int i = 0; i < TEST_PROJECT_COUNT; i++) {
            Project p = new Project();
            projects.add(p);
        }
        return projects;
    }

}
