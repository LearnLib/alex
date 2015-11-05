package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a UserDAO using Hibernate.
 */
public class UserDAOImpl implements UserDAO {

    @Override
    public void create(User user) throws ValidationException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        try {
            session.save(user);
            HibernateUtil.commitTransaction();
        } catch (Exception e) {
            HibernateUtil.rollbackTransaction();
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
    public User getByEmail(String email) {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        User user = (User) session.createCriteria(User.class)
                .add(Restrictions.eq("email", email))
                .uniqueResult();
        HibernateUtil.commitTransaction();

        return user;
    }

    @Override
    public User getById(Long id) {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        User user = (User) session.get(User.class, id);
        HibernateUtil.commitTransaction();

        return user;
    }

    @Override
    public void delete(Long id) throws NotFoundException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        User user = (User) session.get(User.class, id);

        if (user == null) {
            throw new NotFoundException("There is no such user to delete");
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
    public void update(User user) throws ValidationException {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        session.update(user);
        HibernateUtil.commitTransaction();
    }
}
