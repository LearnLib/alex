/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import java.util.List;
import java.util.Optional;
import javax.validation.ValidationException;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

public class UserRepositoryIT extends AbstractRepositoryIT {

    @Test
    public void shouldSaveAValidUser() {
        User user = createUser("test_user@test.example");
        userRepository.save(user);

        assertTrue(user.getId() > 1);
    }

    @Test
    public void shouldFailWhenSavingAnUserWithoutAnEmail() {
        User user = new User();
        user.setPassword("password");

        assertThrows(ValidationException.class, () -> userRepository.save(user));
    }


    @Test
    public void shouldFailWhenSavingAnUserWithAnInvalidEmail() {
        User user = new User();
        user.setEmail("test");
        user.setPassword("password");

        assertThrows(ValidationException.class, () -> userRepository.save(user));
    }

    @Test
    public void shouldFailWhenSavingAnUserWithoutPassword() {
        User user = new User();
        user.setEmail("test_user@test.example");

        assertThrows(ValidationException.class, () -> userRepository.save(user));
    }

    @Test
    public void shouldFailOnUserSavingIfTheEMailIsAlreadyUsed() {
        User user1 = createUser("test_user@test.example");
        userRepository.save(user1);

        User user2 = createUser("test_user@test.example");
        assertThrows(DataIntegrityViolationException.class, () -> userRepository.save(user2));
    }

    @Test
    public void shouldFetchAllUsers() {
        User user1 = createUser("test_user_1@test.example");
        user1 = userRepository.save(user1);
        User user2 = createUser("test_user_2@test.example");
        user2 = userRepository.save(user2);

        List<User> allUsersFromDB = userRepository.findAll();

        assertEquals(3, allUsersFromDB.size()); // 3 because of the default admin
        assertTrue(allUsersFromDB.contains(user1));
        assertTrue(allUsersFromDB.contains(user2));
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

        assertEquals(1, allUsersFromDB.size());
        assertTrue(allUsersFromDB.contains(user2));
    }

    @Test
    public void shouldFetchAllUsersWithAnRoleOfAdmin() {
        User user1 = createUser("test_user_1@test.example");
        user1.setRole(UserRole.ADMIN);
        user1 = userRepository.save(user1);
        User user2 = createUser("test_user_2@test.example");
        userRepository.save(user2);

        List<User> allUsersFromDB = userRepository.findByRole(UserRole.ADMIN);

        assertEquals(2, allUsersFromDB.size());
        assertTrue(allUsersFromDB.contains(user1));
    }

    @Test
    public void shouldFetchAnExistingUserByTheID() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        User userFromDB = userRepository.findById(user.getId()).orElse(null);

        assertNotNull(userFromDB);
        assertEquals(user, userFromDB);
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

        Optional<User> userFromDB = userRepository.findOneByEmail(user.getEmail());

        assertTrue(userFromDB.isPresent());
        assertEquals(user, userFromDB.get());
    }

    @Test
    public void shouldReturnNullWhenFetchingANonExistingUsersByTheEMail() {
        Optional<User> userFromDB = userRepository.findOneByEmail("test_user@test.example");

        assertTrue(userFromDB.isEmpty());
    }

    @Test
    public void shouldDeleteAnUser() {
        User user = createUser("test_user@test.example");
        user = userRepository.save(user);

        userRepository.deleteById(user.getId());

        assertEquals(1, userRepository.count());
    }

    @Test
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingUser() {
        assertThrows(EmptyResultDataAccessException.class, () -> userRepository.deleteById(-1L));
    }

}
