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

package de.learnlib.alex.common.exceptions;

import de.learnlib.alex.common.utils.ResourceErrorHandler.RESTError;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

/**
 * ExceptionMapper that will catch all NotFoundException thrown by the REST resources.
 */
@Provider
public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker REST_MARKER = MarkerManager.getMarker("REST");

    @Override
    public Response toResponse(NotFoundException e) {
        LOGGER.info(REST_MARKER, "NotFoundException caught.", e);

        RESTError error = new RESTError(Status.NOT_FOUND, e);
        return Response.status(Status.NOT_FOUND).entity(error).build();
    }

}
