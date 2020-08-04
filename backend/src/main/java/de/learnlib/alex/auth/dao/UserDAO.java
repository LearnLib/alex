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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.services.WebSocketService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.List;

/**
 * Implementation of a UserDAO using Hibernate.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class UserDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final int MAX_USERNAME_LENGTH = 32;

    /** The UserRepository to use. Will be injected. */
    private final UserRepository userRepository;

    /** The FileDAO to use. Will be injected. */
    private final FileDAO fileDAO;

    /** The DAO for project. */
    private final ProjectDAO projectDAO;

    /** The repository for projects. */
    private final ProjectRepository projectRepository;

    /** The WebSocketService to use. */
    private final WebSocketService webSocketService;
    private EntityManager em;

    /**
     * Creates a new UserDAO.
     *
     * @param userRepository
     *         The UserRepository to use.
     * @param fileDAO
     *         The FileDAO to use.
     * @param projectDAO
     *         The ProjectDAO to use.
     * @param projectRepository
     *         The repository for project.
     */
    @Autowired
    public UserDAO(UserRepository userRepository, FileDAO fileDAO, ProjectDAO projectDAO,
                   ProjectRepository projectRepository, @Lazy WebSocketService webSocketService, EntityManager em) {
        this.userRepository = userRepository;
        this.fileDAO = fileDAO;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.webSocketService = webSocketService;
        this.em = em;
    }

    public void create(User newUser) throws ValidationException, UnauthorizedException {

        if (userRepository.findOneByEmail(newUser.getEmail()) != null) {
            throw new ValidationException("A user with the email already exists");
        }

        if (userRepository.findOneByUsername(newUser.getUsername()) != null) {
            throw new ValidationException("A user with this username already exists");
        }

        if (!new EmailValidator().isValid(newUser.getEmail(), null)) {
            throw new ValidationException("The email is not valid");
        }

        if (newUser.getUsername().length() > MAX_USERNAME_LENGTH || !newUser.getUsername().matches("^[a-zA-Z][a-zA-Z0-9]*$")) {
            throw new ValidationException("The username is not valid!");
        }

        saveUser(newUser);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public List<User> getAllByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public User getById(Long id) throws NotFoundException {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the ID " + id + ".");
        }
        return user;
    }

    public User getByEmail(String email) throws NotFoundException {
        User user = userRepository.findOneByEmail(email);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the email '" + email + "'!");
        }
        return user;
    }

    public User getByUsername(String username) throws NotFoundException {
        User user = userRepository.findOneByUsername(username);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the username '" + username + "'!");
        }
        return user;
    }

    public void update(User user) throws ValidationException {
        saveUser(user);
    }

    public void delete(User authUser, Long id) throws NotFoundException {
        delete(authUser, getById(id));
    }

    public void delete(User authUser, List<Long> userIds) throws NotFoundException {

        final List<User> users = userRepository.findAllByIdIn(userIds);
        if (users.size() != userIds.size()) {
            throw new NotFoundException("At least one user could not be found.");
        }

        for (User user : users) {
//            user = userRepository.getOne(user.getId());
            delete(authUser, user);
            em.flush();
        }
    }

    private void delete(User authUser, User user) throws NotFoundException {
        // make sure there is at least one registered admin
        if (user.getRole().equals(UserRole.ADMIN)) {
            List<User> admins = userRepository.findByRole(UserRole.ADMIN);

            if (admins.size() == 1) {
                throw new NotFoundException("There has to be at least one admin left");
            }
        }

        //remove user from all projects in which he is a member
        for (final Project project: user.getProjectsMember()) {
            project.getMembers().removeIf(u -> u.getId().equals(user.getId()));
            projectRepository.save(project);
        }

        //remove user from all projects in which he is an owner
        for (final Project project: user.getProjectsOwner()) {
            project.getOwners().removeIf(u -> u.getId().equals(user.getId()));
            projectRepository.save(project);

            //remove the project if there is none owner left
            if (project.getOwners().isEmpty()) {

                projectDAO.delete(authUser, project.getId());
                try {
                    fileDAO.deleteProjectDirectory(user, project.getId());
                } catch (IOException e) {
                    LOGGER.info("The project has been deleted, the user directory, however, not.");
                }
            }
        }

        userRepository.delete(user);

        //close all active webSocketSessions of user and lift all corresponding locks
        webSocketService.closeAllUserSessions(user.getId());

        // delete the user directory
        try {
            fileDAO.deleteUserDirectory(user);
        } catch (IOException e) {
            LOGGER.info("The user has been deleted, the user directory, however, not.");
        }
    }

    private void saveUser(User user) {
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException | TransactionSystemException e) {
            LOGGER.info("Saving a user failed:", e);
            throw new ValidationException("The User was not created because it did not pass the validation!", e);
        }
    }
}

