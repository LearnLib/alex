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

package de.learnlib.alex.common.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Helper class to deal with errors/ that accrue in the REST resources.
 * It makes a entry in the log and creates a response with the proper status and a nice JSON error message.
 */
public final class ResourceErrorHandler {

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * Deactivated constructor because this is a helper class.
     */
    private ResourceErrorHandler() {
    }

    /**
     * Create a Response with the right status code and a nice JSON error message.
     * This method also logs the error in the 'info' space.
     *
     * @param context
     *            The context this method was called in. Recommended: 'Class.method'.
     * @param status
     *            The HTTP status this error belong to.
     * @param e
     *            The exception that cause the error, could be null.
     * @return A Response object containing a JSON error message and the proper status code.
     */
    public static ResponseEntity createRESTErrorMessage(String context, HttpStatus status, Exception e) {
        LOGGER.info(context + " send an error:", e);
        return ResponseEntity.status(status).body(new RESTError(status, e));
    }
}
