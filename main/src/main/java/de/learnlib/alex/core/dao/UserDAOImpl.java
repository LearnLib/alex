package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.utils.HibernateUtil;
import org.hibernate.Session;

import javax.xml.bind.ValidationException;
import java.util.List;

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
        
        return users;
    }
}
