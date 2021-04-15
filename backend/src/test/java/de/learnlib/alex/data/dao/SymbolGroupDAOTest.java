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

package de.learnlib.alex.data.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SymbolGroupDAOTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final long GROUP_ID = 84L;
    private static final long DEFAULT_GROUP_ID = 0L;
    private static final int TEST_GROUP_COUNT = 3;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolGroupRepository symbolGroupRepository;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private SymbolPresenceService symbolPresenceService;

    private SymbolGroupDAO symbolGroupDAO;

    @BeforeEach
    public void setUp() {
        symbolGroupDAO = new SymbolGroupDAO(projectRepository, projectDAO, symbolGroupRepository, symbolRepository, symbolDAO, objectMapper, symbolPresenceService);
    }

    @Test
    public void shouldCreateAValidGroup() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.addOwner(user);

        SymbolGroup group = new SymbolGroup();
        group.setProject(project);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.save(group)).willReturn(group);

        symbolGroupDAO.create(user, PROJECT_ID, group);

        verify(symbolGroupRepository).save(group);
    }

    @Test
    public void shouldGetAllGroupsOfAProject() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        List<SymbolGroup> groups = createGroupsList();
        groups.forEach(g -> g.setProject(project));

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findAllByProject_IdAndParent_id(PROJECT_ID, null)).willReturn(groups);

        List<SymbolGroup> allGroups = symbolGroupDAO.getAll(user, PROJECT_ID);

        assertEquals(groups.size(), allGroups.size());
        for (SymbolGroup g : allGroups) {
            assertTrue(groups.contains(g));
        }
    }

    @Test
    public void shouldThrowAnExceptionIfYouWantToGetAllGroupsOfANonExistingProject() {
        User user = new User();
        user.setId(USER_ID);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.empty());
        doThrow(NotFoundException.class).when(projectDAO).checkAccess(user, null);

        assertThrows(NotFoundException.class, () -> symbolGroupDAO.getAll(user, PROJECT_ID));
    }

    @Test
    public void shouldGetAGroupByItsID() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        group.setProject(project);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));

        SymbolGroup g = symbolGroupDAO.get(user, PROJECT_ID, group.getId());

        assertEquals(group, g);
    }

    @Test
    public void shouldThrowAnExceptionIfTheGroupCanNotBeFound() {
        User user = new User();
        user.setId(USER_ID);

        assertThrows(NotFoundException.class, () -> symbolGroupDAO.get(user, -1L, -1L));
    }

    @Test
    public void shouldUpdateAGroup() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.addOwner(user);

        SymbolGroup group = new SymbolGroup();
        group.setName("A group");
        group.setId(GROUP_ID);
        group.setProject(project);

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setId(GROUP_ID + 1);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));
        given(symbolGroupRepository.save(group)).willReturn(group);

        symbolGroupDAO.update(user, PROJECT_ID, GROUP_ID, group);

        verify(symbolGroupRepository).save(group);
    }

    @Test
    public void shouldDeleteAGroup() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.addOwner(user);
        project.setId(PROJECT_ID);

        SymbolGroup group = new SymbolGroup();
        group.setId(GROUP_ID);
        group.setProject(project);

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setId(GROUP_ID - 1L);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(PROJECT_ID)).willReturn(defaultGroup);
        given(symbolGroupRepository.findById(GROUP_ID)).willReturn(Optional.of(group));

        symbolGroupDAO.delete(user, PROJECT_ID, GROUP_ID);

        verify(symbolGroupRepository).delete(group);
    }

    @Test
    public void shouldNotDeleteTheDefaultGroupOfAProject() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.addOwner(user);

        SymbolGroup group = new SymbolGroup();
        group.setId(DEFAULT_GROUP_ID);
        group.setProject(project);
        project.getGroups().add(group);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(PROJECT_ID)).willReturn(group);
        given(symbolGroupRepository.findById(DEFAULT_GROUP_ID)).willReturn(Optional.of(group));

        assertThrows(IllegalArgumentException.class, () -> symbolGroupDAO.delete(user, PROJECT_ID, DEFAULT_GROUP_ID));
    }

    @Test
    public void shouldFailToDeleteAProjectThatDoesNotExist() {
        User user = new User();
        user.setId(USER_ID);

        assertThrows(NotFoundException.class, () -> symbolGroupDAO.delete(user, PROJECT_ID, -1L));
    }


    private List<SymbolGroup> createGroupsList() {
        List<SymbolGroup> groups = new ArrayList<>();
        for (int i = 0; i < TEST_GROUP_COUNT; i++) {
            SymbolGroup g = new SymbolGroup();
            groups.add(g);
        }
        return groups;
    }

}
