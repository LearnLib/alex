package de.learnlib.weblearner.learner;

import de.learnlib.api.LearningAlgorithm;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.LearnerResumeConfiguration;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolTypes;
import de.learnlib.weblearner.entities.WebSymbol;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
     */
    public LearnerThread createThread(Project project, LearnerConfiguration configuration, Symbol... symbols) {
        if (symbols.length == 0) {
            throw new IllegalArgumentException("No Symbols found.");
        }

        Map<Class<? extends Symbol>, List<Symbol>> symbolsByType = splitSymbolsByType(symbols);
        LearnerResult learnerResult = createLearnerResult(project, configuration);
        learnerResult.setType(getTypeOf(symbolsByType));

        MultiContextHandler context = new MultiContextHandler();
        for (Class<?> c : symbolsByType.keySet()) {
            ContextExecutableInputSUL.ContextHandler<? extends Connector> newHandler;
            if (WebSymbol.class.equals(c)) {
                newHandler = createWebSiteContextHandler(project);
            } else  if (RESTSymbol.class.equals(c)) {
                newHandler = createWebServiceContextHandler(project);
            } else {
                return null;
            }
            context.addHandler(newHandler);
        }

        return new LearnerThread(learnerResultDAO, learnerResult, context, symbols);
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

    private Map<Class<? extends Symbol>, List<Symbol>> splitSymbolsByType(Symbol... symbols) {
        Map<Class<? extends Symbol>, List<Symbol>> resultMap = new HashMap<>();

        for (Symbol s : symbols) {
            List<Symbol> bucket = resultMap.get(s.getClass());
            if (bucket == null) {
                bucket = new LinkedList<>();
                resultMap.put(s.getClass(), bucket);
            }
            bucket.add(s);
        }

        return resultMap;
    }

    private SymbolTypes getTypeOf(Map<Class<? extends Symbol>, List<Symbol>> symbolsByType) {
        if (symbolsByType.keySet().size() == 1) {
            if (symbolsByType.keySet().contains(WebSymbol.class)) {
                return SymbolTypes.WEB;
            } else  if (symbolsByType.keySet().contains(RESTSymbol.class)) {
                return SymbolTypes.REST;
            } else {
                return null;
            }
        } else {
            return SymbolTypes.UNKNOWN;
        }
    }

    private LearnerResult createLearnerResult(Project project, LearnerConfiguration configuration) {
        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setConfiguration(configuration);
        learnerResult.setProject(project);

        return learnerResult;
    }

    private WebSiteContextHandler createWebSiteContextHandler(Project project) {
        WebSymbol resetSymbol = (WebSymbol) project.getResetSymbol(WebSymbol.class);
        return new WebSiteContextHandler(project.getBaseUrl(), resetSymbol);
    }

    private WebServiceContextHandler createWebServiceContextHandler(Project project) {
        RESTSymbol resetSymbol = (RESTSymbol) project.getResetSymbol(RESTSymbol.class);
        return new WebServiceContextHandler(project.getBaseUrl(), resetSymbol);
    }

}
