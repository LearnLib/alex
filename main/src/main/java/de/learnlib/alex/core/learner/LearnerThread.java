/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnAlgorithms;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.learnlibproxies.AlphabetProxy;
import de.learnlib.alex.core.entities.learnlibproxies.DefaultQueryProxy;
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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests.
 * This class contains the actual learning loop.
 */
public class LearnerThread extends Thread {

    /**
     * Use the learner logger.
     */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /**
     * Is the thread still running?
     */
    private boolean finished;

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
     * The current step of the learn result.
     */
    private LearnerResultStep currentStep;

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
     * @param learnerResultDAO
     *         The DAO to persists the results.
     * @param result
     *         The result to update, including the proper configuration.
     * @param context
     *         The context of the SUL. If this context is a counter, the 'amountOfResets' field will be set correctly.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result, ConnectorContextHandler context) {
        this.finished = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;
        this.currentStep = result.getSteps().get(result.getSteps().size() - 1); // get the latest step

        Symbol[] symbolsArray = readSymbolArray(); // use the symbols in the result to create the symbol array.
        this.symbolMapper = new SymbolMapper(symbolsArray);
        this.sigma = symbolMapper.getAlphabet();
        this.result.setSigma(AlphabetProxy.createFrom(sigma));

        ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>,
                                  ExecuteResult,
                                  ConnectorManager>
                ceiSUL = new ContextExecutableInputSUL<>(context);
        SUL<String, String> mappedSUL = Mappers.apply(symbolMapper, ceiSUL);
        this.cachedSUL = SULCaches.createCache(this.sigma, mappedSUL);
        this.resetCounterSUL = new ResetCounterSUL<>("resets", this.cachedSUL);
        this.symbolCounterSUL = new SymbolCounterSUL<>("symbols used", resetCounterSUL);
        this.sul = symbolCounterSUL;

        this.mqOracle = new SULOracle<>(sul);

        LearnAlgorithms algorithm = result.getAlgorithm();
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
        this.finished = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;
        this.currentStep = result.getSteps().get(result.getSteps().size() - 1); // get the latest step

        this.symbolMapper = new SymbolMapper(symbols);
        this.sigma = symbolMapper.getAlphabet();
        result.setSigma(AlphabetProxy.createFrom(sigma));

        this.cachedSUL = existingSUL;
        this.resetCounterSUL = new ResetCounterSUL<>("resets", this.cachedSUL);
        this.resetCounterSUL.getStatisticalData().increment(result.getStatistics().getMqsUsed());

        this.symbolCounterSUL = new SymbolCounterSUL<>("symbols used", resetCounterSUL);
        this.symbolCounterSUL.getStatisticalData().increment(result.getStatistics().getSymbolsUsed());

        this.sul = symbolCounterSUL;

        this.mqOracle = new SULOracle<>(sul);

        this.learner = learner;
    }

    private Symbol[] readSymbolArray() {
        Set<Symbol> symbols = result.getSymbols();
        return symbols.toArray(new Symbol[symbols.size()]);
    }

    /**
     * Returns the current status of the Thread.
     *
     * @return true, if the Thread is still active; false otherwise.
     */
    public boolean isFinished() {
        return finished;
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
        ThreadContext.put("userId", String.valueOf(result.getUserId()));
        ThreadContext.put("testNo", String.valueOf(result.getTestNo()));
        LOGGER.trace("LearnThread.run() - enter");

        try {
            learn();
        } catch (Exception e) {
            LOGGER.warn("Something in the LearnerThread went wrong:", e);

            String message = e.getMessage();
            if (message == null) {
                message = e.getClass().getName();
            }
            currentStep.setErrorText(message);
            learnerResultDAO.saveStep(result, currentStep);

            sul.post();
        } finally {
            LOGGER.trace("LearnThread.run() - exit");
            finished = true;

        }
    }

    /**
     * Get the ResetCounterSUL.
     *
     * @return The active ResetCounterSUL
     */
    public ResetCounterSUL getResetCounterSUL() {
        return resetCounterSUL;
    }

    private void learn() throws NotFoundException {
        do {
            learnOneStep();
        } while (continueLearning());
    }

    private boolean continueLearning() {
        return currentStep.getCounterExample() != null
                && (currentStep.getStepsToLearn() > 0 || currentStep.getStepsToLearn() == -1)
                && !Thread.interrupted();
    }

    private void learnOneStep() throws NotFoundException {
        LOGGER.trace("LearnerThread.learnOneStep()");

        if (result.getStatistics().getDuration() == 0L) {
            learnFirstStep();
        } else {
            learnSuccessiveStep();
        }

        rememberMetaData();
    }

    private void learnFirstStep() {
        LOGGER.trace("LearnerThread.learnFirstStep()");
        Statistics statistics = currentStep.getStatistics();
        statistics.setStartDate(ZonedDateTime.now());
        statistics.setStartTime(System.nanoTime());
        statistics.setDuration(0L);
        statistics.setEqsUsed(0L);
        result.getStatistics().setStartDate(statistics.getStartDate());
        learner.startLearning();
        result.createHypothesisFrom(learner.getHypothesisModel());
        findAndRememberCounterExample();
    }

    private void learnSuccessiveStep() throws NotFoundException {
        // If the learning is resumed, a new step with the new configuration, will already exists.
        // Otherwise we have to create a new step based on the previous one.
        if (currentStep.getStatistics().getDuration() > 0) {
            currentStep = learnerResultDAO.createStep(result);
        }

        // set the start date and the start time:
        // - The start date acts as timestamp and is public.
        // - The start time is more accurate (nanoseconds) and will be only used internally to calculate the duration.
        Statistics statistics = currentStep.getStatistics();
        statistics.setStartDate(ZonedDateTime.now());
        statistics.setStartTime(System.nanoTime());

        // if the previous step didn't yield any counter example, try again
        // (maybe more luck this time or configuration has changed)
        if (currentStep.getCounterExample() == null) {
            findAndRememberCounterExample();
        }

        // if a there is a counter example refine the hypothesis
        if (currentStep.getCounterExample() != null) {
            learner.refineHypothesis(currentStep.getCounterExample().createDefaultProxy());
            findAndRememberCounterExample();
        }
    }

    private void findAndRememberCounterExample() {
        // find
        EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle;
        eqOracle = currentStep.getEqOracle().createEqOracle(mqOracle);
        DefaultQuery<String, Word<String>> newCounterExample;
        newCounterExample = eqOracle.findCounterExample(learner.getHypothesisModel(), sigma);

        // remember
        currentStep.getStatistics().setEqsUsed(currentStep.getStatistics().getEqsUsed() + 1);
        if (newCounterExample == null) {
            currentStep.setCounterExample(null);
        } else {
            currentStep.setCounterExample(DefaultQueryProxy.createFrom(newCounterExample));
        }
        LOGGER.info("The new counter example is '" + newCounterExample + "'.");
    }

    private void rememberMetaData() throws NotFoundException {
        // statistics
        Statistics statistics = currentStep.getStatistics();

        long startTime = statistics.getStartTime();
        long currentTime = System.nanoTime();

        currentStep.createHypothesisFrom(learner.getHypothesisModel());

        statistics.setDuration(currentTime - startTime);
        LOGGER.debug("Duration of the learning: " + statistics.getDuration() + " "
                     + "(start: " + startTime + ", end: " + currentTime + ").");

        long mqUsedDiff = resetCounterSUL.getStatisticalData().getCount() - statistics.getMqsUsed();
        statistics.setMqsUsed(mqUsedDiff);
        long symbolUsedDiff = symbolCounterSUL.getStatisticalData().getCount() - statistics.getSymbolsUsed();
        statistics.setSymbolsUsed(symbolUsedDiff);

        // algorithm information
        LearnAlgorithms algorithm = result.getAlgorithm();
        String algorithmInformation;
        try {
            algorithmInformation = algorithm.getInternalData(learner);
        } catch (IllegalStateException e) { // algorithm has no internal data to show
            algorithmInformation = "";
        }
        currentStep.setAlgorithmInformation(algorithmInformation);

        // done
        learnerResultDAO.saveStep(result, currentStep);
    }
}
