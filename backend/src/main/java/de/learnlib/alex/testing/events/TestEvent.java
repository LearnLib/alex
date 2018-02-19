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

package de.learnlib.alex.testing.events;

import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

import java.util.List;

/** Events for tests. */
public class TestEvent {

    /** Event for when a test is created. */
    public static class Created extends Event<Test> {

        /**
         * Constructor.
         *
         * @param test The created test.
         */
        public Created(Test test) {
            super(test, EventType.TEST_CREATED);
        }
    }

    /** Event for when a test is updated. */
    public static class Updated extends Event<Test> {

        /**
         * Constructor.
         *
         * @param test The updated test.
         */
        public Updated(Test test) {
            super(test, EventType.TEST_UPDATED);
        }
    }

    /** Event for when a test is deleted. */
    public static class Deleted extends Event<Long> {

        /**
         * Constructor.
         *
         * @param id The id of the deleted test.
         */
        public Deleted(Long id) {
            super(id, EventType.TEST_DELETED);
        }
    }

    /** Event for when the test execution finished. */
    public static class ExecutionFinished extends Event<TestReport> {

        /**
         * Constructor.
         *
         * @param report The report of the test execution.
         */
        public ExecutionFinished(TestReport report) {
            super(report, EventType.TEST_EXECUTION_FINISHED);
        }
    }

    /** Event for when the test execution started. */
    public static class ExecutionStarted extends Event<TestExecutionStartedEventData> {

        /**
         * Constructor.
         *
         * @param data The data used to start the test execution.
         */
        public ExecutionStarted(TestExecutionStartedEventData data) {
            super(data, EventType.TEST_EXECUTION_STARTED);
        }
    }

    /** Event for when multiple tests are created at once. */
    public static class CreatedMany extends Event<List<Test>> {

        /**
         * Constructor.
         *
         * @param test The created tests.
         */
        public CreatedMany(List<Test> test) {
            super(test, EventType.TESTS_CREATED);
        }
    }

    /** Event for when multiple tests are deleted at once. */
    public static class DeletedMany extends Event<List<Long>> {

        /**
         * Constructor.
         *
         * @param ids The ids of the deleted tests.
         */
        public DeletedMany(List<Long> ids) {
            super(ids, EventType.TESTS_DELETED);
        }
    }
}
