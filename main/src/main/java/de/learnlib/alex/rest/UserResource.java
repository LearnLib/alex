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

package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.JWTHelper;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.IdsList;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.lang.JoseException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
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
import javax.xml.bind.ValidationException;
import java.util.List;

/**
 * REST resource to handle users.
 * @resourcePath users
 * @resourceDescription Operations around users.
 */
@Path("/users")
public class UserResource {

    /** The logger to use. */
    private static final Logger LOGGER = LogManager.getLogger();

    /** The UserDAO to user. */
    @Inject
    private UserDAO userDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /**
     * Creates a new user.
     *
     * @param user
     *         The user to create
     * @return The created user (enhanced with information form the DB); an error message on failure.
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(User user) {
        LOGGER.traceEntry("create({}).", user);
        try {
            // validate email address
            if (!new EmailValidator().isValid(user.getEmail(), null)) {
                throw new ValidationException("The email is not valid");
            }

            user.setEncryptedPassword(user.getPassword());

            // create user
            userDAO.create(user);
            LOGGER.traceExit(user);
            return Response.status(Status.CREATED).entity(user).build();
        } catch (ValidationException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.create", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Get the account information about one user.
     * This only works for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user.
     * @return Detailed information about the user.
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 200 Ok
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   403 forbidden   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response get(@PathParam("id") Long userId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}) for user {}.", userId, user);

        if (!user.getRole().equals(UserRole.ADMIN) && !user.getId().equals(userId)) {
            LOGGER.traceExit("only the user itself or an admin should be allowed to the account information.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.get", Status.FORBIDDEN, null);
        }

        try {
            User userById = userDAO.getById(userId);
            LOGGER.traceExit(userById);
            return Response.ok(userById).build();
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.get", Status.NOT_FOUND, e);
        }
    }

    /**
     * Get all users.
     * This is only allowed for admins.
     *
     * @return A list of all users.
     * @responseType java.util.List<de.learnlib.alex.core.entities.User>
     * @successResponse 200 Ok
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response getAll() {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll() for user {}.", user);

        List<User> users = userDAO.getAll();

        LOGGER.traceExit(users);
        return ResponseHelper.renderList(users, Status.OK);
    }

    /**
     * Changes the password of the user.
     *
     * @param userId
     *         The id of the user
     * @param json
     *         The pair of oldPasswordn and newPassword as json
     * @return The updated user.
     *
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 200 Ok
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   403 forbidden   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}/password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response changePassword(@PathParam("id") Long userId, JSONObject json) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("changePassword({}, {}) for user {}.", userId , json, user);

        if (!user.getId().equals(userId)) {
            LOGGER.traceExit("Only the user is allowed to change his own password.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN, null);
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
            return Response.ok(user).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN, e);
        } catch (NotFoundException e) {
            // This should never happen!
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.NOT_FOUND, e);
        }
    }

    /**
     * Changes the email of the user.
     * This can only be invoked for your own account or if you are an administrator.
     * Please also note: Your new email must not be your current one and no other user should already have this email.
     *
     * @param userId
     *         The id of the user
     * @param json
     *         the json with a property 'email'
     * @return The updated user.
     *
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 200 Ok
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   403 forbidden   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}/email")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response changeEmail(@PathParam("id") Long userId, JSONObject json) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("changeEmail({}, {}) for user {}.", userId, json, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            LOGGER.traceExit("Only the user or an admin is allowed to change the email.");
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changePassword", Status.FORBIDDEN, null);
        }

        String email = (String) json.get("email");
        try {
            User realUser = userDAO.getById(userId);

            if (!new EmailValidator().isValid(email, null)) {
                throw new ValidationException("The email is not valid!");
            }
            if (email.equals(user.getEmail())) {
                throw new ValidationException("The email is the same as the current one!");
            }

            // check if the new email is already taken
            try {
                userDAO.getByEmail(email);
                throw new ValidationException("The email is already taken!");
            } catch (NotFoundException e) {
                // email is free, let's move on
            }

            realUser.setEmail(email);
            userDAO.update(realUser);

            LOGGER.traceExit(realUser);
            return Response.ok(realUser).build();
        } catch (ValidationException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changeEmail", Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.changeEmail", Status.NOT_FOUND, e);
        }
    }

    /**
     * Promotes an user to be an administrator.
     * This can only be done by administrators.
     *
     * @param userId
     *         The ID of the user to promote.
     * @return The account information of the new administrator.
     *
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 200 Ok
     * @errorResponse   404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}/promote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response promoteUser(@PathParam("id") Long userId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("promoteUser({}) for user {}.", userId, user);

        try {
            User userToPromote = userDAO.getById(userId);
            userToPromote.setRole(UserRole.ADMIN);
            userDAO.update(userToPromote);
            LOGGER.info("User {} promoted.", user);

            LOGGER.traceExit(userToPromote);
            return Response.ok(userToPromote).build();
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.promoteUser", Status.NOT_FOUND, e);
        }
    }

    /**
     * Demotes an user to be an simple use (and no administrator anymore).
     * This can only be done by administrators.
     * Please also note: At least one administrator has to remain in the system.
     *
     * @param userId
     *         The ID of the user to demote.
     * @return The account information of the formally administrator.
     * @responseType de.learnlib.alex.core.entities.User
     * @successResponse 200 Ok
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}/demote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response demoteUser(@PathParam("id") Long userId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("UserResource.demoteUser(" + userId + ") for user " + user + ".");

        try {
            // if the admin wants to revoke his own rights
            // -> take care that always one admin is in the system
            if (user.getId().equals(userId)) {
                List<User> admins = userDAO.getAllByRole(UserRole.ADMIN);
                if (admins.size() == 1) {
                    throw new BadRequestException("The only admin left cannot take away his own admin rights!");
                }
            }

            User userToDemote = userDAO.getById(userId);
            userToDemote.setRole(UserRole.REGISTERED);
            userDAO.update(userToDemote);

            LOGGER.traceExit(userToDemote);
            return Response.ok(userToDemote).build();
        } catch (BadRequestException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.demoteUser", Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.demoteUser", Status.NOT_FOUND, e);
        }
    }

    /**
     * Delete an user.
     * This is only allowed for your own account or if you are an administrator.
     *
     * @param userId
     *         The ID of the user to delete.
     * @return Nothing if the user was deleted.
     *
     * @successResponse 204 No Content
     * @errorResponse 400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response delete(@PathParam("id") long userId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", userId, user);

        if (!user.getId().equals(userId) && !user.getRole().equals(UserRole.ADMIN)) {
            UnauthorizedException e = new UnauthorizedException("You are not allowed to delete this user");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.FORBIDDEN, e);
        }

        try {
            userDAO.delete(userId);

            LOGGER.traceExit("User {} deleted.", userId);
            return Response.status(Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.NOT_FOUND, e);
        }
    }

    /**
     * Deletes multiples users.
     * An admin cannot delete himself.
     *
     * @param ids
     *          The ids of the user to delete.
     * @return Nothing if the users have been deleted.
     *
     * @successResponse 204 No Content
     * @errorResponse 400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("/batch/{ids}")
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response delete(@PathParam("ids") IdsList ids) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", ids, user);

        if (ids.contains(user.getId())) {
            Exception e = new Exception("You cannot delete your own account this way.");
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.BAD_REQUEST, e);
        }

        try {
            userDAO.delete(ids);

            LOGGER.traceExit("User(s) {} deleted.", ids);
            return Response.status(Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.NOT_FOUND, e);
        }
    }


    /**
     * Logs in a user by generating a unique JWT for him that needs to be send in every request.
     *
     * @param user
     *         The user to login
     * @return If the user was successfully logged in: a JSON Object with the authentication token as only field;
     *         An error otherwise.
     *
     * @successResponse 200 Ok
     * @errorResponse   401 unauthorized `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found    `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/login")
    public Response login(User user) {
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
        } catch (NotFoundException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.NOT_FOUND, e);
        } catch (JoseException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("UserResource.delete", Status.INTERNAL_SERVER_ERROR, e);
        }
    }

}
