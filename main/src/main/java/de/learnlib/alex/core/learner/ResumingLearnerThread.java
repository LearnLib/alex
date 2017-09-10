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
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.api.algorithm.feature.SupportsGrowingAlphabet;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.DefaultQuery;
import de.learnlib.filter.cache.mealy.MealyCacheOracle;
import de.learnlib.oracle.membership.SimulatorOracle;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Word;

/** The learner thread that is used for resuming an old experiment from a given step. */
public class ResumingLearnerThread extends AbstractLearnerThread<LearnerResumeConfiguration> {

    /**
     * Constructor.
     *
     * @param learnerResultDAO {@link AbstractLearnerThread#learnerResultDAO}.
     * @param context          The context to use.
     * @param result           {@link AbstractLearnerThread#result}.
     * @param configuration    The configuration to use.
     */
    public ResumingLearnerThread(LearnerResultDAO learnerResultDAO, ConnectorContextHandler context,
                                 LearnerResult result, LearnerResumeConfiguration configuration) {
        super(learnerResultDAO, context, result, configuration);
    }

    @Override
    public void run() {
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Resuming a learner thread.");

        try {
            resumeLearning();
        } catch (Exception e) {
            LOGGER.warn(LEARNER_MARKER, "Something in the LearnerThread while resuming went wrong:", e);
            e.printStackTrace();
            updateOnError(e);
        } finally {
            finished = true;
            LOGGER.info(LEARNER_MARKER, "The learner finished resuming the experiment.");
            LOGGER.traceExit();
        }
    }

    private void resumeLearning() throws Exception {
        LOGGER.traceEntry();
        learnFromHypothesis(configuration.getStepNo());

        if (configuration.getSymbolsToAdd().size() > 0 && learner instanceof SupportsGrowingAlphabet) {
            final SupportsGrowingAlphabet<String> growingAlphabetLearner = (SupportsGrowingAlphabet) learner;
            for (final Symbol symbol : configuration.getSymbolsToAdd()) {
                abstractAlphabet.add(symbol.getName());
                symbolMapper.addSymbol(symbol);

                // if the cache is not reinitialized with the new alphabet, we will get cache errors later
                if (result.isUseMQCache()) {
                    this.mqOracle.setDelegate(MealyCacheOracle.createDAGCacheOracle(abstractAlphabet, monitorOracle));
                }

                // measure how much time and membership queries it takes to add the symbol
                final long start = System.nanoTime();
                growingAlphabetLearner.addAlphabetSymbol(symbol.getName());
                final long end = System.nanoTime();

                final Statistics statistics = new Statistics();
                statistics.getDuration().setLearner(end - start);
                statistics.getMqsUsed().setLearner(sul.getResetCount());
                statistics.getSymbolsUsed().setLearner(sul.getSymbolUsedCount());
                sul.resetCounter();

                final LearnerResultStep step = learnerResultDAO.createStep(result);
                step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
                step.setAlgorithmInformation(result.getAlgorithm().getInternalData(learner));
                step.setStatistics(statistics);

                result.getSymbols().add(symbol);
                learnerResultDAO.saveStep(result, step);
            }
        }

        final LearnerResultStep currentStep = result.getSteps().get(result.getSteps().size() - 1);
        doLearn(currentStep);

        LOGGER.traceExit();
    }

    /**
     * Use the hypothesis of a previous step as a SUL and learn until no more counterexamples can be found. The learner
     * is then internally where it stopped the last time.
     */
    private void learnFromHypothesis(int step) {
        final CompactMealy<String, String> hypothesis = result.getSteps().get(step - 1).getHypothesis()
                .createMealyMachine(abstractAlphabet);

        final MembershipOracle<String, Word<String>> oracle = mqOracle.getDelegate();
        mqOracle.setDelegate(new SimulatorOracle<>(hypothesis));

        learner.startLearning();
        while (true) {
            final Word<String> input = Automata.findSeparatingWord(learner.getHypothesisModel(), hypothesis,
                    abstractAlphabet);
            if (input == null) {
                break;
            }
            final DefaultQuery<String, Word<String>> counterexample = new DefaultQuery<>(input);
            counterexample.answer(hypothesis.computeOutput(input));
            learner.refineHypothesis(counterexample);
        }

        mqOracle.setDelegate(oracle);
    }
}
