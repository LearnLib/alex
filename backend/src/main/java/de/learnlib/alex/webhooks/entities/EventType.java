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
    LEARNER_FINISHED,
    LEARNER_RESUMED,
    LEARNER_STARTED,
    PROJECT_CREATED,
    PROJECT_DELETED,
    PROJECT_UPDATED,
    SYMBOL_CREATED,
    SYMBOL_UPDATED,
    SYMBOLS_CREATED,
    SYMBOLS_UPDATED,
    SYMBOL_GROUP_CREATED,
    SYMBOL_GROUP_DELETED,
    SYMBOL_GROUP_UPDATED,
    TEST_CREATED,
    TEST_UPDATED,
    TEST_DELETED,
    TEST_EXECUTION_FINISHED,
    TEST_EXECUTION_STARTED,
    TESTS_CREATED,
    TESTS_DELETED,
    USER_DELETED,
    USER_CREDENTIALS_UPDATED,
    USER_ROLE_UPDATED
}
