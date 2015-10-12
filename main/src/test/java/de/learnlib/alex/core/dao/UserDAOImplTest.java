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

public class UserDAOImplTest {

    private static UserDAO userDAO;
    private static String ADMIN_MAIL = "UserDAOImplTest@alex-tests.example";

    private User admin;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();

        User u = userDAO.getByEmail(ADMIN_MAIL);
        if (u == null) {
            u = new User();
            u.setEmail(ADMIN_MAIL);
            u.setEncryptedPassword("alex");
            u.setRole(UserRole.ADMIN);
            userDAO.create(u);
        }
    }

    @Before
    public void setUp() {
        admin = userDAO.getByEmail(ADMIN_MAIL);
    }

    @After
    public void tearDown() throws NotFoundException {
        List<User> users = userDAO.getAll();
        for (User u : users) {
            if (!u.equals(admin)) {
                userDAO.delete(u.getId());
            }
        }

        assertEquals(userDAO.getAll().size(), 1);
    }

    @Test
    public void shouldCreateAValidUser() {
        User u = new User();
        u.setEmail("test@mail.de");
        u.setEncryptedPassword("test");
        userDAO.create(u);

        User userfromDB = userDAO.getByEmail("test@mail.de");
        assertEquals(userfromDB, u);
        assertEquals(UserRole.REGISTERED, userfromDB.getRole());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithoutEmail() {
        User u = new User();
        u.setEncryptedPassword("test");
        userDAO.create(u);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithoutPassword() {
        User u = new User();
        u.setEmail("test@mail.de");
        userDAO.create(u);
    }

    @Test(expected = ValidationException.class)
    public void shouldNotCreateAUserWithANonUniqueEmail() {
        User u = new User();
        u.setEmail("UserDAOImplTest@alex-tests.example");
        u.setEncryptedPassword("test");
        userDAO.create(u);
    }

    @Test
    public void shouldGetAllUsers() {
        List<User> users = new ArrayList<>();
        for (int i = 0; i  < 3; i++) {
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
        for (int i = 0; i  < 3; i++) {
            User u = new User();
            u.setEmail("test" + i + "@mail.de");
            u.setEncryptedPassword("test");
            userDAO.create(u);
        }
        List<User> admins = new ArrayList<>();
        for (int i = 0; i  < 3; i++) {
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
        for (int i = 0; i  < 3; i++) {
            User u = new User();
            u.setEmail("test" + i + "@mail.de");
            u.setEncryptedPassword("test");
            userDAO.create(u);
            registered.add(u);
        }
        for (int i = 0; i  < 3; i++) {
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
    public void shouldDeleteARegisteredUser() throws NotFoundException {
        User u = new User();
        u.setEmail("test@mail.de");
        u.setEncryptedPassword("test");
        userDAO.create(u);

        userDAO.delete(u.getId());
        assertTrue(userDAO.getById(u.getId()) == null);
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
        userDAO.delete(-1l);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteOnlyExistingAdmin () throws NotFoundException {
        userDAO.delete(admin.getId());
    }
}
