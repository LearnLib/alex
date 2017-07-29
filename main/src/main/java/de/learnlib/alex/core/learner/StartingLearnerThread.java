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
import de.learnlib.alex.core.entities.LearnerStartConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;

/** The learner thread that is used for starting a new experiment. */
public class StartingLearnerThread extends LearnerThread<LearnerStartConfiguration> {

    /**
     * Constructor.
     *
     * @param learnerResultDAO {@link LearnerThread#learnerResultDAO}.
     * @param context          The context to use.
     * @param result           {@link LearnerThread#result}.
     * @param configuration    The configuration to use.
     */
    public StartingLearnerThread(LearnerResultDAO learnerResultDAO, ConnectorContextHandler context,
                                 LearnerResult result, LearnerStartConfiguration configuration) {
        super(learnerResultDAO, context, result, configuration);
    }

    @Override
    public void run() {
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Started a new learner thread.");

        try {
            startLearning();
        } catch (Exception e) {
            LOGGER.warn(LEARNER_MARKER, "Something in the LearnerThread went wrong:", e);
            e.printStackTrace();
            updateOnError(e);
        } finally {
            finished = true;
            LOGGER.info(LEARNER_MARKER, "The learn thread has finished.");
            LOGGER.traceExit();
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
        learnerResultDAO.create(result);
        LearnerResultStep currentStep = createStep(start, end, 0, null);

        doLearn(currentStep);

        LOGGER.traceExit();
    }
}