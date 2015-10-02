package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class CounterDAOImplTest {

    public static final Long USER_ID = 3l;
    public static final String   COUNTER_NAME  = "CounterNo1";
    private static final Integer COUNTER_VALUE = 42;
    private static final int AMOUNT_OF_COUNTERS = 10;

    private static UserDAO userDAO;
    private static ProjectDAO projectDAO;
    private static CounterDAO counterDAO;

    private User user;
    private Project project;
    private Counter counter;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        projectDAO = new ProjectDAOImpl();
        counterDAO = new CounterDAOImpl();
    }

    @Before
    public void setUp() {
        user = new User();
        user.setId(USER_ID);
        user.setEmail("CounterDAOImplTest@alex.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);

        // create project
        project = new Project();
        project.setName("SymbolDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        project.setUser(user);
        projectDAO.create(project);

        counter = new Counter();
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        counter.setValue(COUNTER_VALUE);
    }

    @After
    public void tearDown() throws NotFoundException {
        userDAO.delete(user.getId());
    }

    @Test
    public void shouldCreateACounter() {
        counterDAO.create(counter);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateACounterWithoutAName() {
        counter.setName("");

        counterDAO.create(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateACopyOfACounter() {
        counterDAO.create(counter);

        Counter invalidCounter = new Counter();
        invalidCounter.setProject(counter.getProject());
        invalidCounter.setName(counter.getName());
        invalidCounter.setValue(1);
        counterDAO.create(invalidCounter); // should fail
    }

    @Test
    public void getAllCountersOfOneProject() throws NotFoundException {
        for (int i = 0; i < AMOUNT_OF_COUNTERS; i++) {
            Counter tmpCounter = new Counter();
            tmpCounter.setProject(project);
            tmpCounter.setName("CounterNo" + i);
            tmpCounter.setValue(i);
            counterDAO.create(tmpCounter);
        }

        List<Counter> counters = counterDAO.getAll(user.getId(), project.getId());

        assertEquals(AMOUNT_OF_COUNTERS, counters.size());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionWhenFetchingAllCountersOfANotExistingProject() throws NotFoundException {
        counterDAO.getAll(user.getId(), -1L); // should fail
    }

    @Test
    public void shouldGetTheRightCounter() throws NotFoundException {
        counterDAO.create(counter);

        Counter counterInDB = counterDAO.get(user.getId(), project.getId(), COUNTER_NAME);

        assertEquals(counter, counterInDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionWhenAskingForANonExistingCounter() throws NotFoundException {
        counterDAO.get(user.getId(), project.getId(), COUNTER_NAME); // should fail
    }

    @Test
    public void shouldUpdateACounter() throws NotFoundException {
        counterDAO.create(counter);
        counter.setValue(COUNTER_VALUE + 1);

        counterDAO.update(counter);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionWhenUpdatingANonExistingCounter() throws NotFoundException {
        counterDAO.update(counter); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionWhenUpdatingACounterWithoutAName() throws NotFoundException {
        counterDAO.create(counter);
        counter.setName("");

        counterDAO.update(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldThrowAnExceptionWhenUpdatingWithADifferentName() throws NotFoundException {
        counterDAO.create(counter);
        Counter invalidCounter = new Counter();
        invalidCounter.setProject(counter.getProject());
        invalidCounter.setName(counter.getName() + "2");
        invalidCounter.setValue(1);
        counterDAO.create(invalidCounter); // up to here everything is fine

        invalidCounter.setName(counter.getName()); // let the madness begin...

        counterDAO.update(invalidCounter); // should fail
    }

    @Test
    public void shouldDeleteACounter() throws NotFoundException {
        counterDAO.create(counter);

        counterDAO.delete(user.getId(), project.getId(), counter.getName());

        Counter resultCounter = null;
        try {
            resultCounter = counterDAO.get(user.getId(), project.getId(), counter.getName());
            fail("Counter was not completely removed.");
        } catch (NotFoundException e) {
            // success
            assertEquals(null, resultCounter);
        }
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionWhenDeletingANonExistingCounter() throws NotFoundException {
        counterDAO.delete(user.getId(), project.getId(), "This counter does not exists!"); // should fail
    }

}
