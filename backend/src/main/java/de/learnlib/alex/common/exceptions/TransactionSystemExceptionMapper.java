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
import org.springframework.core.NestedExceptionUtils;
import org.springframework.transaction.TransactionSystemException;

import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Exception mapper that deals with constraint violations and returns readable error messages.
 */
@Provider
public class TransactionSystemExceptionMapper implements ExceptionMapper<TransactionSystemException> {

    private static final Logger LOGGER = LogManager.getLogger();

    @Override
    public Response toResponse(TransactionSystemException e) {
        LOGGER.info("TransactionSystemException caught.", e);

        String message;
        final Throwable rootCause = NestedExceptionUtils.getRootCause(e);
        if (rootCause instanceof ConstraintViolationException) {
            final List<String> messages = ((ConstraintViolationException) rootCause).getConstraintViolations().stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .collect(Collectors.toList());
            message = String.join(",", messages);
        } else {
            message = e.getMessage();
        }

        final RESTError error
                = new RESTError(Response.Status.BAD_REQUEST, new Exception(message));
        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }
}
