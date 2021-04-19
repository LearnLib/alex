/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.learning.events;

import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

/** Events for the learner. */
public class LearnerEvent {

    /** Event for when the learner started. */
    public static class Started extends Event<LearnerResult> {

        /**
         * Constructor.
         *
         * @param result
         *         The configuration used for starting the learner.
         */
        public Started(LearnerResult result) {
            super(result, EventType.LEARNER_STARTED);
        }
    }

    /** Event for when the learner is resumed. */
    public static class Resumed extends Event<LearnerResult> {

        /**
         * Constructor.
         *
         * @param result
         *         The configuration used for resuming the learner.
         */
        public Resumed(LearnerResult result) {
            super(result, EventType.LEARNER_RESUMED);
        }
    }

    /** Event for when the learner finished. */
    public static class Finished extends Event<LearnerResult> {

        /**
         * Constructor.
         *
         * @param result
         *         The learner result.
         */
        public Finished(LearnerResult result) {
            super(result, EventType.LEARNER_FINISHED);
        }
    }
}
