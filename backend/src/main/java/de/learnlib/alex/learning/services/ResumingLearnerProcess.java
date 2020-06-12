/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.SupportsGrowingAlphabet;
import org.apache.logging.log4j.ThreadContext;

/** The learner thread that is used for resuming an old experiment from a given step. */
public class ResumingLearnerProcess extends AbstractLearnerProcess {

    private LearnerResumeConfiguration resumeConfiguration;
    private LearnerSetupDAO learnerSetupDAO;

    public ResumingLearnerProcess(User user, LearnerResultDAO learnerResultDAO, LearnerSetupDAO learnerSetupDAO,
                                  WebhookService webhookService, TestDAO testDAO, PreparedContextHandler contextHandler,
                                  LearnerResult result, LearnerSetup setup, LearnerResumeConfiguration resumeConfiguration) {
        super(user, learnerResultDAO, webhookService, testDAO, contextHandler, result, setup, resumeConfiguration.getEqOracle());
        this.resumeConfiguration = resumeConfiguration;
        this.learnerSetupDAO = learnerSetupDAO;
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        logger.traceEntry();
        logger.info(LoggerMarkers.LEARNER, "Resuming a learner thread.");

        try {
            resumeLearning();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Something in the LearnerThread while resuming went wrong:", e);
            e.printStackTrace();
        } finally {
            shutdown();
            logger.info(LoggerMarkers.LEARNER, "The learner finished resuming the experiment.");
            logger.traceExit();
            ThreadContext.remove("userId");
        }
    }

    private void resumeLearning() throws Exception {
        logger.traceEntry();

        // initialize learner from old state
        final byte[] learnerState = result.getSteps().get(result.getSteps().size() - 1).getState();
        result.getSetup().getAlgorithm().resume(learner, learnerState);

        if (resumeConfiguration.getSymbolsToAdd().size() > 0 && learner instanceof SupportsGrowingAlphabet) {
            final SupportsGrowingAlphabet<String> growingAlphabetLearner = (SupportsGrowingAlphabet) learner;
            for (final ParameterizedSymbol symbol : resumeConfiguration.getSymbolsToAdd()) {

                // update setup with new symbol
                setup.getSymbols().add(symbol);
                setup = learnerSetupDAO.update(user, setup.getProject().getId(), setup.getId(), setup);
                result.setSetup(setup);

                // make symbol available to symbol mapper
                symbolMapper.addSymbol(symbol);

                // extend instance of the alphabet
                abstractAlphabet.add(symbol.getAliasOrComputedName());

                // if the cache is not reinitialized with the new alphabet, we will get cache errors later
                if (result.getSetup().isEnableCache() && cacheOracle != null) {
                   cacheOracle.addAlphabetSymbol(symbol.getAliasOrComputedName());
                }

                // measure how much time and membership queries it takes to add the symbol
                final long addSymbolStartTime = System.currentTimeMillis();
                growingAlphabetLearner.addAlphabetSymbol(symbol.getAliasOrComputedName());
                final long addSymbolEndTime = System.currentTimeMillis();

                final Statistics statistics = new Statistics();
                statistics.getDuration().setLearner(addSymbolEndTime - addSymbolStartTime);
                statistics.getMqsUsed().setLearner(counterOracle.getQueryCount());
                statistics.getSymbolsUsed().setLearner(counterOracle.getSymbolCount());
                counterOracle.reset();

                final LearnerResultStep step = new LearnerResultStep();
                step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
                step.setState(result.getSetup().getAlgorithm().suspend(learner));
                step.setAlgorithmInformation(result.getSetup().getAlgorithm().getInternalData(learner));
                step.setEqOracle(equivalenceOracleProxy);
                step.setStatistics(statistics);
                learnerResultDAO.createStep(result, step);

                startLearningLoop();
            }
        } else {
            startLearningLoop();
        }

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
        logger.traceExit();
    }
}
