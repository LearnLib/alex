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
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.ThreadContext;

/** The learner thread that is used for starting a new experiment. */
public class StartingLearnerThread extends AbstractLearnerThread<LearnerStartConfiguration> {

    /**
     * Constructor.
     *
     * @param user
     *         The current user.
     * @param learnerResultDAO
     *         {@link AbstractLearnerThread#learnerResultDAO}.
     * @param webhookService
     *         {@link AbstractLearnerThread#webhookService}.
     * @param contextHandler
     *         The context to use.
     * @param result
     *         {@link AbstractLearnerThread#result}.
     * @param configuration
     *         The configuration to use.
     * @param testDAO
     *         The DAO for tests that is passed to the eq oracle.
     */
    public StartingLearnerThread(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                 TestDAO testDAO, PreparedContextHandler contextHandler, LearnerResult result,
                                 LearnerStartConfiguration configuration) {
        super(user, learnerResultDAO, webhookService, testDAO, contextHandler, result, configuration);
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        LOGGER.traceEntry();
        LOGGER.info(LoggerMarkers.LEARNER, "Started a new learner thread.");

        try {
            startLearning();
        } catch (Exception e) {
            LOGGER.error(LoggerMarkers.LEARNER, "Something in the LearnerThread went wrong:", e);
            e.printStackTrace();
            updateOnError(e);
        } finally {
            shutdown();
            LOGGER.info(LoggerMarkers.LEARNER, "The learner thread has finished.");
            LOGGER.traceExit();
            ThreadContext.remove("userId");
        }
    }

    private void startLearning() throws Exception {
        LOGGER.traceEntry();

        // variables for measuring the execution time of the learner
        long start, end;

        // start learning
        learnerPhase = Learner.LearnerPhase.LEARNING;
        start = System.nanoTime();
        learner.startLearning();
        end = System.nanoTime();

        // persist the learner result for the first time.
        // also persist the first step.
        result = learnerResultDAO.create(user, result);
        LearnerResultStep currentStep = createStep(start, end, 0, null);

        doLearn(currentStep);

        LOGGER.traceExit();
    }
}
