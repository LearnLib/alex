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

    private User user;
    private Project project;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        projectDAO = new ProjectDAOImpl();
    }

    @Before
    public void setUp() {
        user = new User();
        user.setEmail("ProjectDAOImplTest@alex-tests.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);

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
    public void tearDown() throws NotFoundException {
        // at the end make sure that the user and all his stuff is removed from the DB
       userDAO.delete(user.getId());
    }

    @Test
    public void shouldCreateValidProject() throws NotFoundException {
        Project p2 = projectDAO.getByID(user.getId(), project.getId(), ProjectDAO.EmbeddableFields.ALL);

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
    public void shouldGetAProjectByItsName() {
        Project p = projectDAO.getByName(user.getId(), "ProjectDAOImplTest Project ");
        assertEquals(p, project);
    }

    @Test
    public void shouldReturnNullIfProjectWithAGivenNameCannotBeFound() {
        Project p = projectDAO.getByName(user.getId(), "Non existing project name");
        assertNull(p);
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

        Project project2 = projectDAO.getByID(user.getId(), project.getId(), ProjectDAO.EmbeddableFields.ALL);
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
        projectDAO.delete(user.getId(), project.getId());

        // test if the project was removed
        try {
            projectDAO.getByID(user.getId(), project.getId());
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
        projectDAO.delete(user.getId(), -1L);
    }

}
