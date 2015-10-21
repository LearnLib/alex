package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnAlgorithms;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.api.LearningAlgorithm.MealyLearner;
import de.learnlib.api.SUL;
import de.learnlib.cache.sul.SULCache;
import de.learnlib.cache.sul.SULCaches;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.Mappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracles.DefaultQuery;
import de.learnlib.oracles.ResetCounterSUL;
import de.learnlib.oracles.SULOracle;
import de.learnlib.oracles.SymbolCounterSUL;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;
import java.util.List;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests.
 * This class contains the actual learning loop.
 */
public class LearnerThread extends Thread {

    /**
     * Use the logger for the server part.
     */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /**
     * Is the thread still running?
     */
    private boolean active;

    /**
     * Mapper to match the Alphabet to the right symbols.
     */
    private final SymbolMapper symbolMapper;

    /**
     * The System Under Learning used to do the learning on.
     */
    private final SUL<String, String> sul;

    /**
     * The actual System Under Learning put into a cache.
     */
    private SULCache<String, String> cachedSUL;

    /**
     * SUL that counts the resets/ mqs and will call the cachedSUL for the learning.
     */
    private final ResetCounterSUL<String, String> resetCounterSUL;

    /**
     * SUL that counts the amount of symbols used and will call the resetCounterSUL for the learning.
     */
    private final SymbolCounterSUL<String, String> symbolCounterSUL;

    /**
     * The DAO to remember the learn results.
     */
    private final LearnerResultDAO learnerResultDAO;

    /**
     * The result of this learning thread.
     */
    private final LearnerResult result;

    /**
     * The learner to use during the learning.
     */
    private final MealyLearner<String, String> learner;

    /**
     * The Alphabet of the Symbols which will be used during the learning.
     */
    private final Alphabet<String> sigma;

    /**
     * The membership oracle.
     */
    private final SULOracle<String, String> mqOracle;

    /**
     * Constructor to set the LearnerThread up.
     *
     * @param learnerResultDAO The DAO to persists the results.
     * @param result           The result to update, including the proper configuration.
     * @param context          The context of the SUL. If this context is a counter, the 'amountOfResets' field will be set correctly.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result,
                         ConnectorContextHandler context) {
        this.active = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;

        Symbol[] symbolsArray = readSymbolArray(); // use the symbols in the result to create the symbol array.
        this.symbolMapper = new SymbolMapper(symbolsArray);
        this.sigma = symbolMapper.getAlphabet();
        this.result.setSigma(sigma);

        ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult, ConnectorManager> ceiSUL;
        ceiSUL = new ContextExecutableInputSUL<>(context);
        SUL<String, String> mappedSUL = Mappers.apply(symbolMapper, ceiSUL);
        this.cachedSUL = SULCaches.createCache(this.sigma, mappedSUL);
        resetCounterSUL = new ResetCounterSUL<>("reset counter", this.cachedSUL);
        symbolCounterSUL = new SymbolCounterSUL<>("symbol counter", resetCounterSUL);
        this.sul = symbolCounterSUL;

        this.mqOracle = new SULOracle<>(sul);

        LearnAlgorithms algorithm = result.getConfiguration().getAlgorithm();
        this.learner = algorithm.createLearner(sigma, mqOracle);
    }

    /**
     * Advanced constructor to set the LearnerThread up.
     * Most likely to be used when resuming a learn process.
     *
     * @param learnerResultDAO The DAO to persists the results.
     * @param result           The result to update, including the proper configuration.
     * @param existingSUL      The existing SULCache.
     * @param learner          Don't create a new learner, instead use this one.
     * @param symbols          The Symbols to use.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result, SULCache<String, String> existingSUL,
                         MealyLearner<String, String> learner, Symbol... symbols) {
        this.active = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;

        this.symbolMapper = new SymbolMapper(symbols);
        this.sigma = symbolMapper.getAlphabet();
        result.setSigma(sigma);

        this.cachedSUL = existingSUL;
        resetCounterSUL = new ResetCounterSUL<>("reset counter", this.cachedSUL);
        symbolCounterSUL = new SymbolCounterSUL<>("symbol counter", resetCounterSUL);
        this.sul = symbolCounterSUL;

        this.mqOracle = new SULOracle<>(sul);

        this.learner = learner;
    }

    private Symbol[] readSymbolArray() {
        List<Symbol> symbols = result.getConfiguration().getSymbols();
        return symbols.toArray(new Symbol[symbols.size()]);
    }

    /**
     * Returns the current status of the Thread.
     *
     * @return true, if the Thread is still active; false otherwise.
     */
    public boolean isActive() {
        return active;
    }

    /**
     * Get the result the Thread, which also contains the current configuration.
     *
     * @return The current result.
     */
    public LearnerResult getResult() {
        return result;
    }

