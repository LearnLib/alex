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

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerResultStepDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.SupportsGrowingAlphabet;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

/** The learner thread that is used for resuming an old experiment from a given step. */
@Service
@Scope("prototype")
public class ResumingLearnerProcess extends AbstractLearnerProcess<ResumingLearnerProcessQueueItem> {

    private final SymbolDAO symbolDAO;

    private LearnerResumeConfiguration resumeConfiguration;

    @Autowired
    public ResumingLearnerProcess(
            UserDAO userDAO,
            ProjectDAO projectDAO,
            LearnerResultDAO learnerResultDAO,
            LearnerSetupDAO learnerSetupDAO,
            LearnerResultStepDAO learnerResultStepDAO,
            TestDAO testDAO,
            WebhookService webhookService,
            PreparedConnectorContextHandlerFactory contextHandlerFactory,
            TransactionTemplate transactionTemplate,
            SymbolDAO symbolDAO
    ) {
        super(
                userDAO,
                projectDAO,
                learnerResultDAO,
                learnerSetupDAO,
                learnerResultStepDAO,
                testDAO,
                webhookService,
                contextHandlerFactory,
                transactionTemplate
        );
        this.symbolDAO = symbolDAO;
    }

    @Override
    void init(ResumingLearnerProcessQueueItem context) {
        transactionTemplate.execute(t -> {
            initInternal(context);
            resumeConfiguration = context.configuration;
            setEquivalenceOracle(resumeConfiguration.getEqOracle());
            removeSteps();
            return null;
        });
    }

    private void removeSteps() {
        // remove all steps after the one where the learning process should be continued from
        if (result.getSteps().size() > 0) {
            final var stepsToRemove = result.getSteps().stream()
                    .filter(s -> s.getStepNo() > resumeConfiguration.getStepNo())
                    .collect(Collectors.toList());

            if (stepsToRemove.size() > 0) {
                result = learnerResultDAO.removeSteps(result.getId(), stepsToRemove);

                // since we allow alphabets to grow, set the alphabet to the one of the latest hypothesis
                final var alphabet = result.getSteps()
                        .get(result.getSteps().size() - 1)
                        .getHypothesis()
                        .createAlphabet();

                final var symbolsToRemove = setup.getSymbols().stream()
                        .filter(s -> !alphabet.contains(s.getAliasOrComputedName()))
                        .collect(Collectors.toList());

                setup = learnerSetupDAO.removeSymbols(setup.getId(), symbolsToRemove);
            }

            // add the new alphabet symbols to the config.
            if (resumeConfiguration.getSymbolsToAdd().size() > 0) {
                final var symbolMap = new HashMap<Long, Symbol>();
                symbolDAO.getByIds(user, project.getId(), resumeConfiguration.getSymbolIds())
                        .forEach(s -> symbolMap.put(s.getId(), s));
                resumeConfiguration.getSymbolsToAdd().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));
            }
        }
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        logger.traceEntry();
        logger.info(LoggerMarkers.LEARNER, "Resuming a learner thread.");

        try {
            resumeLearning();
            shutdown();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Something in the LearnerThread while resuming went wrong:", e);
            e.printStackTrace();
            shutdownWithErrors();
        } finally {
            logger.info(LoggerMarkers.LEARNER, "The learner finished resuming the experiment.");
            logger.traceExit();
            ThreadContext.remove("userId");
        }
    }

    private void resumeLearning() throws Exception {
        logger.traceEntry();

        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.IN_PROGRESS);

        // initialize learner from old state
        final byte[] learnerState = result.getSteps().get(result.getSteps().size() - 1).getState();
        setup.getAlgorithm().resume(learner, learnerState);

        if (resumeConfiguration.getSymbolsToAdd().size() > 0 && learner instanceof SupportsGrowingAlphabet) {
            final SupportsGrowingAlphabet<String> growingAlphabetLearner = (SupportsGrowingAlphabet) learner;
            for (final ParameterizedSymbol symbol : resumeConfiguration.getSymbolsToAdd()) {

                // update setup with new symbol
                setup = learnerSetupDAO.addSymbols(setup.getId(), List.of(symbol));

                // make symbol available to symbol mapper
                symbolMapper.addSymbol(symbol);

                // extend instance of the alphabet
                abstractAlphabet.add(symbol.getAliasOrComputedName());

                // if the cache is not reinitialized with the new alphabet, we will get cache errors later
                if (setup.isEnableCache() && cacheOracle != null) {
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
                step.setState(setup.getAlgorithm().suspend(learner));
                step.setAlgorithmInformation(setup.getAlgorithm().getInternalData(learner));
                step.setEqOracle(equivalenceOracleProxy);
                step.setStatistics(statistics);
                result = learnerResultDAO.addStep(result.getId(), step);

                startLearningLoop();
            }
        } else {
            startLearningLoop();
        }

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
        logger.traceExit();
    }
}
