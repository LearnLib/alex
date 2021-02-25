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

package de.learnlib.alex.auth.events;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

/** Events for users. */
public class UserEvent {

    /** Event for when the subscribing user is deleted. */
    public static class Deleted extends Event<Long> {

        /**
         * Constructor.
         *
         * @param id The id of the user that has been deleted.
         */
        public Deleted(Long id) {
            super(id, EventType.USER_DELETED);
        }
    }

    /** Event for when the credentials of the subscribing have changed. */
    public static class CredentialsUpdated extends Event<Long> {

        /**
         * Constructor.
         *
         * @param id The id of the user whose credentials have changed.
         */
        public CredentialsUpdated(Long id) {
            super(id, EventType.USER_CREDENTIALS_UPDATED);
        }
    }

    /** Event for when the role of the subscribing user has changed. */
    public static class RoleUpdated extends Event<User> {

        /**
         * Constructor.
         *
         * @param user The user whose role has changed.
         */
        public RoleUpdated(User user) {
            super(user, EventType.USER_ROLE_UPDATED);
        }
    }
}
