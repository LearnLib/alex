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

package de.learnlib.alex.common.exceptions;

import de.learnlib.alex.common.utils.RESTError;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

/**
 * ExceptionMapper that will catch all {@link UnauthorizedException}s thrown by the REST resources.
 */
@Provider
public class UnauthorizedExceptionMapper implements ExceptionMapper<UnauthorizedException> {

    private static final Logger LOGGER = LogManager.getLogger();

    @Override
    public Response toResponse(UnauthorizedException e) {
        LOGGER.info("UnauthorizedException caught.", e);

        RESTError error = new RESTError(Response.Status.UNAUTHORIZED, e);
        return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
    }

}
