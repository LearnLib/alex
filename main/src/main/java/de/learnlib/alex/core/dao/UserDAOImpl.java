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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import de.learnlib.alex.utils.IdsList;
import de.learnlib.alex.utils.ValidationExceptionHelper;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.exception.GenericJDBCException;
import org.springframework.stereotype.Repository;

import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a UserDAO using Hibernate.
 */
@Repository
public class UserDAOImpl implements UserDAO {

    @Override
    public void create(User user) throws ValidationException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            session.save(user);
            HibernateUtil.commitTransaction();
        } catch (ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw ValidationExceptionHelper.createValidationException("User was not created:", e);
        } catch (org.hibernate.exception.ConstraintViolationException e) {
            HibernateUtil.rollbackTransaction();
            throw new ValidationException("User was not created: " + e.getMessage(), e);
        } catch (GenericJDBCException e) {
            throw new javax.validation.ValidationException(
                    "The User was not created because it did not pass the validation!", e);
        }
    }

    @Override
    public List<User> getAll() {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked")
        List<User> users = session.createCriteria(User.class).list();

        HibernateUtil.commitTransaction();
        return users;
    }

    @Override
    public List<User> getAllByRole(UserRole role) {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        @SuppressWarnings("unchecked")
        List<User> users = session.createCriteria(User.class)
                                  .add(Restrictions.eq("role", role))
                                  .list();

        HibernateUtil.commitTransaction();
        return users;
    }

    @Override
    public User getById(Long id) throws NotFoundException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        User user;
        try {
            user = get(session, id);
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw  e;
        }

        HibernateUtil.commitTransaction();
        return user;
    }

    @Override
    public User getByEmail(String email) throws NotFoundException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        User user = (User) session.createCriteria(User.class)
                                  .add(Restrictions.eq("email", email))
                                  .uniqueResult();

        if (user == null) {
            HibernateUtil.rollbackTransaction();
            throw new NotFoundException("Could not find the user with the email '" + email + "'!");
        }

        HibernateUtil.commitTransaction();
        return user;
    }

    @Override
    public void update(User user) throws ValidationException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        session.update(user);

        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(Long id) throws NotFoundException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        User user;
        try {
            user = get(session, id);
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw  e;
        }

        // make sure there is at least one registered admin
        if (user.getRole().equals(UserRole.ADMIN)) {

            @SuppressWarnings("unchecked")
            List<User> admins = session.createCriteria(User.class)
                    .add(Restrictions.eq("role", UserRole.ADMIN))
                    .list();

            if (admins.size() == 1) {
                throw new NotFoundException("There has to be at least one admin left");
            }
        }

        session.delete(user);
        HibernateUtil.commitTransaction();
    }

    @Override
    public void delete(IdsList ids) throws NotFoundException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            for (Long id: ids) {
                User user = get(session, id);
                session.delete(user);
            }
        } catch (NotFoundException e) {
            HibernateUtil.rollbackTransaction();
            throw  e;
        }

        HibernateUtil.commitTransaction();
    }

    private User get(Session session, Long id) throws NotFoundException {
        User user = session.get(User.class, id);

        if (user == null) {
            throw new NotFoundException("Could not find the user with the ID '" + id + "'!");
        }

        return user;
    }

}
