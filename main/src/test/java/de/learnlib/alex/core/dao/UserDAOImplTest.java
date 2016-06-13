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
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class UserDAOImplTest {

    private static final int TEST_USER_COUNT = 3;

    @Mock
    private UserRepository userRepository;

    private UserDAO userDAO;

    @Before
    public void setUp() throws NotFoundException {
        userDAO = new UserDAOImpl(userRepository);
    }

    @Test
    public void shouldCreateAValidUser() throws NotFoundException {
        User user = createUser();

        userDAO.create(user);

        verify(userRepository).save(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionsOnUserCreationGracefully() {
        User user = createUser();
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("User is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException = new TransactionSystemException("Spring TransactionSystemException", rollbackException);
        given(userRepository.save(user)).willThrow(transactionSystemException);

        userDAO.create(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnUserCreationGracefully() {
        User user = createUser();
        given(userRepository.save(user)).willThrow(ConstraintViolationException.class);

        userDAO.create(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleJpaSystemExceptionOnUserCreationGracefully() {
        User user = createUser();
        given(userRepository.save(user)).willThrow(JpaSystemException.class);

        userDAO.create(user);
    }

    @Test
    public void shouldGetAllUsers() {
        List<User> users = createUsersList();
        given(userRepository.findAll()).willReturn(users);

        List<User> allUsers = userDAO.getAll();

        assertThat(allUsers.size(), is(equalTo(users.size())));
        for (User u : allUsers) {
            assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldOnlyGetAllAdmins() {
        List<User> users = createUsersList();
        given(userRepository.findByRole(UserRole.ADMIN)).willReturn(users);

        List<User> allAdmins = userDAO.getAllByRole(UserRole.ADMIN);

        assertThat(allAdmins.size(), is(equalTo(users.size())));
        for (User u : allAdmins) {
            assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldGetAllRegisteredUsers() {
        List<User> users = createUsersList();
        given(userRepository.findByRole(UserRole.REGISTERED)).willReturn(users);

        List<User> allRegistered = userDAO.getAllByRole(UserRole.REGISTERED);

        assertThat(allRegistered.size(), is(equalTo(users.size())));
        for (User u : allRegistered) {
            assertTrue(users.contains(u));
        }
    }

    @Test
    public void shouldGetByID() throws NotFoundException {
        User user = createUser();
        given(userRepository.findOne(user.getId())).willReturn(user);

        User userFromDB = userDAO.getById(user.getId());

        assertEquals(user, userFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByID() throws NotFoundException {
        User user = createUser();
        given(userRepository.findOne(user.getId())).willReturn(null);

        userDAO.getById((long) TEST_USER_COUNT);
    }

    @Test
    public void shouldGetByEmail() throws NotFoundException {
        User user = createUser();
        given(userRepository.findOneByEmail(user.getEmail())).willReturn(user);

        User userFromDB = userDAO.getByEmail(user.getEmail());

        assertEquals(user, userFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheUserCanNotBeFoundByEmail() throws NotFoundException {
        User user = createUser();
        given(userRepository.findOneByEmail(user.getEmail())).willReturn(null);

        userDAO.getByEmail(user.getEmail());
    }

    @Test
    public void shouldUpdateAUser() throws NotFoundException {
        User user = createUser();

        userDAO.update(user);

        verify(userRepository).save(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionsOnUserUpdateGracefully() {
        User user = createUser();
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("User is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException = new TransactionSystemException("Spring TransactionSystemException", rollbackException);
        given(userRepository.save(user)).willThrow(transactionSystemException);

        userDAO.update(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnUserUpdateGracefully() {
        User user = createUser();
        given(userRepository.save(user)).willThrow(ConstraintViolationException.class);

        userDAO.update(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleJpaSystemExceptionOnUserUpdateGracefully() {
        User user = createUser();
        given(userRepository.save(user)).willThrow(JpaSystemException.class);

        userDAO.update(user);
    }

    @Test
    public void shouldDeleteARegisteredUser() throws NotFoundException {
        User user = createUser();
        given(userRepository.findOne(user.getId())).willReturn(user);

        userDAO.delete(user.getId());

        verify(userRepository).delete(user);
    }

    @Test
    public void shouldDeleteAnAdminIfThereAreMoreThanOne() throws NotFoundException {
        List<User> admins = createUsersList();
        admins.forEach(u -> u.setRole(UserRole.ADMIN));
        User adminToDelete = admins.get(0);
        given(userRepository.findOne(adminToDelete.getId())).willReturn(adminToDelete);
        given(userRepository.findByRole(UserRole.ADMIN)).willReturn(admins);

        userDAO.delete(adminToDelete.getId());

        verify(userRepository).delete(adminToDelete);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteTheLastAdmin() throws NotFoundException {
        User admin = createAdmin();
        given(userRepository.findOne(admin.getId())).willReturn(admin);
        given(userRepository.findByRole(UserRole.ADMIN)).willReturn(Collections.singletonList(admin));

        userDAO.delete(admin.getId());
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailToDeleteAUserOnInvalidId() throws NotFoundException {
        userDAO.delete(-1L);
    }

    @Test(expected = NotFoundException.class)
    public void shouldNotDeleteOnlyExistingAdmin() throws NotFoundException {
        User admin = createAdmin();
        userDAO.delete(admin.getId());
    }

    private User createUser() {
        User user = new User();
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
        for (int i = 0; i  < TEST_USER_COUNT; i++) {
            User u = new User();
            u.setEmail("user-" + String.valueOf(i) + "@mail.de");
            u.setEncryptedPassword("test");
            users.add(u);
        }
        return users;
    }

}
