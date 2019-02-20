/*
 * Copyright 2015 - 2019 TU Dortmund
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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.List;

/**
 * Implementation of a UserDAO using Hibernate.
 */
@Service
public class UserDAOImpl implements UserDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The UserRepository to use. Will be injected. */
    private final UserRepository userRepository;

    /** The FileDAO to use. Will be injected. */
    private final FileDAO fileDAO;

    /** The DAO for project. */
    private final ProjectDAO projectDAO;

    /** The repository for projects. */
    private final ProjectRepository projectRepository;

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
    @Inject
    public UserDAOImpl(UserRepository userRepository, FileDAO fileDAO, ProjectDAO projectDAO,
                       ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.fileDAO = fileDAO;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional
    public void create(User user) throws ValidationException {
        if (userRepository.findOneByEmail(user.getEmail()) != null) {
            throw new ValidationException("A user with the email already exists");
        }

        saveUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    @Transactional(readOnly = true)
    public User getById(Long id) throws NotFoundException {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the ID " + id + ".");
        }
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User getByEmail(String email) throws NotFoundException {
        User user = userRepository.findOneByEmail(email);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the email '" + email + "'!");
        }
        return user;
    }

    @Override
    @Transactional
    public void update(User user) throws ValidationException {
        saveUser(user);
    }

    @Override
    @Transactional
    public void delete(Long id) throws NotFoundException {
        delete(getById(id));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(List<Long> userIds) throws NotFoundException {
        final List<User> users = userRepository.findAllByIdIn(userIds);
        if (users.size() != userIds.size()) {
            throw new NotFoundException("At least one user could not be found.");
        }

        for (User user : users) {
            delete(user);
        }
    }

    private void delete(User user) throws NotFoundException {
        // make sure there is at least one registered admin
        if (user.getRole().equals(UserRole.ADMIN)) {
            List<User> admins = userRepository.findByRole(UserRole.ADMIN);

            if (admins.size() == 1) {
                throw new NotFoundException("There has to be at least one admin left");
            }
        }

        for (Project project : projectRepository.findAllByUser_Id(user.getId())) {
            projectDAO.delete(user, project.getId());
        }
        userRepository.delete(user);

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
