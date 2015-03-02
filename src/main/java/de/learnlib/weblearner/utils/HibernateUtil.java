package de.learnlib.weblearner.utils;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeExistsAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeTypeAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeValueAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckHeaderFieldAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckStatusAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckTextRestAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.entities.StoreSymbolActions.DeclareCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.DeclareVariableAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.IncrementCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableByJSONAttributeAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableByNodeAction;
import de.learnlib.weblearner.entities.WebSymbolActions.CheckTextWebAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClearAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClickAction;
import de.learnlib.weblearner.entities.WebSymbolActions.FillAction;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.entities.WebSymbolActions.SubmitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WaitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WebSymbolAction;
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

            // the entity classes
            configuration.addAnnotatedClass(Project.class);
            configuration.addAnnotatedClass(SymbolGroup.class);
            configuration.addAnnotatedClass(Symbol.class);
            configuration.addAnnotatedClass(SymbolAction.class);
            // Variabel & Counter
            configuration.addAnnotatedClass(DeclareCounterAction.class);
            configuration.addAnnotatedClass(DeclareVariableAction.class);
            configuration.addAnnotatedClass(IncrementCounterAction.class);
            configuration.addAnnotatedClass(SetCounterAction.class);
            configuration.addAnnotatedClass(SetVariableAction.class);
            configuration.addAnnotatedClass(SetVariableByJSONAttributeAction.class);
            configuration.addAnnotatedClass(SetVariableByNodeAction.class);
            // Web Symbols & Actions
            configuration.addAnnotatedClass(WebSymbolAction.class);
            configuration.addAnnotatedClass(CheckTextWebAction.class);
            configuration.addAnnotatedClass(ClearAction.class);
            configuration.addAnnotatedClass(ClickAction.class);
            configuration.addAnnotatedClass(FillAction.class);
            configuration.addAnnotatedClass(GotoAction.class);
            configuration.addAnnotatedClass(SubmitAction.class);
            configuration.addAnnotatedClass(WaitAction.class);
            // REST Symbols & Actions
            configuration.addAnnotatedClass(RESTSymbolAction.class);
            configuration.addAnnotatedClass(CallAction.class);
            configuration.addAnnotatedClass(CheckAttributeExistsAction.class);
            configuration.addAnnotatedClass(CheckAttributeTypeAction.class);
            configuration.addAnnotatedClass(CheckAttributeValueAction.class);
            configuration.addAnnotatedClass(CheckTextRestAction.class);
            configuration.addAnnotatedClass(CheckHeaderFieldAction.class);
            configuration.addAnnotatedClass(CheckStatusAction.class);
            // Learner entities
            configuration.addAnnotatedClass(LearnerResult.class);

            configuration.configure("/hibernate.cfg.xml");

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
                    configuration.getProperties()).build();
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
