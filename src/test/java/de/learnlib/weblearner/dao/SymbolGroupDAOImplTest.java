package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolGroup;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class SymbolGroupDAOImplTest {

    private static ProjectDAO projectDAO;
    private static SymbolGroupDAO symbolGroupDAO;
    private static SymbolDAO symbolDAO;


    private Project project;
    private SymbolGroup group;
    private SymbolGroup group2;
    private Symbol symbol;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        symbolGroupDAO = new SymbolGroupDAOImpl();
        symbolDAO = new SymbolDAOImpl(symbolGroupDAO);
    }

    @Before
    public void setUp() {
        project = new Project();
        project.setName("SymbolGroupDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        projectDAO.create(project);

        group = new SymbolGroup();
        group.setProject(project);
        group.setName("SymbolGroupDAO - Test Group");

        group2 = new SymbolGroup();
        group2.setProject(project);
        group2.setName("SymbolGroupDAO - Test Group 2");

        symbol = new Symbol();
        symbol.setName("SymbolGroupDAOImpl - Test Symbol");
        symbol.setAbbreviation("test");
        symbol.setProject(project);
        symbol.setGroup(group);
        symbolDAO.create(symbol);
    }

    @After
    public void tearDown() {
        projectDAO.delete(project.getId());
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
    public void shouldGetAllGroupsOfOneProject() {
        List<SymbolGroup> groups = new LinkedList<>();
        for (int i = 1; i <= 10; i++) {
            SymbolGroup newGroup = new SymbolGroup();
            newGroup.setName("Group " + i);
            newGroup.setProject(project);

            symbolGroupDAO.create(newGroup);

            assertEquals(project, newGroup.getProject());
            assertTrue(newGroup.getId() > 0);

            groups.add(newGroup);
        }

        List<SymbolGroup> groupsInDB = symbolGroupDAO.getAll(project.getId());
        assertEquals(groups.size() + 1, groupsInDB.size()); // +1: default group
    }

    @Test
    public void shouldThrowAnExceptionIfYouWantToGetAllGroupsOfANonExistingProject() {
        symbolGroupDAO.getAll(-1L);
    }

    @Test
    public void shouldGetTheRightGroup() {
        List<SymbolGroup> groups = new LinkedList<>();
        for (int i = 1; i <= 10; i++) {
            SymbolGroup newGroup = new SymbolGroup();
            newGroup.setName("Group " + i);
            newGroup.setProject(project);

            symbolGroupDAO.create(newGroup);

            assertEquals(project, newGroup.getProject());
            assertTrue(newGroup.getId() > 0);

            groups.add(newGroup);
        }

        SymbolGroup groupInDB = symbolGroupDAO.get(project.getId(), 1L);
        assertEquals(project, groupInDB.getProject());
        assertEquals("Group 1", groupInDB.getName());
    }

    @Test(expected = NoSuchElementException.class)
    public void shouldThrowAnExceptionIfTheGroupWasNotFound() {
        symbolGroupDAO.get(-1L, -1L); // should fail
    }

    @Test
    public void shouldUpdateAGroup() {
        symbolGroupDAO.create(group);

        group.setName("New Name");
        symbolGroupDAO.update(group);

        SymbolGroup groupInDB = symbolGroupDAO.get(project.getId(), group.getId());
        assertEquals("New Name", groupInDB.getName());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotUpdateIfNameConflictsOccur() {
        symbolGroupDAO.create(group);
        symbolGroupDAO.create(group2);

        group2.setName(group.getName());
        symbolGroupDAO.update(group2); // should fail
    }

    @Test
    public void shouldDeleteAGroup() {
        symbolGroupDAO.create(group);
        symbol.setGroup(group);
        symbolDAO.update(symbol);

        symbolGroupDAO.delete(project.getId(), group.getId());

        try {
            SymbolGroup groupInDB = symbolGroupDAO.get(project.getId(), group.getId()); // should fail
            fail("After deleting a group, it was still in the DB.");
        } catch (NoSuchElementException e) {
            // Symbol was not found -> It was deleted -> success
        }
        Symbol symbolInDB = symbolDAO.getWithLatestRevision(project.getId(), symbol.getId());
        assertEquals(project.getDefaultGroup(), symbolInDB.getGroup());
        assertTrue(symbolInDB.isHidden());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteTheDefaultGroupOfAProject() {
        symbolGroupDAO.delete(project.getId(), project.getDefaultGroup().getId());
    }
}
