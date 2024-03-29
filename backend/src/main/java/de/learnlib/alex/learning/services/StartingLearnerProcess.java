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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerResultStepDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.modelchecking.services.ModelCheckerService;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

/** The learner thread that is used for starting a new experiment. */
@Service
@Scope("prototype")
public class StartingLearnerProcess extends AbstractLearnerProcess<StartingLearnerProcessQueueItem> {

    @Autowired
    public StartingLearnerProcess(
            UserDAO userDAO,
            ProjectDAO projectDAO,
            LearnerResultDAO learnerResultDAO,
            LearnerSetupDAO learnerSetupDAO,
            LearnerResultStepDAO learnerResultStepDAO,
            TestDAO testDAO,
            WebhookService webhookService,
            PreparedConnectorContextHandlerFactory contextHandlerFactory,
            TransactionTemplate transactionTemplate,
            ModelCheckerService modelCheckerService
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
    }

    @Override
    void init(StartingLearnerProcessQueueItem context) {
        initInternal(context);
        setEquivalenceOracle(result.getSetup().getEquivalenceOracle());
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));
        logger.info(LoggerMarkers.LEARNER, "Started a new learner thread.");

        try {
            learn();
            shutdown();
        } catch (Exception e) {
            logger.error(LoggerMarkers.LEARNER, "Something in the LearnerThread went wrong:", e);
            e.printStackTrace();
            shutdownWithErrors(e.getMessage());
        } finally {
            logger.info(LoggerMarkers.LEARNER, "The learner thread has finished.");
            ThreadContext.remove("userId");
        }
    }

    private void learn() {
        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.IN_PROGRESS);

        learnerPhase = LearnerService.LearnerPhase.LEARNING;
        final long learnerStartTime = System.currentTimeMillis();
        learner.startLearning();
        final long learnerEndTime = System.currentTimeMillis();

        createStep(learnerEndTime, learnerStartTime);
        startLearningLoop();

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
    }
}
