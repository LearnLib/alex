package de.learnlib.alex.utils;

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
