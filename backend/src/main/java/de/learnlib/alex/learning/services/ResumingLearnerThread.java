/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.webhooks.services.WebhookService;
import de.learnlib.api.algorithm.feature.SupportsGrowingAlphabet;
import de.learnlib.filter.cache.mealy.MealyCacheOracle;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;

/** The learner thread that is used for resuming an old experiment from a given step. */
public class ResumingLearnerThread extends AbstractLearnerThread<LearnerResumeConfiguration> {

    /**
     * Constructor.
     *
     * @param user
     *         The user that runs the learning experiment.
     * @param learnerResultDAO
     *         {@link AbstractLearnerThread#learnerResultDAO}.
     * @param webhookService
     *         {@link AbstractLearnerThread#webhookService}.
     * @param context
     *         The context to use.
     * @param result
     *         {@link AbstractLearnerThread#result}.
     * @param configuration
     *         The configuration to use.
     */
    public ResumingLearnerThread(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                 ConnectorContextHandler context, LearnerResult result,
                                 LearnerResumeConfiguration configuration) {
        super(user, learnerResultDAO, webhookService, context, result, configuration);
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
            context.post();
            finished = true;
            LOGGER.info(LEARNER_MARKER, "The learner finished resuming the experiment.");
            LOGGER.traceExit();
        }
    }

    private void resumeLearning() throws Exception {
        LOGGER.traceEntry();
        result.getAlgorithm().resume(learner, result.getSteps().get(configuration.getStepNo() - 1).getState());

        if (configuration.getSymbolsToAdd().size() > 0 && learner instanceof SupportsGrowingAlphabet) {
            final SupportsGrowingAlphabet<String> growingAlphabetLearner = (SupportsGrowingAlphabet) learner;
            for (final Symbol symbol : configuration.getSymbolsToAdd()) {
                symbolMapper.addSymbol(symbol);

                // if the cache is not reinitialized with the new alphabet, we will get cache errors later
                if (result.isUseMQCache()) {

                    // make new alphabet for the cache because it cannot handle a shared growing alphabet instance
                    // TODO: copy the cached queries from the previous round.
                    final Alphabet<String> alphabet = new SimpleAlphabet<>(abstractAlphabet);
                    alphabet.add(symbol.getName());

                    this.mqOracle.setDelegate(MealyCacheOracle.createDAGCacheOracle(alphabet, monitorOracle));
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
                step.setState(result.getAlgorithm().suspend(learner));
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

}
