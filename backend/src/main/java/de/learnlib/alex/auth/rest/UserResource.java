/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.auth.security.JWTHelper;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.config.dao.SettingsDAO;
import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.lang.JoseException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * REST resource to handle users.
 */
@Path("/users")
public class UserResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The UserDAO to user. */
    @Inject
    private UserDAO userDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The webhook service to use. */
    @Inject
    private WebhookService webhookService;

    /** The injected settings DAO. */
    @Inject
    private SettingsDAO settingsDAO;

    /**
     * Creates a new user.
     *
     * @param newUser
     *         The user to create
     * @return The created user (enhanced with information form the DB); an error message on failure.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(User newUser) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}).", newUser);

        if (!new EmailValidator().isValid(newUser.getEmail(), null)) {
            throw new ValidationException("The email is not valid");
        }

        final Settings settings = settingsDAO.get();

        if (user.getId() == null) { // anonymous registration
            if (!settings.isAllowUserRegistration()) {
                return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", Status.FORBIDDEN,
                        new Exception("Public user registration is not allowed."));
            }

            newUser.setRole(UserRole.REGISTERED);
            newUser.setEncryptedPassword(newUser.getPassword());

            // create user
            userDAO.create(newUser);
            LOGGER.traceExit(newUser);
            return Response.status(Status.CREATED).entity(newUser).build();
        } else {
            if (user.getRole().equals(UserRole.REGISTERED)) {
                return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", Status.UNAUTHORIZED,
                        new Exception("You are not allowed to create new accounts."));
            } else {
                newUser.setEncryptedPassword(newUser.getPassword());

                // create user
                userDAO.create(newUser);
                LOGGER.traceExit(newUser);
                return Response.status(Status.CREATED).entity(newUser).build();
            }
        }
    }

    /**
     * Get the account information about one user. This only works for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user.
     * @return Detailed information about the user.
     * @throws NotFoundException
     *         If the requested User could not be found.
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response get(@PathParam("id") Long userId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}) for user {}.", userId, user);

        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(userId)) {
            LOGGER.traceExit("only the user itself or an admin should be allowed to the account information.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.get", Status.FORBIDDEN, new UnauthorizedException("You are not allowed to get this information."));
        }

        User userById = userDAO.getById(userId);
        LOGGER.traceExit(userById);
        return Response.ok(userById).build();
    }

    /**
     * Get all users. This is only allowed for admins.
     *
     * @return A list of all users. This list can be empty.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response getAll() {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll() for user {}.", user);

        List<User> users = userDAO.getAll();

        LOGGER.traceExit(users);
        return Response.ok(users).build();
    }

    /**
     * Changes the password of the user.
     *
     * @param userId
     *         The id of the user
     * @param json
     *         The pair of oldPassword and newPassword as json
     * @return The updated user.
     * @throws NotFoundException
     *         If the requested User could not be found.
     */
    @PUT
    @Path("/{id}/password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response changePassword(@PathParam("id") Long userId, JSONObject json) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("changePassword({}, {}) for user {}.", userId, json, user);

        if (!user.getId().equals(userId)) {
            LOGGER.traceExit("Only the user is allowed to change his own password.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN, new UnauthorizedException("You are not allowed to do this."));
        }

        String oldPassword = (String) json.get("oldPassword");
        String newPassword = (String) json.get("newPassword");

        try {
            User realUser = userDAO.getById(userId);

            // make sure that the password is valid
            if (!realUser.isValidPassword(oldPassword)) {
                throw new IllegalArgumentException("Please provide your old password!");
            }

            realUser.setEncryptedPassword(newPassword);
            userDAO.update(realUser);

            LOGGER.traceExit(realUser);

            webhookService.fireEvent(user, new UserEvent.CredentialsUpdated(userId));
            return Response.ok(user).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN, e);
        }
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
     * @throws NotFoundException
     *         If the requested User could not be found.
     */
    @PUT
    @Path("/{id}/email")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response changeEmail(@PathParam("id") Long userId, JSONObject json) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("changeEmail({}, {}) for user {}.", userId, json, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            LOGGER.traceExit("Only the user or an admin is allowed to change the email.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN,
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
        return Response.ok(realUser).build();
    }

    private boolean emailIsAlreadyTaken(String email) {
        try {
            userDAO.getByEmail(email);
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    /**
     * Promotes an user to be an administrator. This can only be done by administrators.
     *
     * @param userId
     *         The ID of the user to promote.
     * @return The account information of the new administrator.
     * @throws NotFoundException
     *         If the given User could not be found.
     */
    @PUT
    @Path("/{id}/promote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response promoteUser(@PathParam("id") Long userId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("promoteUser({}) for user {}.", userId, user);

        User userToPromote = userDAO.getById(userId);
        userToPromote.setRole(UserRole.ADMIN);
        userDAO.update(userToPromote);
        LOGGER.info("User {} promoted.", user);

        LOGGER.traceExit(userToPromote);
        webhookService.fireEvent(user, new UserEvent.RoleUpdated(userToPromote));
        return Response.ok(userToPromote).build();
    }

    /**
     * Demotes an user to be an simple use (and no administrator anymore). This can only be done by administrators.
     * Please also note: At least one administrator has to remain in the system.
     *
     * @param userId
     *         The ID of the user to demote.
     * @return The account information of the formally administrator.
     * @throws NotFoundException
     *         If the given User could not be found.
     */
    @PUT
    @Path("/{id}/demote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response demoteUser(@PathParam("id") Long userId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("UserResource.demoteUser(" + userId + ") for user " + user + ".");

        // if the admin wants to revoke his own rights
        // -> take care that always one admin is in the system
        if (user.getId().equals(userId)) {
            List<User> admins = userDAO.getAllByRole(UserRole.ADMIN);
            if (admins.size() == 1) {
                throw new ValidationException("The only admin left cannot take away his own admin rights!");
            }
        }

        User userToDemote = userDAO.getById(userId);
        userToDemote.setRole(UserRole.REGISTERED);
        userDAO.update(userToDemote);

        LOGGER.traceExit(userToDemote);
        webhookService.fireEvent(user, new UserEvent.RoleUpdated(userToDemote));
        return Response.ok(userToDemote).build();
    }

    /**
     * Delete an user. This is only allowed for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user to delete.
     * @return Nothing if the user was deleted.
     * @throws NotFoundException
     *         If the given User could not be found.
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response delete(@PathParam("id") long userId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", userId, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            UnauthorizedException e = new UnauthorizedException("You are not allowed to delete this user");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.FORBIDDEN, e);
        }

        // the event is not fired if we do it after the user is deleted in the next line
        // since all webhooks registered to the user are deleted as well.
        webhookService.fireEvent(new User(userId), new UserEvent.Deleted(userId));
        userDAO.delete(userId);

        LOGGER.traceExit("User {} deleted.", userId);
        return Response.status(Status.NO_CONTENT).build();
    }

    /**
     * Deletes multiples users. An admin cannot delete himself.
     *
     * @param ids
     *         The ids of the user to delete.
     * @return Nothing if the users have been deleted.
     * @throws NotFoundException
     *         If the given Users could not be found.
     */
    @DELETE
    @Path("/batch/{ids}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response delete(@PathParam("ids") IdsList ids) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", ids, user);

        if (ids.contains(user.getId())) {
            Exception e = new Exception("You cannot delete your own account this way.");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.BAD_REQUEST, e);
        }

        userDAO.delete(ids);
        LOGGER.traceExit("User(s) {} deleted.", ids);

        ids.forEach(id -> webhookService.fireEvent(new User(id), new UserEvent.Deleted(id)));
        return Response.status(Status.NO_CONTENT).build();
    }

    /**
     * Logs in a user by generating a unique JWT for him that needs to be send in every request.
     *
     * @param user
     *         The user to login
     * @return If the user was successfully logged in: a JSON Object with the authentication token as only field.
     * @throws NotFoundException
     *         If the given User could not be found.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/login")
    public Response login(User user) throws NotFoundException {
        LOGGER.traceEntry("login({}).", user);

        try {
            User realUser = userDAO.getByEmail(user.getEmail());

            // make sure that the password is valid
            if (!realUser.isValidPassword(user.getPassword())) {
                throw new IllegalArgumentException("Please provide your correct password!");
            }

            String json = "{\"token\": \"" + JWTHelper.generateJWT(realUser) + "\"}";

            LOGGER.traceExit(json);
            return Response.ok(json).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.UNAUTHORIZED, e);
        } catch (JoseException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.INTERNAL_SERVER_ERROR, e);
        }
    }

    /**
     * Get the current logged in user.
     *
     * @return The user.
     * @throws NotFoundException
     *         If the user could not be found.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/myself")
    @RolesAllowed({"ADMIN", "REGISTERED"})
    public Response myself() throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        final User myself = userDAO.getById(user.getId());
        return Response.ok(myself).build();
    }
}
