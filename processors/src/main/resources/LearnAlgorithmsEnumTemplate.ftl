package de.learnlib.weblearner.core.entities;

import de.learnlib.weblearner.algorithms.LearnAlgorithmFactory;

/**
 * Enumeration of the different algorithms to use for the learning process.
 */
public enum LearnAlgorithms {

<#list algorithms as algorithm>
    ${algorithm.name}(new ${algorithm.class}()),
</#list>
    ;

    private LearnAlgorithmFactory factory;

    LearnAlgorithms(LearnAlgorithmFactory factory) {
        this.factory = factory;
    }

    public LearnAlgorithmFactory getFactory() {
        return factory;
    }

}
