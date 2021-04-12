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

package de.learnlib.alex.integrationtests.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import java.util.List;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

public class SymbolGroupRepositoryIT extends AbstractRepositoryIT {

    @Autowired
    private SymbolGroupRepository symbolGroupRepository;

    private User user;

    private Project project;

    @BeforeEach
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

    @Test
    public void shouldFailToSaveAGroupWithoutAProject() {
        SymbolGroup group = new SymbolGroup();
        group.setId(1L);
        group.setName("Test Group");

        project.getGroups().add(group);

        assertThrows(DataIntegrityViolationException.class, () -> symbolGroupRepository.save(group));
    }

    @Test
    public void shouldFailToSaveAGroupWithoutAName() {
        SymbolGroup group = new SymbolGroup();
        group.setProject(project);
        project.getGroups().add(group);
        group.setId(1L);

        assertThrows(ValidationException.class, () -> symbolGroupRepository.save(group));
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

        assertEquals(3, groups.size());
        assertTrue(groups.contains(group1));
        assertTrue(groups.contains(group2));
    }

    @Test
    public void shouldFetchAGroupOfAProjectByItsID() {
        SymbolGroup group = createGroup(project, null, "Test Group 1");
        group = symbolGroupRepository.save(group);

        SymbolGroup groupFromDB = symbolGroupRepository.findById(group.getId()).orElse(null);

        assertNotNull(groupFromDB.getProject());
        assertEquals(project, groupFromDB.getProject());
        assertEquals(group.getId(), groupFromDB.getId());
    }

    @Test
    public void shouldDeleteAGroup() {
        SymbolGroup group = createGroup(project, 1L, "Test Group 1");
        group = symbolGroupRepository.save(group);

        symbolGroupRepository.delete(group);

        assertEquals(1L, symbolGroupRepository.count()); // only default group left
    }

    @Test
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingGroup() {
        assertThrows(EmptyResultDataAccessException.class, () -> symbolGroupRepository.deleteById(55L));
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
