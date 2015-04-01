package de.learnlib.weblearner.learner;

import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.algorithms.features.observationtable.writer.ObservationTableASCIIWriter;
import de.learnlib.algorithms.lstargeneric.mealy.ExtensibleLStarMealy;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.api.LearningAlgorithm.MealyLearner;
import de.learnlib.api.SUL;
import de.learnlib.cache.sul.SULCache;
import de.learnlib.cache.sul.SULCaches;
import de.learnlib.discriminationtree.DiscriminationTree;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.Mappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracles.DefaultQuery;
import de.learnlib.oracles.ResetCounterSUL;
import de.learnlib.oracles.SULOracle;
import de.learnlib.oracles.SymbolCounterSUL;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.entities.LearnAlgorithms;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.learner.connectors.ConnectorContextHandler;
import de.learnlib.weblearner.learner.connectors.ConnectorManager;
import de.learnlib.weblearner.utils.DiscriminationTreeSerializer;
import de.learnlib.weblearner.utils.TTTSerializer;
import net.automatalib.util.graphs.dot.GraphDOT;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests.
 * This class contains the actual learning loop.
 */
public class LearnerThread extends Thread {

    /** Is the thread still running? */
    private boolean active;

    /** Mapper to match the Alphabet to the right symbols. */
    private final SymbolMapper symbolMapper;

    /** The System Under Learning used to do the actual learning. */
    private final SUL<String, String> sul;
    private SULCache<String, String> cachedSUL;
    private final ResetCounterSUL<String, String>  resetCounterSUL;
    private final SymbolCounterSUL<String, String> symbolCounterSUL;

    /** The DAO to remember the learn results. */
    private final LearnerResultDAO learnerResultDAO;

    /** The result of this learning thread. */
    private final LearnerResult result;

    /** The learner to use during the learning. */
    private final MealyLearner<String, String> learner;

    /** The Alphabet of the Symbols which will be used during the learning. */
    private final Alphabet<String> sigma;

    /** The membership oracle. */
    private final SULOracle<String, String> mqOracle;

    private DefaultQuery<String, Word<String>> counterExample;


