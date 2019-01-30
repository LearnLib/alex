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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.SupportsGrowingAlphabet;
import org.apache.logging.log4j.ThreadContext;

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
     *         {@link AbstractLearnerThread#}.
     * @param contextHandler
     *         The context to use.
     * @param result
     *         {@link AbstractLearnerThread#result}.
     * @param configuration
     *         The configuration to use.
     * @param testDAO
     *         The DAO for tests that is passed to the eq oracle.
     */
    public ResumingLearnerThread(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                 TestDAO testDAO, PreparedContextHandler contextHandler, LearnerResult result,
                                 LearnerResumeConfiguration configuration) {
        super(user, learnerResultDAO, webhookService, testDAO, contextHandler, result, configuration);
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        LOGGER.traceEntry();
        LOGGER.info(LoggerMarkers.LEARNER, "Resuming a learner thread.");

        try {
            resumeLearning();
        } catch (Exception e) {
            LOGGER.error(LoggerMarkers.LEARNER, "Something in the LearnerThread while resuming went wrong:", e);
            e.printStackTrace();
            updateOnError(e);
        } finally {
            shutdown();
            LOGGER.info(LoggerMarkers.LEARNER, "The learner finished resuming the experiment.");
            LOGGER.traceExit();
            ThreadContext.remove("userId");
        }
    }

    private void resumeLearning() throws Exception {
        LOGGER.traceEntry();
        result.getAlgorithm().resume(learner, result.getSteps().get(configuration.getStepNo() - 1).getState());

        if (configuration.getSymbolsToAdd().size() > 0 && learner instanceof SupportsGrowingAlphabet) {
            final SupportsGrowingAlphabet<String> growingAlphabetLearner = (SupportsGrowingAlphabet) learner;
            for (final ParameterizedSymbol symbol : configuration.getSymbolsToAdd()) {
                symbolMapper.addSymbol(symbol);

                // if the cache is not reinitialized with the new alphabet, we will get cache errors later
                if (result.isUseMQCache() && cacheOracle != null) {
                   cacheOracle.addAlphabetSymbol(symbol.getComputedName());
                }

                // measure how much time and membership queries it takes to add the symbol
                final long start = System.nanoTime();
                growingAlphabetLearner.addAlphabetSymbol(symbol.getComputedName());
                final long end = System.nanoTime();

                final Statistics statistics = new Statistics();
                statistics.getDuration().setLearner(end - start);
                statistics.getMqsUsed().setLearner(counterOracle.getQueryCount());
                statistics.getSymbolsUsed().setLearner(counterOracle.getSymbolCount());
                counterOracle.reset();

                final LearnerResultStep step = learnerResultDAO.createStep(result);
                step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
                step.setState(result.getAlgorithm().suspend(learner));
                step.setAlgorithmInformation(result.getAlgorithm().getInternalData(learner));
                step.setStatistics(statistics);

                learnerResultDAO.saveStep(result, step);
            }
        }

        final LearnerResultStep currentStep = result.getSteps().get(result.getSteps().size() - 1);
        doLearn(currentStep);

        LOGGER.traceExit();
    }

}
