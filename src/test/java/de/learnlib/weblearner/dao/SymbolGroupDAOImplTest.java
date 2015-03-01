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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SymbolGroupDAOImplTest {

    private static ProjectDAO projectDAO;
    private static SymbolGroupDAO symbolGroupDAO;

    private Project project;
    private SymbolGroup group;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        symbolGroupDAO = new SymbolGroupDAOImpl();
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
    }

    @After
    public void tearDown() {
        projectDAO.delete(project.getId());
    }

    @Test
    public void shouldCreateValidGroup() {
        symbolGroupDAO.create(group);

        assertTrue(group.getId() > 0);
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

        assertEquals(groups.size(), groupsInDB.size());
    }
}
