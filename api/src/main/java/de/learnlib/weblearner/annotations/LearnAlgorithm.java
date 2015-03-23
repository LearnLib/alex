package de.learnlib.weblearner.annotations;


public @interface LearnAlgorithm {

    String name();

    String prettyName() default "";

}
