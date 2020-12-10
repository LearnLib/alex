/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.auth.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.services.WebSocketService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import javax.persistence.EntityManager;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class UserDAOTest {

    private static final int TEST_USER_COUNT = 3;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileDAO fileDAO;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private WebSocketService webSocketService;

    @Mock
    private EntityManager entityManager;

    private UserDAO userDAO;

    private User dummyAdmin;

    @Before
    public void setUp() throws NotFoundException {
        userDAO = new UserDAO(userRepository, fileDAO, projectDAO, projectRepository,
                webSocketService, entityManager);
        dummyAdmin = new User();
        dummyAdmin.setRole(UserRole.ADMIN);
        dummyAdmin.setId(-1L);
    }

    @Test
    public void shouldCreateAValidUser() throws NotFoundException {
        User user = createUser();

        userDAO.create(user);

        Mockito.verify(userRepository).save(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnUserCreationGracefully() {
        User user = createUser();
        BDDMockito.given(userRepository.save(user)).willThrow(ConstraintViolationException.class);

        userDAO.create(user);
    }

    @Test
    public void shouldGetAllUsers() {
        List<User> users = createUsersList();
        BDDMockito.given(userRepository.findAll()).willReturn(users);

        List<User> allUsers = userDAO.getAll();

        assertEquals(users.size(), allUsers.size());
        for (User u : allUsers) {
            Assert.assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldOnlyGetAllAdmins() {
        List<User> users = createUsersList();
        BDDMockito.given(userRepository.findByRole(UserRole.ADMIN)).willReturn(users);

        List<User> allAdmins = userDAO.getAllByRole(UserRole.ADMIN);

        assertEquals(users.size(), allAdmins.size());
        for (User u : allAdmins) {
            Assert.assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldGetAllRegisteredUsers() {
        List<User> users = createUsersList();
        BDDMockito.given(userRepository.findByRole(UserRole.REGISTERED)).willReturn(users);

        List<User> allRegistered = userDAO.getAllByRole(UserRole.REGISTERED);

        assertEquals(users.size(), allRegistered.size());
        for (User u : allRegistered) {
            Assert.assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldGetByID() throws NotFoundException {
        User user = createUser();
        BDDMockito.given(userRepository.findById(user.getId())).willReturn(Optional.of(user));

        User userFromDB = userDAO.getByID(user.getId());

        assertEquals(user, userFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByID() throws NotFoundException {
        userDAO.getByID((long) TEST_USER_COUNT);
    }

    @Test
    public void shouldGetByEmail() throws NotFoundException {
        User user = createUser();
        BDDMockito.given(userRepository.findOneByEmail(user.getEmail())).willReturn(Optional.of(user));

        User userFromDB = userDAO.getByEmail(user.getEmail());

        assertEquals(user, userFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByEmail() throws NotFoundException {
        User user = createUser();

        BDDMockito.given(userRepository.findOneByEmail(user.getEmail()))
                .willReturn(Optional.empty());

        userDAO.getByEmail(user.getEmail());
    }

    @Test
    public void shouldGetByUsername() throws NotFoundException {
        User user = createUser();

        BDDMockito.given(userRepository.findOneByUsername(user.getUsername()))
                .willReturn(Optional.of(user));

        User userFromDB = userDAO.getByUsername(user.getUsername());

        assertEquals(user, userFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByUsername() throws NotFoundException {
        User user = createUser();

        BDDMockito.given(userRepository.findOneByUsername(user.getUsername()))
                .willReturn(Optional.empty());

        userDAO.getByUsername(user.getUsername());
    }

    @Test
    public void shouldUpdateAUser() throws NotFoundException {
        User user = createUser();

        userDAO.update(user);

        Mockito.verify(userRepository).save(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnUserUpdateGracefully() {
        User user = createUser();
        BDDMockito.given(userRepository.save(user)).willThrow(ConstraintViolationException.class);

        userDAO.update(user);
    }

    @Test
    public void shouldDeleteARegisteredUser() throws NotFoundException {
        User user = createUser();
        user.setId(42L);
        BDDMockito.given(userRepository.findById(user.getId())).willReturn(Optional.of(user));

        userDAO.delete(dummyAdmin, user.getId());

        Mockito.verify(userRepository).delete(user);
    }

    @Test
    public void shouldDeleteAnAdminIfThereAreMoreThanOne() throws NotFoundException {
        List<User> admins = createUsersList();
        admins.forEach(u -> u.setRole(UserRole.ADMIN));
        User adminToDelete = admins.get(0);
        adminToDelete.setId(42L);
        BDDMockito.given(userRepository.findById(adminToDelete.getId())).willReturn(Optional.of(adminToDelete));
        BDDMockito.given(userRepository.findByRole(UserRole.ADMIN)).willReturn(admins);

        userDAO.delete(dummyAdmin, adminToDelete.getId());

        Mockito.verify(userRepository).delete(adminToDelete);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteTheLastAdmin() throws NotFoundException {
        User admin = createAdmin();
        BDDMockito.given(userRepository.findById(admin.getId())).willReturn(Optional.of(admin));
        BDDMockito.given(userRepository.findByRole(UserRole.ADMIN)).willReturn(Collections.singletonList(admin));

        userDAO.delete(dummyAdmin, admin.getId());
    }

    @Test
    public void shouldDeleteMultipleUsers() throws NotFoundException {
        User user1 = new User();
        user1.setId(42L);
        user1.setEmail("user1@mail.de");
        user1.setEncryptedPassword("test");

        User user2 = new User();
        user2.setId(21L);
        user2.setEmail("user2@mail.de");
        user2.setEncryptedPassword("test");

        BDDMockito.given(userRepository.findAllByIdIn(Arrays.asList(user1.getId(), user2.getId())))
                .willReturn(Arrays.asList(user1, user2));

        userDAO.delete(dummyAdmin, Arrays.asList(user1.getId(), user2.getId()));

        assertEquals(userDAO.getAllByRole(UserRole.REGISTERED).size(), 0);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteMultipleUsersOnNotFound() throws NotFoundException {
        User user1 = new User();
        user1.setId(42L);
        user1.setEmail("user1@mail.de");
        user1.setUsername("user1");
        user1.setEncryptedPassword("test");

        userDAO.create(user1);
        userDAO.delete(dummyAdmin, Collections.singletonList(user1.getId()));
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailToDeleteAUserOnInvalidId() throws NotFoundException {
        userDAO.delete(dummyAdmin, -1L);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteOnlyExistingAdmin() throws NotFoundException {
        User admin = createAdmin();
        userDAO.delete(dummyAdmin, admin.getId());
    }

    private User createUser() {
        User user = new User();
        user.setUsername("user");
        user.setEmail("user@text.example");
        user.setEncryptedPassword("alex");
        return user;
    }

    private User createAdmin() {
        User admin = createUser();
        admin.setRole(UserRole.ADMIN);
        return admin;
    }

    private List<User> createUsersList() {
        List<User> users = new ArrayList<>();
        for (int i = 0; i < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("user-" + i + "@mail.de");
            u.setEncryptedPassword("test");
            users.add(u);
        }
        return users;
    }

}
