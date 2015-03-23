package de.learnlib.weblearner.core.entities;

import de.learnlib.weblearner.core.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.weblearner.core.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;

import javax.persistence.Transient;

/**
 * Entity to hold the information needed to resume a learning process.
 */
public class LearnerResumeConfiguration {

    /**
     * The type of EQ oracle to find a counter example.
     * @requiredField
     */
    protected AbstractEquivalenceOracleProxy eqOracle;

    /** How many steps should the learner take before stopping the process.
     * Must be greater or equal to 0.
     * 0 := Do not stop until no counter example is found. */
    protected int maxAmountOfStepsToLearn;

    /**
     * Default constructor.
     */
    public LearnerResumeConfiguration() {
        this.eqOracle = new MealyRandomWordsEQOracleProxy();
        this.maxAmountOfStepsToLearn = 0; // infinity
    }

    /**
     * Get the EQ oracle (as proxy) to be used during the learning process.
     * @return The selected EQ oracle (as proxy).
     */
    @Transient
    public AbstractEquivalenceOracleProxy getEqOracle() {
        return eqOracle;
    }

    /**
     * Set a new EQ oracle (as proxy) to be used during the learning.
     * @param eqOracle The new EQ oracle (as proxy).
     */
    public void setEqOracle(AbstractEquivalenceOracleProxy eqOracle) {
        this.eqOracle = eqOracle;
    }

    /**
     * Get the amount of steps the learner should do before it stops learning.
     * The value 0 indicates no upper boundary.
     *
     * @return The max amount of steps to learn.
     */
    public int getMaxAmountOfStepsToLearn() {
        return maxAmountOfStepsToLearn;
    }

    /**
     * Set a new max amount of steps to learn.
     *
     * @param maxAmountOfStepsToLearn
     *         The new amount of steps to learn. It must be greater or equals to 0, where 0 indicates no boundary.
     */
    public void setMaxAmountOfStepsToLearn(int maxAmountOfStepsToLearn) {
        this.maxAmountOfStepsToLearn = maxAmountOfStepsToLearn;
    }

    /**
     * Check if the configuration is valid, i.e. it is possible to create a test based on the given data.
     *
     * @throws IllegalArgumentException
     *         If the configuration is invalid.
     */
    public void checkConfiguration() throws IllegalArgumentException {
        if (eqOracle == null) {
            throw new IllegalArgumentException("Could not find an EQ oracle.");
        }
        eqOracle.checkParameters();
    }

}
