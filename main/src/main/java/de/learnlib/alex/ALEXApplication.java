package de.learnlib.alex;

import de.learnlib.alex.core.dao.*;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.core.learner.LearnerThreadFactory;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

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
    }

}
