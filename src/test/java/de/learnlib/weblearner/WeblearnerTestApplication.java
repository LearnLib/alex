package de.learnlib.weblearner;

import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.learner.Learner;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

public class WeblearnerTestApplication extends ResourceConfig {

    public WeblearnerTestApplication(final ProjectDAO projectDAO, final SymbolDAO symbolDAO,
                                     final LearnerResultDAO learnerResultDAO, final Learner learner,
                                     Class<?>... classes) {
        super(classes);

        // register some classes/ objects for IoC.
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(projectDAO).to(ProjectDAO.class);
                bind(symbolDAO).to(SymbolDAO.class);
                bind(learner).to(Learner.class);
                bind(learnerResultDAO).to(LearnerResultDAO.class);
            }
        });

    }

}
