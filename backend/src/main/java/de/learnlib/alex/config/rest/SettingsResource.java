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

import de.learnlib.alex.config.dao.SettingsDAO;
import de.learnlib.alex.config.entities.Settings;
import de.learnlib.alex.config.events.SettingsEvent;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.core.MediaType;

/**
 * REST API to manage the settings.
 */
@RestController
@RequestMapping(value = "/rest/settings")
public class SettingsResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private SettingsDAO settingsDAO;
    private WebhookService webhookService;

    @Autowired
    public SettingsResource(SettingsDAO settingsDAO, WebhookService webhookService) {
        this.settingsDAO = settingsDAO;
        this.webhookService = webhookService;
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
        final Settings settings = settingsDAO.get();
        LOGGER.traceExit(settings);
        return ResponseEntity.ok(settings);
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
        settings.checkValidity();
        settingsDAO.update(settings);
        webhookService.fireEvent(new SettingsEvent.Updated(settings));
        LOGGER.traceExit(settings);
        return ResponseEntity.ok(settings);
    }

    @PostMapping(
            value = "/drivers/{driver}",
            consumes = MediaType.MULTIPART_FORM_DATA,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity uploadDriver(@RequestParam("file") MultipartFile fileToUpload,
                                       @PathVariable("driver") String driver) {
        LOGGER.traceEntry("uploadDriver({})", driver);
        settingsDAO.uploadDriver(fileToUpload, driver);
        final Settings settings = settingsDAO.get();
        webhookService.fireEvent(new SettingsEvent.Updated(settings));
        LOGGER.traceExit(settings);
        return ResponseEntity.ok(settings);
    }

    @DeleteMapping(
            value = "/drivers/{driver}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteDriver(@PathVariable("driver") String driver) {
        LOGGER.traceEntry("deleteDriver({})", driver);
        settingsDAO.removeDriver(driver);
        final Settings settings = settingsDAO.get();
        webhookService.fireEvent(new SettingsEvent.Updated(settings));
        LOGGER.traceExit(settings);
        return ResponseEntity.ok(settings);
    }
}
