/*
 * Copyright 2015 - 2021 TU Dortmund
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

import de.learnlib.alex.auth.entities.UpdateMaxAllowedProcessesInput;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.services.WebSocketService;
import java.io.IOException;
import java.util.List;
import javax.persistence.EntityManager;
import javax.validation.Validation;
import javax.validation.ValidationException;
import javax.validation.Validator;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of a UserDAO using Hibernate.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class UserDAO {

    private static final Logger logger = LoggerFactory.getLogger(UserDAO.class);

    private static final int MAX_USERNAME_LENGTH = 32;

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private final UserRepository userRepository;
    private final FileDAO fileDAO;
    private final ProjectDAO projectDAO;
    private final ProjectRepository projectRepository;
    private final WebSocketService webSocketService;
    private final EntityManager entityManager;

    @Autowired
    public UserDAO(
            UserRepository userRepository,
            FileDAO fileDAO,
            ProjectDAO projectDAO,
            ProjectRepository projectRepository,
            @Lazy WebSocketService webSocketService,
            EntityManager entityManager
    ) {
        this.userRepository = userRepository;
        this.fileDAO = fileDAO;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.webSocketService = webSocketService;
        this.entityManager = entityManager;
    }

    public User create(User newUser) {
        if (userRepository.findOneByEmail(newUser.getEmail()).isPresent()) {
            throw new ValidationException("A user with the email already exists");
        }

        if (userRepository.findOneByUsername(newUser.getUsername()).isPresent()) {
            throw new ValidationException("A user with this username already exists");
        }

        if (!new EmailValidator().isValid(newUser.getEmail(), null)) {
            throw new ValidationException("The email is not valid");
        }

        if (newUser.getUsername().length() > MAX_USERNAME_LENGTH
                || !newUser.getUsername().matches("^[a-zA-Z][a-zA-Z0-9]*$")) {
            throw new ValidationException("The username is not valid!");
        }

        return userRepository.save(newUser);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public List<User> getAllByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public User getByID(Long id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Could not find the user with the ID " + id + ".")
        );
    }

    public User getByEmail(String email) {
        return userRepository.findOneByEmail(email).orElseThrow(() ->
                new NotFoundException("Could not find the user with the email '" + email + "'!")
        );
    }

    public User getByUsername(String username) {
        return userRepository.findOneByUsername(username).orElseThrow(() ->
                new NotFoundException("Could not find the user with username'" + username + "'!")
        );
    }

    public User update(User user) {
        return userRepository.save(user);
    }

    public void delete(User authUser, Long id) {
        delete(authUser, getByID(id));
    }

    public void delete(User authUser, List<Long> userIds) {
        final List<User> users = userRepository.findAllByIdIn(userIds);
        if (users.size() != userIds.size()) {
            throw new NotFoundException("At least one user could not be found.");
        }

        for (User user : users) {
            delete(authUser, user);
            entityManager.flush();
        }
    }

    public User updateMaxAllowedProcesses(User user, UpdateMaxAllowedProcessesInput input) {
        final var userInDB = userRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("The user could not be found."));

        for (var cve : validator.validate(input, UpdateMaxAllowedProcessesInput.class)) {
            throw new ValidationException(cve.getMessage());
        }

        userInDB.setMaxAllowedProcesses(input.getMaxAllowedProcesses());

        return userRepository.save(userInDB);
    }

    private void delete(User authUser, User user) {
        // make sure there is at least one registered admin
        if (user.getRole().equals(UserRole.ADMIN)) {
            List<User> admins = userRepository.findByRole(UserRole.ADMIN);

            if (admins.size() == 1) {
                throw new NotFoundException("There has to be at least one admin left");
            }
        }

        // remove user from all projects in which he is a member
        for (final Project project : user.getProjectsMember()) {
            project.getMembers().removeIf(u -> u.getId().equals(user.getId()));
            projectRepository.save(project);
        }

        // remove user from all projects in which he is an owner
        for (final Project project : user.getProjectsOwner()) {
            project.getOwners().removeIf(u -> u.getId().equals(user.getId()));
            projectRepository.save(project);

            //remove the project if there is none owner left
            if (project.getOwners().isEmpty()) {

                projectDAO.delete(authUser, project.getId());
                try {
                    fileDAO.deleteProjectDirectory(user, project.getId());
                } catch (IOException e) {
                    logger.info("The project has been deleted, the user directory, however, not.");
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
            logger.info("The user has been deleted, the user directory, however, not.");
        }
    }

}
