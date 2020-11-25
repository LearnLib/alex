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

package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

import javax.validation.ValidationException;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class UserRepositoryIT extends AbstractRepositoryIT {

    @Test
    public void shouldSaveAValidUser() {
        User user = createUser("test_user@test.example");
        userRepository.save(user);

        Assert.assertTrue(user.getId() > 1);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailWhenSavingAnUserWithoutAnEmail() {
        User user = new User();
        user.setPassword("password");

        userRepository.save(user);
    }


    @Test(expected = ValidationException.class)
    public void shouldFailWhenSavingAnUserWithAnInvalidEmail() {
        User user = new User();
        user.setEmail("test");
        user.setPassword("password");

        userRepository.save(user);
    }

    @Test(expected = ValidationException.class)
    public void shouldFailWhenSavingAnUserWithoutPassword() {
        User user = new User();
        user.setEmail("test_user@test.example");

        userRepository.save(user);
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailOnUserSavingIfTheEMailIsAlreadyUsed() {
        User user1 = createUser("test_user@test.example");
        userRepository.save(user1);

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

        assertEquals(3, allUsersFromDB.size()); // 3 because of the default admin
        assertThat(allUsersFromDB, hasItem(equalTo(user1)));
        assertThat(allUsersFromDB, hasItem(equalTo(user2)));
    }

    @Test
    public void shouldReturnAnEmptyListWhenFetchingAllUsersButNoneExists() {
        List<User> users = userRepository.findAll();

        assertEquals(1, users.size());
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
        assertThat(allUsersFromDB.size(), is(equalTo(2)));
        assertThat(allUsersFromDB, hasItem(equalTo(user1)));
    }

    @Test
    public void shouldFetchAnExistingUserByTheID() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        User userFromDB = userRepository.findById(user.getId()).orElse(null);

        assertNotNull(userFromDB);
        assertThat(userFromDB, is(equalTo(user)));
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingUsersByTheID() {
        User userFromDB = userRepository.findById(-1L).orElse(null);
        assertNull(userFromDB);
    }

    @Test
    public void shouldFetchAnExistingUserByTheEMail() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        User userFromDB = userRepository.findOneByEmail(user.getEmail());

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

        userRepository.deleteById(user.getId());

        assertEquals(1, userRepository.count());
    }

    @Test(expected = EmptyResultDataAccessException.class)
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingUser() {
        userRepository.deleteById(-1L);
    }

}
