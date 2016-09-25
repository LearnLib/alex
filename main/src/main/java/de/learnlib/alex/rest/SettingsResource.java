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

package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.SettingsDAO;
import de.learnlib.alex.core.entities.Settings;
import de.learnlib.alex.utils.ResourceErrorHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

/**
 * REST API to manage the settings.
 *
 * @resourceDescription Operations about settings
 */
@Path("/settings")
public class SettingsResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The {@link SettingsDAO} to use. */
    @Inject
    private SettingsDAO settingsDAO;

    /**
     * Get get application settings object.
     *
     * @return The application settings on success.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"REGISTERED"})
    public Response get() {
        LOGGER.traceEntry("get()");

        try {
            Settings settings = settingsDAO.get();
            if (settings == null) {
                throw new Exception("The settings have not been created yet.");
            }

            LOGGER.traceExit(settings);
            return Response.ok(settings).build();
        } catch (Exception e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SettingsResource.get",
                    Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Update the application settings.
     *
     * @param settings The updated settings object.
     * @return The updated settings object on success.
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN"})
    public Response update(Settings settings) {
        LOGGER.traceEntry("update({})", settings);

        try {
            settings.checkValidity();
            settingsDAO.update(settings);

            LOGGER.traceExit(settings);
            return Response.ok(settings).build();
        } catch (Exception e) {
            return ResourceErrorHandler.createRESTErrorMessage("SettingsResource.update",
                    Response.Status.BAD_REQUEST, e);
        }
    }
}
