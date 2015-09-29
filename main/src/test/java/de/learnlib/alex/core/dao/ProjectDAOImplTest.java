package de.learnlib.alex.core.dao;

import de.learnlib.alex.actions.WaitAction;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class ProjectDAOImplTest {

    private static final int PROJECT_COUNT = 5;
    private static final String BASE_URL = "http://example.com";

    private static UserDAO userDAO;
    private static ProjectDAO projectDAO;

    private static User user;
    private Project project;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        projectDAO = new ProjectDAOImpl();

        user = new User();
        user.setEmail("ProjectDAOImplTest@alex-tests.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);
    }

    @Before
    public void setUp() {
        project = new Project();
        project.setName("ProjectDAOImplTest Project ");
        project.setBaseUrl(BASE_URL);
        project.setDescription("Lorem Ipsum");
        project.setUser(user);

        Symbol symbol = new Symbol();
        symbol.setName("ProjectDAOImplTest Project - Symbol 1");
        symbol.setAbbreviation("tpts1");
        symbol.addAction(new WaitAction());
        project.addSymbol(symbol);

        projectDAO.create(project);
    }

    @After
    public void tearDown() {
        // at the end make sure that the user & project is removed from the DB
        try {
            projectDAO.delete(project.getId());
        } catch (NotFoundException e) {
            // nothing to worry about
            System.out.println("ProjectDAOImplTest.tearDown(): project deletion failed.");
        }
    }

    @AfterClass
    public static void afterClass() throws NotFoundException {
        userDAO.delete(user.getId());
    }

    @Test
    public void shouldCreateValidProject() throws NotFoundException {
        Project p2 = projectDAO.getByID(project.getId(), ProjectDAO.EmbeddableFields.ALL);

        assertNotNull(p2);
        assertEquals(project.getName(), p2.getName());
        assertEquals(BASE_URL, project.getBaseUrl());
        assertEquals("Lorem Ipsum", project.getDescription());

        assertEquals(1, p2.getGroups().size());

        assertEquals(1, p2.getSymbolsSize());
        assertEquals(1, p2.getSymbols().iterator().next().getActions().size());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAProjectWithoutAName() {
        Project p2 = new Project();
        project.setBaseUrl(BASE_URL);

        projectDAO.create(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAProjectWithoutBaseUrl() {
        Project p2 = new Project();
        project.setName("Test Project - Without Base URL");

        projectDAO.create(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAProjectAnAlreadyUsedName() {
        Project p2 = new Project();
        p2.setName(project.getName());

        projectDAO.create(p2); // should fail
    }

    @Test
    public void shouldGetAllProjects() {
        List<Project> projects = new LinkedList<>();
        for (int i = 0; i < PROJECT_COUNT; i++) {
            Project tmpProject = new Project();
            tmpProject.setName("Project No. " + i);
            tmpProject.setBaseUrl(BASE_URL);
            tmpProject.setUser(user);
            projectDAO.create(tmpProject);
            projects.add(tmpProject);
        }

        List<Project> projectsFromDB = projectDAO.getAll(user, ProjectDAO.EmbeddableFields.ALL);

        for (Project x : projects) {
            assertTrue(projectsFromDB.contains(x));
        }
        for (Project x : projectsFromDB) {
            int symbolSize = x.getSymbolsSize();
            if (x.equals(project)) {
                assertEquals(1, symbolSize);
            } else {
                assertEquals(0, symbolSize);
            }
        }
    }

    @Test
    public void shouldUpdateValidProject() throws NotFoundException {
        project.setName("An other Test Project");
        projectDAO.update(project);

        Project project2 = projectDAO.getByID(project.getId(), ProjectDAO.EmbeddableFields.ALL);
        assertEquals("An other Test Project", project2.getName());
        assertEquals(project.getSymbolsSize(), project2.getSymbolsSize());
        assertEquals(project.getNextSymbolId(), project2.getNextSymbolId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailOnUpdateByInvalidID() throws NotFoundException {
        project.setId(-1L);
        project.setName("An other Test Project");

        projectDAO.update(project); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWhenTheNameIsMissing() throws NotFoundException {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Name");
        p2.setBaseUrl(BASE_URL);
        projectDAO.create(p2);

        p2.setName("");

        projectDAO.update(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWhenTheBaseUrlIsMissing() throws NotFoundException {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Base URL");
        p2.setBaseUrl(BASE_URL);
        projectDAO.create(p2);

        p2.setBaseUrl("");

        projectDAO.update(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWithNotUniqueName() throws NotFoundException {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Unique Name");
        p2.setBaseUrl(BASE_URL);
        projectDAO.create(p2);

        p2.setName(project.getName());

        projectDAO.update(p2); // should fail
    }

    @Test
    public void shouldDeleteValidProject() throws NotFoundException {
        // test if the project has Symbols
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        List<Symbol> symbols = session.createCriteria(Symbol.class)
                                            .add(Restrictions.eq("project.id", project.getId()))
                                            .list();
        SymbolAction action = (symbols.get(0)).getActions().get(0);
        HibernateUtil.commitTransaction();

        assertTrue(symbols.size() > 0);

        // delete the project
        projectDAO.delete(project.getId());

        // test if the project was removed
        try {
            projectDAO.getByID(project.getId());
            fail("Project was not relay deleted!");
        } catch (NotFoundException ignored) {
            // success
            session = HibernateUtil.getSession();
            HibernateUtil.beginTransaction();

            // make sure all symbols are deleted
            symbols = session.createCriteria(Symbol.class)
                             .add(Restrictions.eq("project.id", project.getId()))
                             .list();
            WebSymbolAction actionInDB = (WebSymbolAction) session.get(WebSymbolAction.class, action.getId());
            assertTrue(symbols.size() == 0);
            assertNull(actionInDB);

            // make sure all test results are deleted
            session = HibernateUtil.getSession();
            HibernateUtil.beginTransaction();
            @SuppressWarnings("unchecked") // should return a List of LearnerResults
            List<LearnerResult> resultsInDB = session.createCriteria(LearnerResult.class)
                                                     .add(Restrictions.eq("project.id", project.getId()))
                                                     .list();
            assertTrue(resultsInDB.size() == 0);

            HibernateUtil.commitTransaction();
        }
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteInvalidID() throws NotFoundException {
        projectDAO.delete(-1);
    }

}
