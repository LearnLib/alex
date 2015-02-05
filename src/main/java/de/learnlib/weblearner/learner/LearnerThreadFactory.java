package de.learnlib.weblearner.learner;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.LearnerResumeConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolTypes;
import de.learnlib.weblearner.entities.WebSymbol;

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
     * @param symbols
     *         The Symbols to use during the learning
     * @return A new thread ready to use for learning.
     * @throws IllegalArgumentException
     *         I the Symbols are not of the same type (e.g. WebSymbols and RESTSymbols mixed).
     */
    public LearnerThread<?> createThread(Project project, LearnerConfiguration configuration, Symbol<?>... symbols)
            throws IllegalArgumentException {
        if (symbols.length == 0) {
            throw new IllegalArgumentException("No Symbols found.");
        }
        checkIfAllSymbolsHaveTheSameType(symbols); // throws exception if condition is not met

        LearnerResult learnerResult = createLearnerResult(project, configuration);
        if (symbols[0] instanceof WebSymbol) {
            return createWebSiteLearnerThread(project, learnerResult, symbols);
        } else  if (symbols[0] instanceof RESTSymbol) {
            return createWebServiceLearnerThread(project, learnerResult, symbols);
        } else {
            return null;
        }
    }

    /**
     * Create a LearnerThread suitable for the given parameter.
     *
     * @param thread
     *         The previous LearnerThread to copy information from.
     * @param newConfiguration
     *         The resume configuration to use for the next learning steps.
     * @return A new thread ready to use for learning.
     * @throws IllegalArgumentException
     *         If the Symbols are not of the same type (e.g. WebSymbols and RESTSymbols mixed).
     */
    public LearnerThread<?> updateThread(LearnerThread<?> thread, LearnerResumeConfiguration newConfiguration)
            throws IllegalArgumentException {
        LearnerResult learnerResult = thread.getResult();

        learnerResult.getConfiguration().updateConfiguration(newConfiguration);
        List<? extends Symbol<?>> symbols = thread.getSymbols();

        if (symbols.get(0) instanceof WebSymbol) {
            return updateWebSiteLearnerThread((LearnerThread<WebSiteConnector>) thread, learnerResult,
                                              newConfiguration);
        } else if (symbols.get(0) instanceof RESTSymbol) {
            return updateWebServiceLearnerThread((LearnerThread<WebServiceConnector>) thread, learnerResult,
                                                 newConfiguration);
        } else {
            return null;
        }
    }

    private Class<?> checkIfAllSymbolsHaveTheSameType(Symbol<?>[] symbols) throws IllegalArgumentException {
        Class<?> type = symbols[0].getClass();
        for (int i = 1; i < symbols.length; i++) {
            if (!type.isInstance(symbols[i])) {
                throw new IllegalArgumentException("All Symbols must be of the same type.");
            }
        }

        return type;
    }

    private LearnerResult createLearnerResult(Project project, LearnerConfiguration configuration) {
        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setConfiguration(configuration);
        learnerResult.setProject(project);

        return learnerResult;
    }

    private LearnerThread<WebSiteConnector> createWebSiteLearnerThread(Project project,
                                                                       LearnerResult learnerResult,
                                                                       Symbol<?>... symbols) {
        learnerResult.setType(SymbolTypes.WEB);
        WebSymbol resetSymbol = (WebSymbol) project.getResetSymbol(WebSymbol.class);
        WebSiteContextHandler context = new WebSiteContextHandler(project.getBaseUrl(), resetSymbol);

        LearnerThread<WebSiteConnector> leaner = new LearnerThread<>(learnerResultDAO, learnerResult, context,
                                                                     (Symbol<WebSiteConnector>[]) symbols);

        return leaner;
    }

    private LearnerThread<?> updateWebSiteLearnerThread(LearnerThread<WebSiteConnector> thread,
                                                        LearnerResult learnerResult,
                                                        LearnerResumeConfiguration newConfiguration) {
        LearningAlgorithm.MealyLearner<String, String> learner = thread.getLearner();
        List<Symbol<WebSiteConnector>> symbolsList = thread.getSymbols();
        Symbol[] symbols = symbolsList.toArray(new Symbol[symbolsList.size()]);

        LearnerThread<WebSiteConnector> leanerThread = new LearnerThread<>(learnerResultDAO, learnerResult,
                                                                           thread.getContext(), learner, symbols);

        leanerThread.getResult().getConfiguration().updateConfiguration(newConfiguration);

        return leanerThread;
    }

    private LearnerThread<WebServiceConnector> createWebServiceLearnerThread(Project project,
                                                                             LearnerResult learnerResult,
                                                                             Symbol<?>... symbols) {
        learnerResult.setType(SymbolTypes.REST);
        RESTSymbol resetSymbol = (RESTSymbol) project.getResetSymbol(RESTSymbol.class);
        WebServiceContextHandler context = new WebServiceContextHandler(project.getBaseUrl(), resetSymbol);

        LearnerThread<WebServiceConnector> leaner = new LearnerThread<>(learnerResultDAO, learnerResult,
                                                                        context,
                                                                        (Symbol<WebServiceConnector>[]) symbols);

        return leaner;
    }

    private LearnerThread<?> updateWebServiceLearnerThread(LearnerThread<WebServiceConnector> thread,
                                                           LearnerResult learnerResult,
                                                           LearnerResumeConfiguration newConfiguration) {
        LearningAlgorithm.MealyLearner<String, String> learner = thread.getLearner();
        List<Symbol<WebServiceConnector>> symbolsList = thread.getSymbols();
        Symbol[] symbols = symbolsList.toArray(new Symbol[symbolsList.size()]);

        LearnerThread<WebServiceConnector> leanerThread = new LearnerThread<>(learnerResultDAO, learnerResult,
                                                                              thread.getContext(), learner, symbols);
        leanerThread.getResult().getConfiguration().updateConfiguration(newConfiguration);

        return leanerThread;
    }

}
