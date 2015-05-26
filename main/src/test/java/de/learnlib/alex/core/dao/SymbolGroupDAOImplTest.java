package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolGroup;
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
        symbolDAO = new SymbolDAOImpl();
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
    public void tearDown() throws NotFoundException {
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
    public void shouldGetAllGroupsOfOneProject() throws NotFoundException {
        List<SymbolGroup> groups = new LinkedList<>();
        for (int i = 1; i <= AMOUNT_OF_GROUPS; i++) {
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
    public void shouldThrowAnExceptionIfYouWantToGetAllGroupsOfANonExistingProject() throws NotFoundException {
        symbolGroupDAO.getAll(-1L);
    }

    @Test
    public void shouldGetTheRightGroup() throws NotFoundException {
        List<SymbolGroup> groups = new LinkedList<>();
        for (int i = 1; i <= AMOUNT_OF_GROUPS; i++) {
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

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheGroupWasNotFound() throws NotFoundException {
        symbolGroupDAO.get(-1L, -1L); // should fail
    }

    @Test
    public void shouldUpdateAGroup() throws NotFoundException {
        symbolGroupDAO.create(group);

        group.setName("New Name");
        symbolGroupDAO.update(group);

        SymbolGroup groupInDB = symbolGroupDAO.get(project.getId(), group.getId());
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

        symbolGroupDAO.delete(project.getId(), group.getId());

        try {
            symbolGroupDAO.get(project.getId(), group.getId()); // should fail
            fail("After deleting a group, it was still in the DB.");
        } catch (NotFoundException e) {
            // Symbol was not found -> It was deleted -> success
            Symbol symbolInDB = symbolDAO.getWithLatestRevision(project.getId(), symbol.getId());
            assertEquals(project.getDefaultGroup(), symbolInDB.getGroup());
            assertTrue(symbolInDB.isHidden());
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteTheDefaultGroupOfAProject() throws NotFoundException {
        symbolGroupDAO.delete(project.getId(), project.getDefaultGroup().getId());
    }
}
