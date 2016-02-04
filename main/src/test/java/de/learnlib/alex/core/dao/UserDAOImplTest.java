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

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class UserDAOImplTest {

    private static final String ADMIN_MAIL = "UserDAOImplTest@alex-tests.example";
    private static final int TEST_USER_COUNT = 3;

    private static UserDAO userDAO;

    private User admin;

    private User user;

    @BeforeClass
    public static void beforeClass() throws NotFoundException {
        userDAO = new UserDAOImpl();

        try {
            userDAO.getByEmail(ADMIN_MAIL);
        } catch (NotFoundException e) {
            User u = new User();
            u.setEmail(ADMIN_MAIL);
            u.setEncryptedPassword("alex");
            u.setRole(UserRole.ADMIN);
            userDAO.create(u);
        }
    }

    @Before
    public void setUp() throws NotFoundException {
        admin = userDAO.getByEmail(ADMIN_MAIL);

        user = new User();
        user.setEmail("test@mail.de");
        user.setEncryptedPassword("test");
    }

    @After
    public void tearDown() throws NotFoundException {
        List<User> users = userDAO.getAll();
        for (User u : users) {
            if (!u.equals(admin)) {
                userDAO.delete(u.getId());
            }
        }

        assertEquals(1, userDAO.getAll().size());
    }

    @Test
    public void shouldCreateAValidUser() throws NotFoundException {
        userDAO.create(user);

        User userFromDB = userDAO.getByEmail("test@mail.de");
        assertEquals(user, userFromDB);
        assertEquals(UserRole.REGISTERED, userFromDB.getRole());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithoutEmail() {
        user.setEmail(null);

        userDAO.create(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithoutPassword() {
        user.setPassword(null);

        userDAO.create(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithANonUniqueEmail() {
        user.setEmail("UserDAOImplTest@alex-tests.example");

        userDAO.create(user);
    }

    @Test
    public void shouldGetAllUsers() {
        List<User> users = new ArrayList<>();
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("user-" + String.valueOf(i) + "@mail.de");
            u.setEncryptedPassword("test");
            userDAO.create(u);
            users.add(u);
        }
        users.add(admin);

        List<User> allUsers = userDAO.getAll();

        for (User u : allUsers) {
            assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldOnlyGetAllAdmins() {
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("test" + i + "@mail.de");
            u.setEncryptedPassword("test");
            userDAO.create(u);
        }
        List<User> admins = new ArrayList<>();
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("admin" + i + "@mail.de");
            u.setRole(UserRole.ADMIN);
            u.setEncryptedPassword("test");
            userDAO.create(u);
            admins.add(u);
        }
        admins.add(admin);

        List<User> allAdmins = userDAO.getAllByRole(UserRole.ADMIN);
        assertEquals(admins.size(), admins.size());
        for (User u : allAdmins) {
            assertEquals(UserRole.ADMIN, u.getRole());
            assertTrue(admins.contains(u));
        }
    }

    @Test
    public void shouldGetAllRegisteredUsers() {
        List<User> registered = new ArrayList<>();
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("test" + i + "@mail.de");
            u.setEncryptedPassword("test");
            userDAO.create(u);
            registered.add(u);
        }
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("admin" + i + "@mail.de");
            u.setRole(UserRole.ADMIN);
            u.setEncryptedPassword("test");
            userDAO.create(u);
        }

        List<User> allRegistered = userDAO.getAllByRole(UserRole.REGISTERED);
        assertEquals(registered.size(), allRegistered.size());
        for (User u : allRegistered) {
            assertEquals(UserRole.REGISTERED, u.getRole());
            assertTrue(registered.contains(u));
        }
    }

    @Test
    public void shouldGetByID() throws NotFoundException {
        userDAO.create(user);

        User userFromDB = userDAO.getById(user.getId());
        assertEquals(user, userFromDB);
        assertEquals(UserRole.REGISTERED, userFromDB.getRole());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByID() throws NotFoundException {
        userDAO.getById(Long.valueOf(TEST_USER_COUNT));
    }

    @Test
    public void shouldGetByEmail() throws NotFoundException {
        userDAO.create(user);

        User userFromDB = userDAO.getByEmail(user.getEmail());
        assertEquals(user, userFromDB);
        assertEquals(UserRole.REGISTERED, userFromDB.getRole());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByEmail() throws NotFoundException {
        userDAO.getByEmail(user.getEmail());
    }

    @Test
    public void shouldUpdateUser() throws NotFoundException {
        userDAO.create(user);

        user.setEmail("new_email@alex.example");
        userDAO.update(user);

        User userFromDB = userDAO.getById(user.getId());
        assertEquals(user, userFromDB);
    }

    @Test
    public void shouldDeleteARegisteredUser() throws NotFoundException {
        User u = new User();
        u.setEmail("test@mail.de");
        u.setEncryptedPassword("test");
        userDAO.create(u);

        userDAO.delete(u.getId());

        try {
            userDAO.getById(u.getId());
            fail();
        } catch (NotFoundException e) {
            // success
        }
    }

    @Test
    public void shouldDeleteAnAdminIfThereAreMoreThanOne() throws NotFoundException {
        User u = new User();
        u.setEmail("test@mail.de");
        u.setEncryptedPassword("test");
        u.setRole(UserRole.ADMIN);
        userDAO.create(u);

        List<User> admins = userDAO.getAllByRole(UserRole.ADMIN);
        assertEquals(admins.size(), 2);
        userDAO.delete(u.getId());
        admins = userDAO.getAllByRole(UserRole.ADMIN);
        assertEquals(admins.size(), 1);
        assertTrue(!admins.contains(u));
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailToDeleteAUserOnInvalidId() throws NotFoundException {
        userDAO.delete(-1L);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteOnlyExistingAdmin() throws NotFoundException {
        userDAO.delete(admin.getId());
    }
}
