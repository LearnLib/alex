package de.learnlib.alex.annotations;

/**
 * Annotation for LearnAlgorithm factories.
 *
 */
public @interface LearnAlgorithm {

    /** The enum name of the Algorithm. */
    String name();

    /** A pretty name of the algorithm. */
    String prettyName() default "";

}
