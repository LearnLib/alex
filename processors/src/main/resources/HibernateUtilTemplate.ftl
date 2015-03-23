package de.learnlib.weblearner.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

/**
 * Static class to encapsulate Hibernate for easier use.
 */
public final class HibernateUtil {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The session factory used. */
    private static final SessionFactory SESSION_FACTORY;

    /** static construction */
    static {
        try {
            // Create the SessionFactory from hibernate.cfg.xml
            Configuration configuration = new Configuration();

<#list entities as entity>
            configuration.addAnnotatedClass(${entity}.class);
</#list>

            configuration.configure("/hibernate.cfg.xml");


            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                                                    .applySettings(configuration.getProperties())
                                                    .build();
            SESSION_FACTORY = configuration.buildSessionFactory(serviceRegistry);

        } catch (Throwable ex) {
            // Log the exception.
            LOGGER.error("Initial SessionFactory creation failed.", ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private HibernateUtil() {
    }

    /**
     * Get the session factory for this project.
     * 
     * @return A session factory.
     */
    public static SessionFactory getSessionFactory() {
        return SESSION_FACTORY;
    }

    /**
     * Get the Hibernate session.
     * 
     * @return A valid session.
     */
    public static Session getSession() {
        return SESSION_FACTORY.getCurrentSession();
    }

    /**
     * Starts a transaction. If there is already a transaction nothing will happen.
     */
    public static void beginTransaction() {
        if (!transactionIsActive()) {
            getSession().beginTransaction();
            getSession().setFlushMode(FlushMode.COMMIT);
        }
    }

    /**
     * End the transaction with a commit message. If no transaction is active nothing will happen, thus after this
     * method there is no active transaction.
     */
    public static void commitTransaction() {
        if (transactionIsActive()) {
            getSession().getTransaction().commit();
        }
    }

    /**
     * End the transaction with a rollback message. If no transaction is active nothing will happen, thus after this
     * method there is no active transaction.
     */
    public static void rollbackTransaction() {
        if (transactionIsActive()) {
            getSession().getTransaction().rollback();
        }
    }

    /**
     * 
     * @return true if there is any transaction active; false otherwise.
     */
    public static boolean transactionIsActive() {
        return getSession().getTransaction().isActive();
    }

}
