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

package de.learnlib.alex.integrationtests;

import de.learnlib.alex.core.dao.UserRepository;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import org.junit.After;
import org.junit.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.orm.jpa.JpaSystemException;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class UserRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private UserRepository userRepository;

    @After
    public void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    public void shouldSaveAValidUser() {
        User user = createUser("test_user@test.example");

        userRepository.save(user);

        assertTrue(user.getId() > 0);
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldFailWhenSavingAnUserWithoutAnEmail() {
        User user = new User();
        user.setPassword("password");

        userRepository.save(user); // should fail
    }


    @Test(expected = ConstraintViolationException.class)
    public void shouldFailWhenSavingAnUserWithAnInvalidEmail() {
        User user = new User();
        user.setEmail("test");
        user.setPassword("password");

        userRepository.save(user); // should fail
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldFailWhenSavingAnUserWithoutAnPassword() {
        User user = new User();
        user.setEmail("test_user@test.example");

        userRepository.save(user); // should fail
    }

    @Test(expected = JpaSystemException.class)
    public void shouldFailOnUserSavingIfTheEMailIsAlreadyUsed() {
        User user1 = createUser("test_user@test.example");
        user1 = userRepository.save(user1);
        assertNotNull(user1.getId());
        User user2 = createUser("test_user@test.example");

        userRepository.save(user2); // should fail
    }

    @Test
    public void shouldFetchAllUsers() {
        User user1 = createUser("test_user_1@test.example");
        user1 = userRepository.save(user1);
        User user2 = createUser("test_user_2@test.example");
        user2 = userRepository.save(user2);

        List<User> allUsersFromDB = userRepository.findAll();

        assertThat(allUsersFromDB.size(), is(equalTo(2)));
        assertThat(allUsersFromDB, hasItem(equalTo(user1)));
        assertThat(allUsersFromDB, hasItem(equalTo(user2)));
    }

    @Test
    public void shouldReturnAnEmptyListWhenFetchingAllUsersButNoneExists() {
        List<User> users = userRepository.findAll();

        assertTrue(users.isEmpty());
    }

    @Test
    public void shouldFetchAllUsersWithAnRoleOfRegistered() {
        User user1 = createUser("test_user_1@test.example");
        user1.setRole(UserRole.ADMIN);
        userRepository.save(user1);
        User user2 = createUser("test_user_2@test.example");
        userRepository.save(user2);

        List<User> allUsersFromDB = userRepository.findByRole(UserRole.REGISTERED);
        assertThat(allUsersFromDB.size(), is(equalTo(1)));
        assertThat(allUsersFromDB, hasItem(equalTo(user2)));
    }

    @Test
    public void shouldFetchAllUsersWithAnRoleOfAdmin() {
        User user1 = createUser("test_user_1@test.example");
        user1.setRole(UserRole.ADMIN);
        user1 = userRepository.save(user1);
        User user2 = createUser("test_user_2@test.example");
        userRepository.save(user2);

        List<User> allUsersFromDB = userRepository.findByRole(UserRole.ADMIN);
        assertThat(allUsersFromDB.size(), is(equalTo(1)));
        assertThat(allUsersFromDB, hasItem(equalTo(user1)));
    }

    @Test
    public void shouldFetchAnExistingUserByTheID() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        User userFromDB = userRepository.findOne(user.getId());

        assertNotNull(userFromDB);
        assertThat(userFromDB, is(equalTo(user)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingUsersByTheID() {
        User userFromDB = userRepository.findOne(-1L);

        assertNull(userFromDB);
    }

    @Test
    public void shouldFetchAnExistingUserByTheEMail() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        User userFromDB = userRepository.findOneByEmail(user.getEmail());

        assertNotNull(userFromDB);
        assertThat(userFromDB, is(equalTo(user)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingUsersByTheEMail() {
        User userFromDB = userRepository.findOneByEmail("test_user@test.example");

        assertNull(userFromDB);
    }

    @Test
    public void shouldDeleteAnUser() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        userRepository.delete(user.getId());

        assertThat(userRepository.count(), is(equalTo(0L)));
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingUser() {
        userRepository.delete(-1L);
    }

}
