package de.learnlib.alex;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.LearnerResultDAOImpl;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.ProjectDAOImpl;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolDAOImpl;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAOImpl;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.core.learner.LearnerThreadFactory;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

/**
 * Main class of the REST API. Implements the Jersey {@link ResourceConfig} and does some configuration and stuff.
 */
public class WeblearnerApplication extends ResourceConfig {

    /**
     * Constructor where the magic happens.
     */
    public WeblearnerApplication() {
        // packages with REST resources classes
        packages(true, "de.learnlib.alex");

        // register some classes/ objects for IoC.
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                LearnerResultDAOImpl learnerResultDAO = new LearnerResultDAOImpl();
                LearnerThreadFactory threadFactory = new LearnerThreadFactory(learnerResultDAO);

                bind(ProjectDAOImpl.class).to(ProjectDAO.class);
                bind(CounterDAOImpl.class).to(CounterDAO.class);
                bind(SymbolGroupDAOImpl.class).to(SymbolGroupDAO.class);
                bind(SymbolDAOImpl.class).to(SymbolDAO.class);
                bind(LearnerResultDAOImpl.class).to(LearnerResultDAO.class);
                bind(new Learner(threadFactory)).to(Learner.class);
            }
        });
    }

}
