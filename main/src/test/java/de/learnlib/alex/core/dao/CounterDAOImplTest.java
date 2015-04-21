package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class CounterDAOImplTest {

    private static final int COUNTER_VALUE = 42;

    private static ProjectDAO projectDAO;
    private static CounterDAO counterDAO;

    private Project project;
    private Counter counter;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        counterDAO = new CounterDAOImpl();
    }

    @Before
    public void setUp() {
        // create project
        project = new Project();
        project.setName("SymbolDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        projectDAO.create(project);

        counter = new Counter();
        counter.setProject(project);
        counter.setName("Counter No. 1");
        counter.setValue(COUNTER_VALUE);
    }

    @After
    public void tearDown() {
        projectDAO.delete(project.getId());
    }

    @Test
    public void shouldCreateACounter() {
        counterDAO.create(counter);
    }

    @Test
    public void getAllCountersOfOneProject() {
        for (int i = 0; i < 10; i++) {
            Counter counter = new Counter();
            counter.setProject(project);
            counter.setName("Counter No. " + i);
            counter.setValue(i);
            counterDAO.create(counter);
        }

        List<Counter> counters = counterDAO.getAll(project.getId());

        assertEquals(10, counters.size());
    }

    @Test
    public void shouldUpdateACounter() {
        counterDAO.create(counter);
        counter.setValue(COUNTER_VALUE + 1);

        counterDAO.update(counter);
    }

    @Test
    public void shouldDeleteACounter() {
        counterDAO.create(counter);

        counterDAO.delete(project.getId(), counter.getName());

        try {
            counterDAO.get(project.getId(), counter.getName());
            fail("Counter was not completely removed.");
        } catch (NoSuchElementException e) {
            // success
        }
    }

}
