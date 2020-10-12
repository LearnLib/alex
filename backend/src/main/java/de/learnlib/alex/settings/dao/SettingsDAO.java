/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.settings.dao;

import de.learnlib.alex.settings.entities.DriverSettings;
import de.learnlib.alex.settings.entities.Settings;
import de.learnlib.alex.settings.repositories.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;

/**
 * Implementation of a SettingsDAO using Spring Data.
 */
@Service
@Transactional
public class SettingsDAO {

    /** The SettingsRepository to use. Will be injected. */
    private final SettingsRepository settingsRepository;

    /**
     * Creates a new SettingsDAO.
     *
     * @param settingsRepository
     *         The SettingsRepository to use.
     */
    @Autowired
    public SettingsDAO(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public void create(Settings settings) throws ValidationException {
        if (settingsRepository.count() == 1) {
            throw new ValidationException("The settings have already been created.");
        }

        settingsRepository.save(settings);
        updateDriverSystemProperties(settings.getDriverSettings());
    }

    public Settings get() {
        return settingsRepository.get();
    }

    public void update(Settings settings) {
        settingsRepository.save(settings);
        updateDriverSystemProperties(settings.getDriverSettings());
    }

    public void updateDriverSystemProperties(DriverSettings driverSettings) {
        System.setProperty("webdriver.remote.url", driverSettings.getRemote());
    }

}
