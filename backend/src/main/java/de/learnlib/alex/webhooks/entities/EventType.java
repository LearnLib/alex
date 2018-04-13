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

package de.learnlib.alex.webhooks.entities;

/** The interface all concrete event type enums should implement. */
public enum EventType {

    /** Fired when the learner finished. */
    LEARNER_FINISHED,

    /** Fired when the learner resumed learning. */
    LEARNER_RESUMED,

    /** Fired when the learner started. */
    LEARNER_STARTED,

    /** Fired when a project is created. */
    PROJECT_CREATED,

    /** Fired when a project is deleted. */
    PROJECT_DELETED,

    /** Fired when a project is updated. */
    PROJECT_UPDATED,

    /** Fired when a symbol is created. */
    SYMBOL_CREATED,

    /** Fired when a symbol is updated, moved or hidden. */
    SYMBOL_UPDATED,

    /** Fired when multiple symbols are created. */
    SYMBOLS_CREATED,

    /** Fired when multiple symbols are updated, moved or hidden. */
    SYMBOLS_UPDATED,

    /** Fired when a symbol group is created. */
    SYMBOL_GROUP_CREATED,

    /** Fired when a symbol group is deleted. */
    SYMBOL_GROUP_DELETED,

    /** Fired when a symbol group is updated.*/
    SYMBOL_GROUP_UPDATED,

    /** Fired when a test case or test suite is created.*/
    TEST_CREATED,

    /** Fired when a test case or test suite is updated. */
    TEST_UPDATED,

    /** Fired when a test case or test suite is deleted. */
    TEST_DELETED,

    /** Fired when the test execution finished. */
    TEST_EXECUTION_FINISHED,

    /** Fired when the test execution started. */
    TEST_EXECUTION_STARTED,

    /** Fired when multiple tests are created. */
    TESTS_CREATED,

    /** Fired when multiple tests are deleted. */
    TESTS_DELETED,

    /** Fired when a user is deleted. */
    USER_DELETED,

    /** Fired when the user updated its credentials. */
    USER_CREDENTIALS_UPDATED,

    /** Fired when the role of the user is updated. */
    USER_ROLE_UPDATED
}
