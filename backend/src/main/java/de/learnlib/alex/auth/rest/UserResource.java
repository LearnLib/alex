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

package de.learnlib.alex.auth.rest;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.events.UserEvent;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.security.JwtHelper;
import de.learnlib.alex.settings.dao.SettingsDAO;
import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * REST resource to handle users.
 */
@RestController
@RequestMapping("/rest/users")
public class UserResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final int MAX_USERNAME_LENGTH = 32;

    /** The security context containing the user of the request. */
    private AuthContext authContext;

    /** The UserDAO to user. */
    private UserDAO userDAO;

    /** The webhook service to use. */
    private WebhookService webhookService;

    /** The injected settings DAO. */
    private SettingsDAO settingsDAO;

    @Autowired
    public UserResource(AuthContext authContext,
                        UserDAO userDAO,
                        WebhookService webhookService,
                        SettingsDAO settingsDAO) {
        this.authContext = authContext;
        this.userDAO = userDAO;
        this.webhookService = webhookService;
        this.settingsDAO = settingsDAO;
    }

    /**
     * Creates a new user.
     *
     * @param newUser
     *         The user to create
     * @return The created user (enhanced with information form the DB); an error message on failure.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity create(@RequestBody User newUser) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("create({}).", newUser);

        if (!new EmailValidator().isValid(newUser.getEmail(), null)) {
            throw new ValidationException("The email is not valid");
        }

        if (newUser.getUsername().length() > MAX_USERNAME_LENGTH || !newUser.getUsername().matches("^[a-zA-Z][a-zA-Z0-9]*$")) {
            throw new ValidationException("The username is not valid!");
        }

        if (usernameIsAlreadyTaken(newUser.getUsername())) {
            throw new ValidationException("The username is already taken!");
        }

        final Settings settings = settingsDAO.get();

        if (user.getId() == null) { // anonymous registration
            if (!settings.isAllowUserRegistration()) {
                return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", HttpStatus.FORBIDDEN,
                        new Exception("Public user registration is not allowed."));
            }

            newUser.setRole(UserRole.REGISTERED);
            newUser.setEncryptedPassword(newUser.getPassword());

            // create user
            userDAO.create(newUser);
            LOGGER.traceExit(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } else {
            if (user.getRole().equals(UserRole.REGISTERED)) {
                return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", HttpStatus.UNAUTHORIZED,
                        new Exception("You are not allowed to create new accounts."));
            } else {
                newUser.setEncryptedPassword(newUser.getPassword());

                // create user
                userDAO.create(newUser);
                LOGGER.traceExit(newUser);
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
    public ResponseEntity get(@PathVariable("id") Long userId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("get({}) for user {}.", userId, user);

        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(userId)) {
            LOGGER.traceExit("only the user itself or an admin should be allowed to get the account information.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.get", HttpStatus.FORBIDDEN, new UnauthorizedException("You are not allowed to get this information."));
        }

        final User userById = userDAO.getById(userId);
        LOGGER.traceExit(userById);
        return ResponseEntity.ok(userById);
    }

    /**
     * Get all users. This is only allowed for admins.
     *
     * @return A list of all users. This list can be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll() {
        LOGGER.traceEntry("getAll()");
        final List<User> users = userDAO.getAll();
        LOGGER.traceExit(users);
        return ResponseEntity.ok(users);
    }

    /**
     * Changes the password of the user.
     *
     * @param userId
     *         The id of the user
     * @param json
     *         The pair of oldPassword and newPassword as json
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/password",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity changePassword(@PathVariable("id") Long userId, @RequestBody JSONObject json) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("changePassword({}, {}) for user {}.", userId, json, user);

        if (!user.getId().equals(userId)) {
            LOGGER.traceExit("Only the user is allowed to change his own password.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", HttpStatus.FORBIDDEN, new UnauthorizedException("You are not allowed to do this."));
        }

        String oldPassword = (String) json.get("oldPassword");
        String newPassword = (String) json.get("newPassword");

        User realUser = userDAO.getById(userId);

        // make sure that the password is valid
        if (!realUser.isValidPassword(oldPassword)) {
            throw new IllegalArgumentException("Please provide your old password!");
        }

        realUser.setEncryptedPassword(newPassword);
        userDAO.update(realUser);

        LOGGER.traceExit(realUser);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(user);
    }

    /**
     * Changes the email of the user. This can only be invoked for your own account or if you are an administrator.
     * Please also note: Your new email must not be your current one and no other user should already have this email.
     *
     * @param userId
     *         The id of the user
     * @param json
     *         the json with a property 'email'
     * @return The updated user.
     */
    @PutMapping(
            value = "/{id}/email",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity changeEmail(@PathVariable("id") Long userId, @RequestBody JSONObject json) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("changeEmail({}, {}) for user {}.", userId, json, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            LOGGER.traceExit("Only the user or an admin is allowed to change the email.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", HttpStatus.FORBIDDEN,
                    new UnauthorizedException("You are not allowed to do this."));
        }

        String email = (String) json.get("email");
        User realUser = userDAO.getById(userId);

        if (!new EmailValidator().isValid(email, null)) {
            throw new ValidationException("The email is not valid!");
        }
        if (email.equals(user.getEmail())) {
            throw new ValidationException("The email is the same as the current one!");
        }

        if (emailIsAlreadyTaken(email)) {
            throw new ValidationException("The email is already taken!");
        }

        realUser.setEmail(email);
        userDAO.update(realUser);

        LOGGER.traceExit(realUser);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(realUser);
    }

    private boolean emailIsAlreadyTaken(String email) {
        try {
            userDAO.getByEmail(email);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    @PutMapping(
            value = "/{id}/username",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity changeUsername(@PathVariable("id") Long userId, @RequestBody JSONObject json) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("changeUsername({}, {}) for user {}.", userId, json, user);

        if (!user.getRole().equals(UserRole.ADMIN)) {
            LOGGER.traceExit("Only the admin is allowed to change the username.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changeUsername", HttpStatus.FORBIDDEN,
                    new UnauthorizedException("You are not allowed to do this."));
        }

        String username = (String) json.get("username");
        User realUser = userDAO.getById(userId);

        if (username.length() > MAX_USERNAME_LENGTH || !username.matches("^[a-zA-Z][a-zA-Z0-9]*$")) {
            throw new ValidationException("The username is invalid!");
        }

        if (username.equals(user.getUsername())) {
            throw new ValidationException("The username is the same as the current one!");
        }

        if (usernameIsAlreadyTaken(username)) {
            throw new ValidationException("The username is already taken!");
        }

        realUser.setUsername(username);
        userDAO.update(realUser);

        LOGGER.traceExit(realUser);

        webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
        return ResponseEntity.ok(realUser);
    }

    private boolean usernameIsAlreadyTaken(String username) {
        try {
            userDAO.getByUsername(username);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    @PutMapping(
            value = "/{id}/role",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity changeRole(@PathVariable("id") Long userId, @RequestBody JSONObject json) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("update role for user {}.", userId);

        final User userToUpdate = userDAO.getById(userId);
        final UserRole newRole = UserRole.valueOf((String) json.get("role"));
        switch (newRole) {
            case ADMIN:
                userToUpdate.setRole(newRole);
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

        userDAO.update(userToUpdate);
        LOGGER.info("Role of user {} updated.", user);
        LOGGER.traceExit(userToUpdate);
        webhookService.fireEvent(user, new UserEvent.RoleUpdated(userToUpdate));
        return ResponseEntity.ok(userToUpdate);
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
    public ResponseEntity delete(@PathVariable("id") Long userId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}) for user {}.", userId, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            UnauthorizedException e = new UnauthorizedException("You are not allowed to delete this user");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", HttpStatus.FORBIDDEN, e);
        }

        // the event is not fired if we do it after the user is deleted in the next line
        // since all webhooks registered to the user are deleted as well.
        webhookService.fireEvent(new User(userId), new UserEvent.Deleted(userId));
        userDAO.delete(userId);

        LOGGER.traceExit("User {} deleted.", userId);
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
    public ResponseEntity delete(@PathVariable("ids") List<Long> ids) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}) for user {}.", ids, user);

        if (ids.contains(user.getId())) {
            Exception e = new Exception("You cannot delete your own account this way.");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", HttpStatus.BAD_REQUEST, e);
        }

        userDAO.delete(ids);
        LOGGER.traceExit("User(s) {} deleted.", ids);

        ids.forEach(id -> webhookService.fireEvent(new User(id), new UserEvent.Deleted(id)));
        return ResponseEntity.noContent().build();
    }

    /**
     * Logs in a user by generating a unique JWT for him that needs to be send in every request.
     *
     * @param user
     *         The user to login
     * @return If the user was successfully logged in: a JSON Object with the authentication token as only field.
     */
    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity login(@RequestBody User user) {
        LOGGER.traceEntry("login({}).", user);

        try {
            User realUser = userDAO.getByEmail(user.getEmail());

            // make sure that the password is valid
            if (!realUser.isValidPassword(user.getPassword())) {
                throw new IllegalArgumentException("Please provide your correct password!");
            }

            String json = "{\"token\": \"" + JwtHelper.generateJWT(realUser) + "\"}";

            LOGGER.traceExit(json);
            return ResponseEntity.ok(json);
        } catch (JoseException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", HttpStatus.INTERNAL_SERVER_ERROR, e);
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
    public ResponseEntity myself() {
        final User user = authContext.getUser();

        final User myself = userDAO.getById(user.getId());
        return ResponseEntity.ok(myself);
    }
}
