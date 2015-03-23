package de.learnlib.weblearner.core.learner;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.weblearner.core.dao.LearnerResultDAO;
import de.learnlib.weblearner.core.entities.LearnerConfiguration;
import de.learnlib.weblearner.core.entities.LearnerResult;
import de.learnlib.weblearner.core.entities.LearnerResumeConfiguration;
import de.learnlib.weblearner.core.entities.Project;
import de.learnlib.weblearner.core.entities.Symbol;
import de.learnlib.weblearner.core.learner.connectors.CounterStoreContextHandler;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;
import de.learnlib.weblearner.core.learner.connectors.MultiContextHandler;
import de.learnlib.weblearner.core.learner.connectors.VariableStoreContextHandler;
import de.learnlib.weblearner.core.learner.connectors.WebServiceContextHandler;
import de.learnlib.weblearner.core.learner.connectors.WebSiteContextHandler;

import java.util.List;

/**
 * Factory to create a {@link LearnerThread} for the given Symbols.
 */
public class LearnerThreadFactory {

    /** The DAO to receive and save the results. */
    private LearnerResultDAO learnerResultDAO;

    /**
     * Constructor to set the factory up.
     *
     * @param learnerResultDAO
     *         The DAO to access and store the results.
     */
    public LearnerThreadFactory(LearnerResultDAO learnerResultDAO) {
        this.learnerResultDAO = learnerResultDAO;
    }

    /**
     * Create a LearnerThread suitable for the given parameter.
     *
     * @param project
     *         The Project of the test run.
     * @param configuration
     *         The LearnerConfiguration to use for the learning.
     * @return A new thread ready to use for learning.
     */
    public LearnerThread createThread(Project project, LearnerConfiguration configuration) {
        if (configuration.getSymbols().isEmpty()) {
            throw new IllegalArgumentException("No Symbols found.");
        }

        LearnerResult learnerResult = createLearnerResult(project, configuration);

        MultiContextHandler context = new MultiContextHandler();
        context.addHandler(createWebSiteContextHandler(project));
        context.addHandler(createWebServiceContextHandler(project));
        context.addHandler(new VariableStoreContextHandler());
        context.addHandler(new CounterStoreContextHandler());

        context.addResetSymbol(configuration.getResetSymbol());

        return new LearnerThread(learnerResultDAO, learnerResult, context);
    }

    /**
     * Create a LearnerThread suitable for the given parameter.
     *
     * @param thread
     *         The previous LearnerThread to copy information from.
     * @param newConfiguration
     *         The resume configuration to use for the next learning steps.
     * @return A new thread ready to use for learning.
     */
    public LearnerThread updateThread(LearnerThread thread, LearnerResumeConfiguration newConfiguration) {
        LearnerResult learnerResult = thread.getResult();

        learnerResult.getConfiguration().updateConfiguration(newConfiguration);
        List<? extends Symbol> symbolsList = thread.getSymbols();

        LearningAlgorithm.MealyLearner<String, String> learner = thread.getLearner();
        Symbol[] symbols = symbolsList.toArray(new Symbol[symbolsList.size()]);

        LearnerThread<MultiConnector> leanerThread = new LearnerThread<>(learnerResultDAO,
                                                                         learnerResult,
                                                                         thread.getContext(),
                                                                         learner,
                                                                         symbols);
        leanerThread.getResult().getConfiguration().updateConfiguration(newConfiguration);

        return leanerThread;
    }

    private LearnerResult createLearnerResult(Project project, LearnerConfiguration configuration) {
        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setConfiguration(configuration);
        learnerResult.setProject(project);

        return learnerResult;
    }

    private WebSiteContextHandler createWebSiteContextHandler(Project project) {
        return new WebSiteContextHandler(project.getBaseUrl());
    }

    private WebServiceContextHandler createWebServiceContextHandler(Project project) {
        return new WebServiceContextHandler(project.getBaseUrl());
    }

}
