package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.LearnerResultDAOImpl;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.api.LearningAlgorithm;

import java.util.List;

/**
 * Class to create a learner thread.
 * This is a helper class to make the testing of the Learner class more easily.
 */
public class LearnerThreadFactory {

    /** The LearnerResultDAO to use. */
    private LearnerResultDAO learnerResultDAO;

    /**
     * Default constructor. This will create a new LearnerResultDAO for internal use.
     */
    public LearnerThreadFactory() {
        this(new LearnerResultDAOImpl());
    }

    /**
     * Constructor that sets the LearnerResultDAO.
     *
     * @param learnerResultDAO
     *         The LearnerResultDAO to use.
     */
    public LearnerThreadFactory(LearnerResultDAO learnerResultDAO) {
        this.learnerResultDAO = learnerResultDAO;
    }

    /**
     * Create a brand new LearnThread.
     *
     * @param learnerResult
     *         The newly created LearnResult with the configuration.
     * @param contextHandler
     *         The Connectors to use.
     * @return A brand new learn thread. You have to start it by calling the .run() method on it.
     */
    public LearnerThread createThread(LearnerResult learnerResult, ConnectorContextHandler contextHandler) {
        return new LearnerThread(learnerResultDAO, learnerResult, contextHandler);
    }

    /**
     * Create a new LearnThread based on a previous thread, i.e. if you want to resume a learn process.
     *
     * @param previousThread
     *         The previous thread which provides the actual algorithm and other properties.
     * @param learnerResult
     *         The learner result with the new configuration in the current last step.
     * @return The new LearnerThread. You have to start it by calling the .run() method on it.
     */
    public LearnerThread createThread(LearnerThread previousThread, LearnerResult learnerResult) {
        List<? extends Symbol> symbolsList = previousThread.getSymbols();
        Symbol[] symbols = symbolsList.toArray(new Symbol[symbolsList.size()]);
        LearningAlgorithm.MealyLearner<String, String> learner = previousThread.getLearner();

        return new LearnerThread(learnerResultDAO, learnerResult, previousThread.getCachedSUL(), learner, symbols);
    }

}
