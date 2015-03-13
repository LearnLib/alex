package de.learnlib.weblearner.entities;

/**
 * Enumeration of the different algorithms to use for the learning process.
 */
public enum LearnAlgorithms {

    /**
     * @see de.learnlib.algorithms.lstargeneric.ExtensibleAutomatonLStar
     */
    EXTENSIBLE_LSTAR,

    /**
     * @see de.learnlib.algorithms.dhc.mealy.MealyDHC
     */
    DHC,

    /**
     * @see de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy
     */
    DISCRIMINATION_TREE,

    /**
     * @see de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy
     */
    TTT

}
