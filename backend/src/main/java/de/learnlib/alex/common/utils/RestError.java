/*
 * Copyright 2015 - 2022 TU Dortmund
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

import com.fasterxml.jackson.annotation.JsonGetter;
import org.springframework.http.HttpStatus;

/**
 * Entity class for the JSON error messages.
 */
public class RestError {

    /**
     * Status of the error.
     */
    private final HttpStatus status;

    /**
     * The cause of the error.
     */
    private final Exception exception;

    /**
     * Constructor.
     *
     * @param status
     *         The status of the error.
     * @param exception
     *         The exception that caused the error, could be null.
     */
    public RestError(HttpStatus status, Exception exception) {
        this.status = status;
        this.exception = exception;
    }

    /**
     * Returns the proper status code for this error.
     *
     * @return The HTTP status code.
     */
    @JsonGetter
    public int getStatusCode() {
        return status.value();
    }

    /**
     * Returns a short description of the status (like the short HTTP error messages).
     *
     * @return A short string to describe the status.
     */
    @JsonGetter
    public String getStatusText() {
        return status.getReasonPhrase();
    }

    /**
     * Get the message of the exception that cause this error.
     *
     * @return The message of the error.
     */
    @JsonGetter
    public String getMessage() {
        if (exception != null) {
            return exception.getMessage();
        } else {
            return "";
        }
    }

}
