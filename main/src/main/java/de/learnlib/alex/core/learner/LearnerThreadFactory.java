package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.api.LearningAlgorithm;

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
     * @param contextHandler
     *         The current ContextHandler to use.
     * @param project
     *         The Project of the test run.
     * @param configuration
     *         The LearnerConfiguration to use for the learning.
     * @return A new thread ready to use for learning.
     */
    public LearnerThread createThread(ConnectorContextHandler contextHandler, Project project,
                                      LearnerConfiguration configuration) {
        if (configuration.getSymbols().isEmpty()) {
            throw new IllegalArgumentException("No Symbols found.");
        }

        LearnerResult learnerResult = createLearnerResult(project, configuration);
        contextHandler.setResetSymbol(configuration.getResetSymbol());

        return new LearnerThread(learnerResultDAO, learnerResult, contextHandler);
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

        LearnerThread leanerThread = new LearnerThread(learnerResultDAO, learnerResult, thread.getCachedSUL(),
                                                       learner, symbols);

        return leanerThread;
    }

    private LearnerResult createLearnerResult(Project project, LearnerConfiguration configuration) {
        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setConfiguration(configuration);
        learnerResult.setProject(project);

        return learnerResult;
    }

}
