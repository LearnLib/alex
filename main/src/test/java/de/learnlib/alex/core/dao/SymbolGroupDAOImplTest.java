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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class SymbolGroupDAOImplTest {

    private static final int AMOUNT_OF_GROUPS = 10;
    private static UserDAO userDAO;
    private static SymbolDAOImpl symbolDAO;
    private static ProjectDAO projectDAO;
    private static SymbolGroupDAO symbolGroupDAO;

    private User user;
    private Project project;
    private SymbolGroup group;
    private SymbolGroup group2;
    private Symbol symbol;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        symbolDAO = new SymbolDAOImpl();
        projectDAO = new ProjectDAOImpl(symbolDAO);
        symbolGroupDAO = new SymbolGroupDAOImpl(symbolDAO);
    }

    @Before
    public void setUp() {
        user = new User();
        user.setEmail("SymbolGroupDAOImplTest@alex.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);

        project = new Project();
        project.setName("SymbolGroupDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        project.setUser(user);
        projectDAO.create(project);

        group = new SymbolGroup();
        group.setProject(project);
        group.setName("SymbolGroupDAO - Test Group");
        group.setUser(user);

        group2 = new SymbolGroup();
        group2.setProject(project);
        group2.setName("SymbolGroupDAO - Test Group 2");
        group2.setUser(user);

        symbol = new Symbol();
        symbol.setName("SymbolGroupDAOImpl - Test Symbol");
        symbol.setAbbreviation("test");
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setUser(user);
        symbolDAO.create(symbol);
    }

    @After
    public void tearDown() throws NotFoundException {
        userDAO.delete(user.getId());
    }

    @Test
    public void shouldCreateValidGroup() {
        symbolGroupDAO.create(group);

        assertTrue(group.getId() > 0);
        assertTrue(group.getProject().getId() > 0);
        assertTrue(group.getSymbols().isEmpty());
        assertEquals(0, group.getSymbolSize());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAGroupWithoutAProject() {
        group.setProject(null);

        symbolGroupDAO.create(group); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAGroupWithAnId() {
        group.setId(1L);

        symbolGroupDAO.create(group); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateTwoGroupsWithTheSameNameInOneProject() {
        symbolGroupDAO.create(group);
        group2.setName(group.getName());

        symbolGroupDAO.create(group2); // should fail
    }

    @Test
    public void shouldGetAllGroupsOfOneProject() throws NotFoundException {
        List<SymbolGroup> groups = new LinkedList<>();
        for (int i = 1; i <= AMOUNT_OF_GROUPS; i++) {
            SymbolGroup newGroup = new SymbolGroup();
            newGroup.setName("Group " + i);
            newGroup.setProject(project);
            newGroup.setUser(user);

            symbolGroupDAO.create(newGroup);

            assertEquals(project, newGroup.getProject());
            assertTrue(newGroup.getId() > 0);

            groups.add(newGroup);
        }

        List<SymbolGroup> groupsInDB = symbolGroupDAO.getAll(user.getId(), project.getId());
        assertEquals(groups.size() + 1, groupsInDB.size()); // +1: default group
    }

    @Test
    public void shouldThrowAnExceptionIfYouWantToGetAllGroupsOfANonExistingProject() throws NotFoundException {
        symbolGroupDAO.getAll(user.getId(), -1L);
    }

    @Test
    public void shouldGetTheRightGroup() throws NotFoundException {
        for (int i = 1; i <= AMOUNT_OF_GROUPS; i++) {
            SymbolGroup newGroup = new SymbolGroup();
            newGroup.setName("Group " + i);
            newGroup.setProject(project);
            newGroup.setUser(user);

            symbolGroupDAO.create(newGroup);

            assertEquals(project, newGroup.getProject());
            assertTrue(newGroup.getId() > 0);
        }

        SymbolGroup groupInDB = symbolGroupDAO.get(user, project.getId(), 1L);
        assertEquals(project, groupInDB.getProject());
        assertEquals("Group 1", groupInDB.getName());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheGroupWasNotFound() throws NotFoundException {
        symbolGroupDAO.get(user, -1L, -1L); // should fail
    }

    @Test
    public void shouldUpdateAGroup() throws NotFoundException {
        symbolGroupDAO.create(group);

        group.setName("New Name");
        symbolGroupDAO.update(group);

        SymbolGroup groupInDB = symbolGroupDAO.get(user, project.getId(), group.getId());
        assertEquals("New Name", groupInDB.getName());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateIfNameConflictsOccur() throws NotFoundException {
        symbolGroupDAO.create(group);
        symbolGroupDAO.create(group2);

        group2.setName(group.getName());
        symbolGroupDAO.update(group2); // should fail
    }

    @Test
    public void shouldDeleteAGroup() throws NotFoundException {
        symbolGroupDAO.create(group);
        symbol.setGroup(group);
        symbolDAO.update(symbol);

        symbolGroupDAO.delete(user, project.getId(), group.getId());

        try {
            symbolGroupDAO.get(user, project.getId(), group.getId()); // should fail
            fail("After deleting a group, it was still in the DB.");
        } catch (NotFoundException e) {
            // SymbolGroup was not found -> It was deleted -> success
            Symbol symbolInDB = symbolDAO.getWithLatestRevision(user, project.getId(), symbol.getId());
            assertEquals(project.getDefaultGroup(), symbolInDB.getGroup());
            assertTrue(symbolInDB.isHidden());
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteTheDefaultGroupOfAProject() throws NotFoundException {
        symbolGroupDAO.delete(user, project.getId(), project.getDefaultGroup().getId());
    }
}
