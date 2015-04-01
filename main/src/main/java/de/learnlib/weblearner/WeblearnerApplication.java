package de.learnlib.weblearner;

import de.learnlib.weblearner.core.dao.CounterDAO;
import de.learnlib.weblearner.core.dao.CounterDAOImpl;
import de.learnlib.weblearner.core.dao.LearnerResultDAO;
import de.learnlib.weblearner.core.dao.LearnerResultDAOImpl;
import de.learnlib.weblearner.core.dao.ProjectDAO;
import de.learnlib.weblearner.core.dao.ProjectDAOImpl;
import de.learnlib.weblearner.core.dao.SymbolDAO;
import de.learnlib.weblearner.core.dao.SymbolDAOImpl;
import de.learnlib.weblearner.core.dao.SymbolGroupDAO;
import de.learnlib.weblearner.core.dao.SymbolGroupDAOImpl;
import de.learnlib.weblearner.core.learner.Learner;
import de.learnlib.weblearner.core.learner.LearnerThreadFactory;
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
        packages(true, "de.learnlib.weblearner");

        // register some classes/ objects for IoC.
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                SymbolGroupDAO symbolGroupDAO = new SymbolGroupDAOImpl();
                LearnerResultDAOImpl learnerResultDAO = new LearnerResultDAOImpl();
                LearnerThreadFactory threadFactory = new LearnerThreadFactory(learnerResultDAO);

                bind(ProjectDAOImpl.class).to(ProjectDAO.class);
                bind(CounterDAOImpl.class).to(CounterDAO.class);
                bind(SymbolGroupDAOImpl.class).to(SymbolGroupDAO.class);
                bind(new SymbolDAOImpl(symbolGroupDAO)).to(SymbolDAO.class);
                bind(learnerResultDAO).to(LearnerResultDAO.class);
                bind(new Learner(threadFactory)).to(Learner.class);
            }
        });
    }

}
