package de.learnlib.alex;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.FileDAOImpl;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.LearnerResultDAOImpl;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.ProjectDAOImpl;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolDAOImpl;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAOImpl;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.dao.UserDAOImpl;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.core.learner.LearnerThreadFactory;
import de.learnlib.alex.security.RsaKeyHolder;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.lang.JoseException;

/**
 * Main class of the REST API. Implements the Jersey {@link ResourceConfig} and does some configuration and stuff.
 */
public class ALEXApplication extends ResourceConfig {

    /**
     * Constructor where the magic happens.
     */
    public ALEXApplication() {
        // packages with REST resources classes
        packages(true, "de.learnlib.alex");

        register(MultiPartFeature.class);
        register(RolesAllowedDynamicFeature.class); // allow protecting routes with user roles

        // register some classes/ objects for IoC.
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                LearnerResultDAOImpl learnerResultDAO = new LearnerResultDAOImpl();
                LearnerThreadFactory threadFactory = new LearnerThreadFactory(learnerResultDAO);

                bind(ProjectDAOImpl.class).to(ProjectDAO.class);
                bind(CounterDAOImpl.class).to(CounterDAO.class);
                bind(UserDAOImpl.class).to(UserDAO.class);
                bind(SymbolGroupDAOImpl.class).to(SymbolGroupDAO.class);
                bind(SymbolDAOImpl.class).to(SymbolDAO.class);
                bind(LearnerResultDAOImpl.class).to(LearnerResultDAO.class);
                bind(new Learner(threadFactory)).to(Learner.class);
                bind(FileDAOImpl.class).to(FileDAO.class);
            }
        });

        try {

            // create private public RSA key for signing JWTs
            RsaKeyHolder.setKey(RsaJwkGenerator.generateJwk(2048));

            UserDAO userDAO = new UserDAOImpl();

            // create an admin if none exists
            if (userDAO.getAllByRole(UserRole.ADMIN).size() == 0) {
                User admin = new User();
                admin.setEmail("admin@alex.de");
                admin.setRole(UserRole.ADMIN);
                admin.setEncryptedPassword("admin");

                userDAO.create(admin);
            }
        } catch (JoseException e) {
            e.printStackTrace();
            System.exit(0);
        }
    }

}
