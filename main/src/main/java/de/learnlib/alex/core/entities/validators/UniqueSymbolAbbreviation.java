package de.learnlib.alex.core.entities.validators;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Annotation for the the Symbol class that checks, that every Symbol abbreviation is unique per User and Project.
 * See http://docs.jboss.org/hibernate/validator/5.2/reference/en-US/html/ch06.html for more details.
 */
@Target({ TYPE, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = { UniqueSymbolAbbreviationValidator.class })
@Documented
public @interface UniqueSymbolAbbreviation {

    /**
     * The error message if the constraint is violated.
     * A default error message is provided.
     *
     * @return The error message.
     */
    String message() default "{de.learnlib.alex.core.entities.validators.UniqueSymbolAbbreviation.message}";

    /**
     * Attribute to group constrains.
     * This group is empty by default.
     *
     * @return The groups the constraint belongs to
     */
    Class<?>[] groups() default { };

    /**
     * Additional payload of the annotation.
     * This payload is empty by default.
     *
     * @return The current payload.
     */
    Class<? extends Payload>[] payload() default { };

}
