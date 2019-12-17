/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.settings.events;

import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.EventType;

public class SettingsEvent {

    /** Event for when the app settings are updated. */
    public static class Updated extends Event<Settings> {

        /**
         * Constructor.
         *
         * @param settings The updated settings.
         */
        public Updated(Settings settings) {
            super(settings, EventType.SETTINGS_UPDATED);
        }
    }
}
