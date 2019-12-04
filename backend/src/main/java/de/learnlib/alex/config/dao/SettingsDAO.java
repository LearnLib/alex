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

package de.learnlib.alex.config.dao;

import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.config.entities.DriverSettings;
import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.repositories.SettingsRepository;
import de.learnlib.alex.learning.entities.webdrivers.WebDrivers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

/**
 * Implementation of a SettingsDAO using Spring Data.
 */
@Service
@Transactional
public class SettingsDAO {

    @Value("${alex.filesRootDir}")
    private String filesRootDir;

    /** The SettingsRepository to use. Will be injected. */
    private SettingsRepository settingsRepository;

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

    public void removeDriver(String driver) {
        final Settings settings = get();
        final DriverSettings driverSettings = settings.getDriverSettings();

        final String file;
        switch (driver) {
            case WebDrivers.CHROME:
                file = driverSettings.getChrome();
                driverSettings.setChrome("");
                break;
            case WebDrivers.FIREFOX:
                file = driverSettings.getFirefox();
                driverSettings.setFirefox("");
                break;
            case WebDrivers.EDGE:
                file = driverSettings.getEdge();
                driverSettings.setEdge("");
                break;
            case WebDrivers.IE:
                file = driverSettings.getIe();
                driverSettings.setIe("");
                break;
            default:
                throw new ValidationException("Invalid driver specified.");
        }

        if (file == null || file.equals("")) {
            throw new NotFoundException("The driver file has not been found.");
        }

        try {
            Files.delete(Paths.get(getSystemFilesPath(), file));
        } catch (IOException e) {
            throw new ValidationException("Failed to delete driver executable.", e);
        }

        update(settings);
    }

    public void uploadDriver(MultipartFile file, String driver) {
        try {
            updateDriver(file.getInputStream(), file.getOriginalFilename(), driver);
        } catch (IOException e) {
            throw new ValidationException("could not upload file.", e);
        }
    }

    public void updateDriver(InputStream is, String filename, String driver) {
        if (driver.equals("")) {
            throw new ValidationException("driver not specified.");
        }

        final String prefixedFilename = driver + "-" + filename;

        try {
            final Path filePath = Paths.get(getSystemFilesPath(), prefixedFilename);
            Files.copy(is, filePath, REPLACE_EXISTING);
            Paths.get(filePath.toString()).toFile().setExecutable(true);
            final Settings settings = get();

            switch (driver) {
                case WebDrivers.CHROME:
                    settings.getDriverSettings().setChrome(prefixedFilename);
                    break;
                case WebDrivers.FIREFOX:
                    settings.getDriverSettings().setFirefox(prefixedFilename);
                    break;
                case WebDrivers.EDGE:
                    settings.getDriverSettings().setEdge(prefixedFilename);
                    break;
                case WebDrivers.IE:
                    settings.getDriverSettings().setIe(prefixedFilename);
                    break;
                default:
                    throw new ValidationException("Invalid driver specified.");
            }

            update(settings);
        } catch (IOException e) {
            throw new ValidationException("could not upload file.", e);
        }
    }

    public void updateDriverSystemProperties(DriverSettings driverSettings) {
        System.setProperty("webdriver.chrome.driver", Paths.get(getSystemFilesPath(), driverSettings.getChrome()).toString());
        System.setProperty("webdriver.gecko.driver", Paths.get(getSystemFilesPath(), driverSettings.getFirefox()).toString());
        System.setProperty("webdriver.edge.driver", Paths.get(getSystemFilesPath(), driverSettings.getEdge()).toString());
        System.setProperty("webdriver.remote.url", Paths.get(getSystemFilesPath(), driverSettings.getRemote()).toString());
    }

    private String getSystemFilesPath() {
        return Paths.get(filesRootDir, "system").toString();
    }
}
