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

package de.learnlib.alex.config.dao;

import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.repositories.SettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;

/**
 * Implementation of a SettingsDAO using Spring Data.
 */
@Service
public class SettingsDAOImpl implements SettingsDAO {

    /** The SettingsRepository to use. Will be injected. */
    private SettingsRepository settingsRepository;

    /**
     * Creates a new SettingsDAO.
     *
     * @param settingsRepository
     *         The SettingsRepository to use.
     */
    @Inject
    public SettingsDAOImpl(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @Override
    @Transactional
    public void create(Settings settings) throws ValidationException {
        if (settingsRepository.count() == 1) {
            throw new ValidationException("The settings have already been created.");
        }

        settingsRepository.save(settings);

        updateDriverSystemProperties(settings.getDriverSettings());
    }

    @Override
    @Transactional(readOnly = true)
    public Settings get() {
        return settingsRepository.get();
    }

    @Override
    @Transactional
    public void update(Settings settings) {
        settingsRepository.save(settings);

        updateDriverSystemProperties(settings.getDriverSettings());
    }

    private void updateDriverSystemProperties(Settings.DriverSettings driverSettings) {
        System.setProperty("webdriver.chrome.driver", driverSettings.getChrome());
        System.setProperty("webdriver.gecko.driver",  driverSettings.getFirefox());
        System.setProperty("webdriver.edge.driver",   driverSettings.getEdge());
        System.setProperty("webdriver.remote.url",    driverSettings.getRemote());
    }
}
