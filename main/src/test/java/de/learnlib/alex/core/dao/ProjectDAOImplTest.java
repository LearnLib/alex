package de.learnlib.alex.core.dao;

import de.learnlib.alex.actions.WaitAction;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class ProjectDAOImplTest {

    private static final int PROJECT_COUNT = 5;
    private static final String BASE_URL = "http://example.com";

    private static ProjectDAO dao = new ProjectDAOImpl();
    private Project project;

    @Before
    public void setUp() {
        project = new Project();
        project.setName("ProjectDAOImplTest Project ");
        project.setBaseUrl(BASE_URL);
        project.setDescription("Lorem Ipsum");

        Symbol symbol = new Symbol();
        symbol.setName("ProjectDAOImplTest Project - Symbol 1");
        symbol.setAbbreviation("tpts1");
        symbol.addAction(new WaitAction());
        project.addSymbol(symbol);

        dao.create(project);
    }

    @After
    public void tearDown() {
        // at the end make sure that the project is removed from the DB
        try {
            dao.delete(project.getId());
        } catch (IllegalArgumentException e) {
            // nothing to worry about
            System.out.println("ProjectDAOImplTest.tearDown(): project deletion failed.");
        }
    }

    @Test
    public void shouldCreateValidProject() {
        Project p2 = dao.getByID(project.getId(), ProjectDAO.EmbeddableFields.ALL);

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

        dao.create(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAProjectWithoutBaseUrl() {
        Project p2 = new Project();
        project.setName("Test Project - Without Base URL");

        dao.create(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAProjectAnAlreadyUsedName() {
        Project p2 = new Project();
        p2.setName(project.getName());

        dao.create(p2); // should fail
    }

    @Test
    public void shouldGetAllProjects() {
        List<Project> projects = new LinkedList<>();
        for (int i = 0; i < PROJECT_COUNT; i++) {
            Project tmpProject = new Project();
            tmpProject.setName("Project No. " + i);
            tmpProject.setBaseUrl(BASE_URL);
            dao.create(tmpProject);
            projects.add(tmpProject);
        }

        List<Project> projectsFromDB = dao.getAll(ProjectDAO.EmbeddableFields.ALL);

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
    public void shouldUpdateValidProject() {
        project.setName("An other Test Project");
        dao.update(project);

        Project project2 = dao.getByID(project.getId(), ProjectDAO.EmbeddableFields.ALL);
        assertEquals("An other Test Project", project2.getName());
        assertEquals(project.getSymbolsSize(), project2.getSymbolsSize());
        assertEquals(project.getNextSymbolId(), project2.getNextSymbolId());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldFailOnUpdateByInvalidID() {
        project.setId(-1L);
        project.setName("An other Test Project");

        dao.update(project); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWhenTheNameIsMissing() {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Name");
        p2.setBaseUrl(BASE_URL);
        dao.create(p2);

        p2.setName("");

        dao.update(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWhenTheBaseUrlIsMissing() {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Base URL");
        p2.setBaseUrl(BASE_URL);
        dao.create(p2);

        p2.setBaseUrl("");

        dao.update(p2); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldFailOnUpdateWithNotUniqueName() {
        Project p2 = new Project();
        p2.setName("Test Project - Update Without Unique Name");
        p2.setBaseUrl(BASE_URL);
        dao.create(p2);

        p2.setName(project.getName());

        dao.update(p2); // should fail
    }

    @Test
    public void shouldDeleteValidProject() {
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
        dao.delete(project.getId());

        // test if the project was removed
        Project projectFromDB = dao.getByID(project.getId());
        assertNull(projectFromDB);

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

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDeleteInvalidID() {
        dao.delete(-1);
    }

}
