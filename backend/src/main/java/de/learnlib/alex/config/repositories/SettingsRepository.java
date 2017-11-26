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
package de.learnlib.alex.config.repositories;

import de.learnlib.alex.config.entities.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository to persist the Settings.
 */
@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {

    /**
     * Get the settings.
     * There will be alway only one settings object.
     *
     * @return The system settings.
     */
    @Query("SELECT s FROM Settings s WHERE s.id = 1")
    Settings get();

}
