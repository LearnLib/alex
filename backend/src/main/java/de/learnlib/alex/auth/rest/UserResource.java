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

package de.learnlib.alex.auth.rest;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.JsonWebToken;
import de.learnlib.alex.auth.entities.UpdateEmailInput;
import de.learnlib.alex.auth.entities.UpdateMaxAllowedProcessesInput;
import de.learnlib.alex.auth.entities.UpdatePasswordInput;
import de.learnlib.alex.auth.entities.UpdateRoleInput;
import de.learnlib.alex.auth.entities.UpdateUsernameInput;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.events.UserEvent;
import de.learnlib.alex.auth.inputs.CreateUserInput;
import de.learnlib.alex.auth.inputs.LoginInput;
import de.learnlib.alex.common.exceptions.ForbiddenOperationException;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.security.JwtHelper;
import de.learnlib.alex.settings.dao.SettingsDAO;
import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.webhooks.services.WebhookService;
import java.util.ArrayList;
import java.util.List;
import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST resource to handle users.
 */
@RestController
@RequestMapping("/rest/users")
public class UserResource {

    public static final int MAX_USERNAME_LENGTH = 32;

    private final AuthContext authContext;
    private final UserDAO userDAO;
    private final WebhookService webhookService;
    private final SettingsDAO settingsDAO;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserResource(
            AuthContext authContext,
            UserDAO userDAO,
            WebhookService webhookService,
            SettingsDAO settingsDAO,
            PasswordEncoder passwordEncoder
    ) {
        this.authContext = authContext;
        this.userDAO = userDAO;
        this.webhookService = webhookService;
        this.settingsDAO = settingsDAO;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new user.
     *
     * @param input
     *         The user to create
     * @return The created user (enhanced with information form the DB); an error message on failure.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> create(@RequestBody CreateUserInput input) {
        final User user = authContext.getUser();

        if (!new EmailValidator().isValid(input.email, null)) {
            throw new ValidationException("The email is not valid");
        }

        if (input.username.length() > MAX_USERNAME_LENGTH || !input.username.matches("^[a-zA-Z][a-zA-Z0-9]*$")) {
            throw new ValidationException("The username is not valid!");
        }

        if (usernameIsAlreadyTaken(input.username)) {
            throw new ValidationException("The username is already taken!");
        }

        final Settings settings = settingsDAO.get();

        final var newUser = new User();
        newUser.setEmail(input.email);
        newUser.setUsername(input.username);
        newUser.setPassword(passwordEncoder.encode(input.password));
        newUser.setRole(UserRole.REGISTERED);

        if (user.getId() == null) { // anonymous registration
            if (!settings.isAllowUserRegistration()) {
                throw new ForbiddenOperationException("Public user registration is not allowed.");
            }
            userDAO.create(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } else {
            if (user.getRole().equals(UserRole.REGISTERED)) {
                throw new UnauthorizedException("You are not allowed to create new accounts.");
            } else {
                userDAO.create(newUser);
                return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
            }
        }
    }

    /**
     * Get the account information about one user. This only works for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user.
     * @return Detailed information about the user.
     */
    @GetMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> get(@PathVariable("id") Long userId) {
        final User user = authContext.getUser();
        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(userId)) {
            throw new ForbiddenOperationException("You are not allowed to get this information.");
        }

        final User userById = userDAO.getByID(userId);
        return ResponseEntity.ok(userById);
    }

    /**
     * Get the account information about multiple users.
     *
     * @param userIds
     *         The ids of the users.
     * @return Detailed information about the users.
     */
    @GetMapping(
            value = "/batch/{ids}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<User>> getManyUsers(@PathVariable("ids") List<Long> userIds) {
        final List<User> users = new ArrayList<>();
        for (Long id : userIds) {
            users.add(userDAO.getByID(id));
        }

        return ResponseEntity.ok(users);
    }

    /**
     * Get all users. This is only allowed for admins.
     *
     * @return A list of all users. This list can be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<User>> getAll() {
        final List<User> users = userDAO.getAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping(
            value = "/search",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<User>> getByUsernameOrEmail(@RequestParam("searchterm") String term) {
        final List<User> users = new ArrayList<>();
        try {
            if (term.contains("@")) {
                users.add(userDAO.getByEmail(term));
            } else {
                users.add(userDAO.getByUsername(term));
            }
        } catch (NotFoundException ignored) {
        }
        return ResponseEntity.ok(users);
    }

    @PutMapping(
            value = "/{id}/processes",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> changeMaxAllowedProcesses(
            @PathVariable("id") Long userId,
            @Validated @RequestBody UpdateMaxAllowedProcessesInput input
    ) {
        final var user = authContext.getUser();
        final var updatedUser = userDAO.updateMaxAllowedProcesses(user, input);
        return ResponseEntity.ok(updatedUser);
    }


    /**
     * Changes the password of the user.
     *
     * @param userId
     *         The id of the user
     * @param input
     *         The pair of oldPassword and newPassword as json
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/password",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> changePassword(
            @PathVariable("id") Long userId,
            @Validated @RequestBody UpdatePasswordInput input
    ) {
        final var user = authContext.getUser();
        if (!user.getId().equals(userId)) {
            throw new ForbiddenOperationException("You are not allowed to do this.");
        }

        final var realUser = userDAO.getByID(userId);
        if (!passwordEncoder.matches(input.getOldPassword(), realUser.getPassword())) {
            throw new ValidationException("Please provide your old password!");
        }

        realUser.setPassword(passwordEncoder.encode(input.getNewPassword()));

        final var updatedUser = userDAO.update(realUser);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Changes the email of the user. This can only be invoked for your own account or if you are an administrator.
     * Please also note: Your new email must not be your current one and no other user should already have this email.
     *
     * @param userId
     *         The id of the user
     * @param input
     *         The input with the new email.
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/email",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> changeEmail(
            @PathVariable("id") Long userId,
            @Validated @RequestBody UpdateEmailInput input
    ) {
        final User user = authContext.getUser();

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            throw new UnauthorizedException("You are not allowed to do this.");
        }

        if (emailIsAlreadyTaken(input.getEmail())) {
            throw new ValidationException("The email is already taken!");
        }

        final var realUser = userDAO.getByID(userId);
        realUser.setEmail(input.getEmail());

        final var updatedUser = userDAO.update(realUser);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Changes the username of the user. This can only be invoked if you are an administrator.
     * Your new username must not be your current one and no other user should already have this username.
     *
     * @param userId
     *         The id of the user.
     * @param input
     *         The input with a new username.
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/username",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> changeUsername(
            @PathVariable("id") Long userId,
            @Validated @RequestBody UpdateUsernameInput input
    ) {
        final var user = authContext.getUser();

        if (!user.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenOperationException("You are not allowed to do this.");
        } else if (usernameIsAlreadyTaken(input.getUsername())) {
            throw new ValidationException("The username is already taken!");
        }

        final var userInDB = userDAO.getByID(userId);
        userInDB.setUsername(input.getUsername());

        final var updatedUser = userDAO.update(userInDB);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Update the role of a user.
     *
     * @param userId
     *         The ID of the user to update.
     * @param input
     *         The input with the new role.
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/role",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> changeRole(
            @PathVariable("id") Long userId,
            @Validated @RequestBody UpdateRoleInput input
    ) {
        final User user = authContext.getUser();
        final User userToUpdate = userDAO.getByID(userId);

        switch (input.getRole()) {
            case ADMIN:
                userToUpdate.setRole(input.getRole());
                break;
            case REGISTERED:
                // if the admin wants to revoke his own rights
                // -> take care that always one admin is in the system
                if (user.getId().equals(userId)) {
                    final List<User> admins = userDAO.getAllByRole(UserRole.ADMIN);
                    if (admins.size() == 1) {
                        throw new ValidationException("The only admin left cannot take away his own admin rights!");
                    }
                }
                userToUpdate.setRole(UserRole.REGISTERED);
                break;
            default:
                throw new ValidationException("Cannot update role.");
        }

        final var updatedUser = userDAO.update(userToUpdate);
        webhookService.fireEvent(user, new UserEvent.RoleUpdated(updatedUser));
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete an user. This is only allowed for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user to delete.
     * @return Nothing if the user was deleted.
     */
    @DeleteMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<String> delete(@PathVariable("id") Long userId) {
        final User user = authContext.getUser();

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenOperationException("You are not allowed to delete this user.");
        }

        // the event is not fired if we do it after the user is deleted in the next line
        // since all webhooks registered to the user are deleted as well.
        webhookService.fireEvent(new User(userId), new UserEvent.Deleted(userId));
        userDAO.delete(user, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Deletes multiples users. An admin cannot delete himself.
     *
     * @param ids
     *         The ids of the user to delete.
     * @return Nothing if the users have been deleted.
     */
    @DeleteMapping(
            value = "/batch/{ids}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<String> delete(@PathVariable("ids") List<Long> ids) {
        final User user = authContext.getUser();

        if (ids.contains(user.getId())) {
            throw new IllegalArgumentException("You cannot delete your own account this way.");
        }

        userDAO.delete(user, ids);

        ids.forEach(id -> webhookService.fireEvent(new User(id), new UserEvent.Deleted(id)));
        return ResponseEntity.noContent().build();
    }

    /**
     * Logs in a user by generating a unique JWT for him that needs to be send in every request.
     *
     * @param input
     *         The user to login
     * @return If the user was successfully logged in: a JSON Object with the authentication token as only field.
     */
    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<JsonWebToken> login(@Validated @RequestBody LoginInput input) {
        try {
            final var user = userDAO.getByEmail(input.email);

            if (!passwordEncoder.matches(input.password, user.getPassword())) {
                throw new IllegalArgumentException("Please provide your correct password!");
            }

            final var jwt = new JsonWebToken(JwtHelper.generateJWT(user));

            return ResponseEntity.ok(jwt);
        } catch (JoseException e) {
            throw new UnauthorizedException();
        }
    }

    /**
     * Get the current logged in user.
     *
     * @return The user.
     */
    @GetMapping(
            value = "/myself",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<User> myself() {
        final User user = authContext.getUser();

        final User myself = userDAO.getByID(user.getId());
        return ResponseEntity.ok(myself);
    }

    private boolean usernameIsAlreadyTaken(String username) {
        try {
            userDAO.getByUsername(username);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    private boolean emailIsAlreadyTaken(String email) {
        try {
            userDAO.getByEmail(email);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }
}
