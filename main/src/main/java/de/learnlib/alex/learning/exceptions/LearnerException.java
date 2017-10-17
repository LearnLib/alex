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

package de.learnlib.alex.learning.exceptions;

/**
 * Exception to indicate error during the learn process.
 */
public class LearnerException extends RuntimeException {

    /**
     * Default constructor.
     */
    public LearnerException() {
    }

    /**
     * Calls the constructor of the super Exception class.
     *
     * @param message
     *         More details of the error as good, old string.
     */
    public LearnerException(String message) {
        super(message);
    }

    /**
     * Calls the constructor of the super Exception class.
     *
     * @param message
     *         More details of the error as good, old string.
     * @param cause
     *         A throwable that caused the learner to stop.
     */
    public LearnerException(String message, Throwable cause) {
        super(message, cause);
    }
}
