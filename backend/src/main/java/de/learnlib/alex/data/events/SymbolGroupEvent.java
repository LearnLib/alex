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

package de.learnlib.alex.data.events;

import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

/** Symbol group events. */
public class SymbolGroupEvent {

    /** Event for when a project is created. */
    public static class Created extends Event<SymbolGroup> {

        /**
         * Constructor.
         *
         * @param symbolGroup The created project.
         */
        public Created(SymbolGroup symbolGroup) {
            super(symbolGroup, EventType.SYMBOL_GROUP_CREATED);
        }
    }

    /** Event for when a project is deleted. */
    public static class Deleted extends Event<Long> {

        /**
         * Constructor.
         *
         * @param id The id of the deleted project.
         */
        public Deleted(Long id) {
            super(id, EventType.SYMBOL_GROUP_DELETED);
        }
    }

    /** Event for when a project is updated. */
    public static class Updated extends Event<SymbolGroup> {

        /**
         * Constructor.
         *
         * @param symbolGroup The updated project.
         */
        public Updated(SymbolGroup symbolGroup) {
            super(symbolGroup, EventType.SYMBOL_GROUP_UPDATED);
        }
    }
}
