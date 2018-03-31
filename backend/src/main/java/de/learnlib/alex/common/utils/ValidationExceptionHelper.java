/*
 * Copyright 2018 TU Dortmund
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

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;

/**
 * Helper class to convert a ConstraintViolationException from Hibernate into a ValidationException.
 */
public final class ValidationExceptionHelper {

    /**
     * Default constructor disabled because this is a static helper class.
     */
    private ValidationExceptionHelper() {
    }

    /**
     * Converts a ConstraintViolationException into a ValidationException, which has a nice message with all the
     * Constraint Violations in it.
     *
     * @param baseMessage
     *         The prefix of the error message.
     * @param e
     *         The ConstraintViolationException to convert.
     * @return A new ValidationException base on the ConstraintViolationException.
     */
    public static ValidationException createValidationException(String baseMessage, ConstraintViolationException e) {
        StringBuilder errorMessage = new StringBuilder();
        errorMessage.append(baseMessage);
        for (ConstraintViolation<?> constraintViolation : e.getConstraintViolations()) {
            errorMessage.append(' ');
            errorMessage.append(constraintViolation.getMessage());
        }
        return new ValidationException(errorMessage.toString(), e);
    }
}