    /**
     * Constructor to set the LearnerThread up.
     *  @param learnerResultDAO
     *         The DAO to persists the results.
     * @param result
     *         The result to update, including the proper configuration.
     * @param context
 *         The context of the SUL. If this context is a counter, the 'amountOfResets' field will be set correctly.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result,
                         ConnectorContextHandler context) {
        this.active = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;

        Symbol[] symbolsArray = readSymbolArray(result);
        this.symbolMapper = new SymbolMapper(symbolsArray);
        this.sigma = symbolMapper.getAlphabet();
        result.setSigma(sigma);

        ContextExecutableInputSUL<ContextExecutableInput<String, ConnectorManager>, String, ConnectorManager> ceiSUL;
        ceiSUL = new ContextExecutableInputSUL<>(context);
        SUL<String, String> mappedSUL = Mappers.apply(symbolMapper, ceiSUL);
        this.cachedSUL = SULCaches.createCache(this.sigma, mappedSUL);
        resetCounterSUL = new ResetCounterSUL<>("reset counter", this.cachedSUL);
        symbolCounterSUL = new SymbolCounterSUL<>("symbol counter", resetCounterSUL);
        this.sul = symbolCounterSUL;

        this.mqOracle = new SULOracle<>(sul);

        LearnAlgorithms algorithm = result.getConfiguration().getAlgorithm();
        this.learner = LearnerAlgorithmFactory.createLearner(algorithm, sigma, mqOracle);
    }

    /**
     * Advanced constructor to set the LearnerThread up.
     * Most likly to be used when resuming a learn process.
     *
     * @param learnerResultDAO
     *         The DAO to persists the results.
     * @param result
     *         The result to update, including the proper configuration.
     * @param existingSUL
     *         The existing SULCache.
     * @param learner
     *         Don't create a new learner, instead use this one.
     * @param symbols
     *         The Symbols to use.
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

    private Symbol[] readSymbolArray(LearnerResult result) {
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
        learn();
        active = false;
    }

    private void learn() {
        int maxAmountOfStepsToLearn = result.getConfiguration().getMaxAmountOfStepsToLearn();
        long currentStepNo = result.getStepNo() == null ? 0L : result.getStepNo();
        long maxStepCount =  currentStepNo + maxAmountOfStepsToLearn;
        boolean shouldDoAnotherStep;

        do {
            shouldDoAnotherStep = learnOneStep();
        } while (continueLearning(shouldDoAnotherStep, maxStepCount));

        counterExample = null;
    }

    private boolean learnOneStep() {
        result.getStatistics().setStartTime(new Date());

        if (result.getStepNo() == null || result.getStepNo().equals(0L)) {
            learnFirstHypothesis();
            counterExample = findCounterExample();
            result.setCounterExample(counterExample);
            learnerResultDAO.create(result);
        } else {
            if (counterExample == null) {
                counterExample = findCounterExample();
                result.setCounterExample(counterExample);
            }

            if (counterExample != null) {
                refineHypothesis(counterExample);
                counterExample = findCounterExample();
                result.setCounterExample(counterExample);
            }
            learnerResultDAO.update(result);
        }

        boolean shouldDoAnotherStep = counterExample != null;
        return shouldDoAnotherStep;
    }

    private boolean continueLearning(boolean shouldDoAnotherStep, long maxStepCount) {
        int maxAmountOfStepsToLearn = result.getConfiguration().getMaxAmountOfStepsToLearn();
        return shouldDoAnotherStep
                && (maxAmountOfStepsToLearn == 0 || result.getStepNo() < maxStepCount)
                && !Thread.interrupted();
    }

    private void learnFirstHypothesis() {
        learner.startLearning();
        result.createHypothesisFrom(learner.getHypothesisModel());
        rememberMetaData();
    }

    private DefaultQuery<String, Word<String>> findCounterExample() {
        EquivalenceOracle randomWords = result.getConfiguration().getEqOracle().createEqOracle(mqOracle);
        result.getStatistics().setEqsUsed(result.getStatistics().getEqsUsed() + 1);
        return randomWords.findCounterExample(learner.getHypothesisModel(), sigma);
    }

    private void refineHypothesis(DefaultQuery<String, Word<String>> counterExample) {
        learner.refineHypothesis(counterExample);
        result.createHypothesisFrom(learner.getHypothesisModel());
        rememberMetaData();
    }

    private void rememberMetaData() {
        long startTime = result.getStatistics().getStartTime().getTime();
        long currentTime = new Date().getTime();
        result.getStatistics().setDuration(currentTime - startTime);
        //todo(alex.s): save #MQs and amount of symbol
        result.getStatistics().setMqsUsed(resetCounterSUL.getStatisticalData().getCount());
        result.getStatistics().setSymbolsUsed(symbolCounterSUL.getStatisticalData().getCount());
        saveInternalDataStructure();
    }

    private void saveInternalDataStructure() {
        if (learner instanceof ExtensibleLStarMealy) {
            StringBuilder observationTable = new StringBuilder();
            new ObservationTableASCIIWriter<String, String>().write(((ExtensibleLStarMealy) learner).getObservationTable(), observationTable);
            result.setAlgorithmInformation(observationTable.toString());
        } else if (learner instanceof DTLearnerMealy) {
            DiscriminationTree discriminationTree = ((DTLearnerMealy) learner).getDiscriminationTree();
            DiscriminationTree.GraphView graphView = discriminationTree.graphView();
            String treeAsJSON = DiscriminationTreeSerializer.toJSON(discriminationTree);
            System.out.println("========================");
            try {
                GraphDOT.write(graphView, System.out, graphView.getGraphDOTHelper());
            } catch (IOException e) {
                e.printStackTrace();
            }
            result.setAlgorithmInformation(treeAsJSON);
            System.out.println(result.getAlgorithmInformation());
            System.out.println("========================");
        } else if (learner instanceof TTTLearnerMealy) {
            TTTLearnerMealy tttLearner = (TTTLearnerMealy) learner;
            String treeAsJSON = TTTSerializer.toJSON(tttLearner.getDiscriminationTree());
            de.learnlib.algorithms.ttt.base.DiscriminationTree.GraphView graphView = tttLearner.getDiscriminationTree().graphView();
            System.out.println("========================");
            try {
                GraphDOT.write(graphView, System.out, graphView.getGraphDOTHelper());
            } catch (IOException e) {
                e.printStackTrace();
            }
            result.setAlgorithmInformation(treeAsJSON);
            System.out.println(result.getAlgorithmInformation());
            System.out.println("========================");
        }
    }


}
