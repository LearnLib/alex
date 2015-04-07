package de.learnlib.alex.annotations;


public @interface LearnAlgorithm {

    String name();

    String prettyName() default "";

}