    /**
     * Get the actual SUL used for the learning process wrapped in a cache..
     *
     * @return The SUL used for the learning process put into a cache.
     */
    public SULCache<String, String> getCachedSUL() {
        return cachedSUL;
    }

    /**
     * Get the learner used by the LearnerThread.
     *
     * @return The learner used by the thread.
     */
    public MealyLearner<String, String> getLearner() {
        return learner;
    }

    /**
     * Get the symbols used by the LearnerThread.
     *
     * @return The Symbols used by the thread.
     */
    public List<Symbol> getSymbols() {
        return symbolMapper.getSymbols();
    }

    @Override
    public void run() {
        active = true;
        try {
            learn();
        } catch (Exception e) {
            LOGGER.warn("Something in the LearnerThread went wrong:", e);
            result.setErrorText(e.getMessage());
            try {
                learnerResultDAO.update(result);
            } catch (NotFoundException nfe) {
                LOGGER.log(Level.FATAL, "Something in the LearnerThread went wrong and the result could not be saved!",
                        e);
            }
        }
        active = false;
    }

    /**
     * Get the ResetCounterSUL
     *
     * @return The active ResetCounterSUL
     */
    public ResetCounterSUL getResetCounterSUL() {
        return resetCounterSUL;
    }

    private void learn() throws NotFoundException {
        long maxStepNo = calculateCurrentStepNo() + result.getConfiguration().getMaxAmountOfStepsToLearn();

        do {
            learnOneStep();
        } while (continueLearning(maxStepNo));
    }

    private long calculateCurrentStepNo() {
        if (result.getStepNo() == null) {
            return 0L;
        } else {
            return result.getStepNo();
        }
    }

    private boolean continueLearning(long maxStepNo) {
        int maxAmountOfStepsToLearn = result.getConfiguration().getMaxAmountOfStepsToLearn();
        return result.getCounterExample() != null
                && (maxAmountOfStepsToLearn == 0 || result.getStepNo() < maxStepNo)
                && !Thread.interrupted();
    }

    private void learnOneStep() throws NotFoundException {
        LearnerResult.Statistics statistics = result.getStatistics();
        statistics.setStartTime(System.nanoTime());
        statistics.setStartDate(new Date());
        statistics.setEqsUsed(0L);

        if (result.getStepNo() == null || result.getStepNo().equals(0L)) {
            learnFirstStep();
        } else {
            learnSuccessiveStep();
        }

        rememberMetaData();
    }

    private void learnFirstStep() {
        learnerResultDAO.create(result);
        learner.startLearning();
        result.createHypothesisFrom(learner.getHypothesisModel());
        findAndRememberCounterExample();
    }

    private void learnSuccessiveStep() {
        // if the previous step didn't yield any counter example, try again
        // (maybe more luck this time or configuration has changed)
        if (result.getCounterExample() == null) {
            findAndRememberCounterExample();
        }

        // if a there is a counter example refine the hypothesis
        if (result.getCounterExample() != null) {
            refineHypothesis();
            findAndRememberCounterExample();
        }
    }

    private void findAndRememberCounterExample() {
        // find
        EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle;
        eqOracle = result.getConfiguration().getEqOracle().createEqOracle(mqOracle);
        DefaultQuery<String, Word<String>> newCounterExample;
        newCounterExample = eqOracle.findCounterExample(learner.getHypothesisModel(), sigma);

        // remember
        result.getStatistics().setEqsUsed(result.getStatistics().getEqsUsed() + 1);
        result.setCounterExample(newCounterExample);
    }

    private void refineHypothesis() {
        learner.refineHypothesis(result.getCounterExample());
        result.createHypothesisFrom(learner.getHypothesisModel());
    }

    private void rememberMetaData() throws NotFoundException {
        // statistics
        LearnerResult.Statistics statistics = result.getStatistics();

        long startTime = statistics.getStartTime();
        long currentTime = System.nanoTime();

        statistics.setDuration(currentTime - startTime);
        statistics.setMqsUsed(Math.abs(resetCounterSUL.getStatisticalData().getCount() - statistics.getMqsUsed()));
        statistics.setSymbolsUsed(Math.abs(symbolCounterSUL.getStatisticalData().getCount() - statistics.getSymbolsUsed()));

        // algorithm information
        LearnAlgorithms algorithm = result.getConfiguration().getAlgorithm();
        String algorithmInformation;
        try {
            algorithmInformation = algorithm.getInternalData(learner);
        } catch (IllegalStateException e) { // algorithm has no internal data to show
            algorithmInformation = "";
        }
        result.setAlgorithmInformation(algorithmInformation);

        // done
        learnerResultDAO.update(result);
    }
}
