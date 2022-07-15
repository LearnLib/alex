/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerResultStepDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.SampleEQOracleProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.modelchecking.services.ModelCheckerService;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import net.automatalib.SupportsGrowingAlphabet;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

/** The learner thread that is used for resuming an old experiment from a given step. */
@Service
@Scope("prototype")
public class ResumingLearnerProcess extends AbstractLearnerProcess<ResumingLearnerProcessQueueItem> {

    private final SymbolDAO symbolDAO;

    private final SULUtilsService sulUtils;

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
            SymbolDAO symbolDAO,
            ModelCheckerService modelCheckerService,
            SULUtilsService sulUtils
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
                transactionTemplate,
                modelCheckerService
        );
        this.symbolDAO = symbolDAO;
        this.sulUtils = sulUtils;
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
        logger.info(LoggerMarkers.LEARNER, "Resuming a learner thread.");

        try {
            resumeLearning();
            shutdown();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Something in the LearnerThread while resuming went wrong:", e);
            e.printStackTrace();
            shutdownWithErrors(e.getMessage());
        } finally {
            logger.info(LoggerMarkers.LEARNER, "The learner finished resuming the experiment.");
            ThreadContext.remove("userId");
        }
    }

    private void resumeLearning() throws Exception {
        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.IN_PROGRESS);

        // initialize learner from old state
        final byte[] learnerState = result.getSteps().get(result.getSteps().size() - 1).getState();
        setup.getAlgorithm().resume(learner, learnerState);

        if (resumeConfiguration.getEqOracle() instanceof SampleEQOracleProxy) {
            validateCounterexample(user, result, resumeConfiguration);
        }

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
    }

    private void validateCounterexample(User user, LearnerResult result, LearnerResumeConfiguration configuration)
        throws IllegalArgumentException {

        final SampleEQOracleProxy oracle = (SampleEQOracleProxy) configuration.getEqOracle();
        for (List<SampleEQOracleProxy.InputOutputPair> counterexample : oracle.getCounterExamples()) {
            List<ParameterizedSymbol> symbolsFromCounterexample = new ArrayList<>();
            List<String> outputs = new ArrayList<>();

            // search symbols in configuration where symbol.name == counterexample.input
            for (SampleEQOracleProxy.InputOutputPair io : counterexample) {
                Optional<ParameterizedSymbol> symbol = result.getSetup().getSymbols().stream()
                    .filter(s -> s.getAliasOrComputedName().equals(io.getInput()))
                    .findFirst();

                // collect all outputs in order to compare it with the result of learner.getSystemOutputs()
                if (symbol.isPresent()) {
                    symbolsFromCounterexample.add(symbol.get());
                    outputs.add(io.getOutput());
                } else {
                    throw new IllegalArgumentException("The symbol with the name '" + io.getInput() + "'"
                        + " is not used in this test setup.");
                }
            }

            final ReadOutputConfig config = new ReadOutputConfig(
                result.getSetup().getPreSymbol(),
                symbolsFromCounterexample,
                result.getSetup().getPostSymbol(),
                result.getSetup().getWebDriver()
            );

            // check if the given sample matches the behavior of the SUL
            final List<String> results = sulUtils.getSystemOutputs(
                user,
                result.getProject(),
                result.getSetup().getEnvironments().get(0),
                config
            ).stream()
                .map(ExecuteResult::getOutput)
                .toList();

            if (!results.equals(outputs)) {
                throw new IllegalArgumentException("At least one of the given samples for counterexamples"
                    + " is not matching the behavior of the SUL.");
            }
        }
    }
}
