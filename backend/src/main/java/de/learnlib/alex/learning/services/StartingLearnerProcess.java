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
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.ThreadContext;

/** The learner thread that is used for starting a new experiment. */
public class StartingLearnerProcess extends AbstractLearnerProcess {

    public StartingLearnerProcess(User user,
                                  LearnerResultDAO learnerResultDAO,
                                  WebhookService webhookService,
                                  TestDAO testDAO,
                                  PreparedContextHandler contextHandler,
                                  LearnerResult result,
                                  LearnerSetup setup) {
        super(user, learnerResultDAO, webhookService, testDAO, contextHandler, result, setup, setup.getEquivalenceOracle());
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        logger.traceEntry();
        logger.info(LoggerMarkers.LEARNER, "Started a new learner thread.");

        try {
            learn();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Something in the LearnerThread went wrong:", e);
            e.printStackTrace();
        } finally {
            shutdown();
            logger.info(LoggerMarkers.LEARNER, "The learner thread has finished.");
            logger.traceExit();
            ThreadContext.remove("userId");
        }
    }

    private void learn() throws Exception {
        logger.traceEntry();

        learnerPhase = LearnerService.LearnerPhase.LEARNING;
        final long learnerStartTime = System.currentTimeMillis();
        learner.startLearning();
        final long learnerEndTime = System.currentTimeMillis();

        createStep(learnerEndTime, learnerStartTime);
        startLearningLoop();

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
        logger.traceExit();
    }
}
