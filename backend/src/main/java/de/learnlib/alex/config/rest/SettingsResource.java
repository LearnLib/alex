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

package de.learnlib.alex.config.rest;

import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.config.dao.SettingsDAO;
import de.learnlib.alex.config.entities.Settings;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;

/**
 * REST API to manage the settings.
 */
@RestController
@RequestMapping(value = "/rest/settings")
public class SettingsResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The {@link SettingsDAO} to use. */
    private SettingsDAO settingsDAO;

    @Autowired
    public SettingsResource(SettingsDAO settingsDAO) {
        this.settingsDAO = settingsDAO;
    }

    /**
     * Get get application settings object.
     *
     * @return The application settings on success.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get() {
        LOGGER.traceEntry("get()");

        try {
            Settings settings = settingsDAO.get();
            if (settings == null) {
                throw new Exception("The settings have not been created yet.");
            }

            LOGGER.traceExit(settings);
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SettingsResource.get",
                    HttpStatus.BAD_REQUEST, e);
        }
    }

    /**
     * Update the application settings.
     *
     * @param settings
     *         The updated settings object.
     * @return The updated settings object on success.
     */
    @PutMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@RequestBody Settings settings) {
        LOGGER.traceEntry("update({})", settings);

        try {
            settings.checkValidity();
            settingsDAO.update(settings);

            LOGGER.traceExit(settings);
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResourceErrorHandler.createRESTErrorMessage("SettingsResource.update",
                    HttpStatus.BAD_REQUEST, e);
        }
    }
}
