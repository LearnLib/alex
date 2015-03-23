package de.learnlib.weblearner.core.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.eqtests.basic.CompleteExplorationEQOracle;
import de.learnlib.oracles.SULOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

/**
 * Proxy around a CompleteExplorationEQOracle.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see de.learnlib.eqtests.basic.CompleteExplorationEQOracle
 */
@JsonTypeName("complete")
public class CompleteExplorationEQOracleProxy extends AbstractEquivalenceOracleProxy {

    /** The minimal depth to explore, i.e. minimal length of words to test. */
    private int minDepth;

    /** The maximal depth to explore, i.e. minimal length of words to test. */
    private int maxDepth;

    /**
     * Default constructor.
     */
    public CompleteExplorationEQOracleProxy() {
        this.minDepth = 1;
        this.maxDepth = 1;
    }

    /**
     * Constructor that initialises all fields.
     *
     * @param minDepth
     *         The minimal depth to explore.
     * @param maxDepth
     *         The maximal depth to explore.
     */
    public CompleteExplorationEQOracleProxy(int minDepth, int maxDepth) {
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }

    /**
     * Get the minimal depth to explore, i.e. the minimal length of the words to test.
     *
     * @return The minimal depth to explore.
     */
    public int getMinDepth() {
        return minDepth;
    }

    /**
     * Set a new minimum for the exploration level.
     *
     * @param minDepth
     *         The new minimal depth to explore.
     */
    public void setMinDepth(int minDepth) {
        this.minDepth = minDepth;
    }

    /**
     * Get the maximal depth to explore, i.e. the maximal length of the words to test.
     *
     * @return The maximal depth to explore.
     */
    public int getMaxDepth() {
        return maxDepth;
    }

    /**
     * Set a new maximum for the exploration level.
     *
     * @param maxDepth
     *         The new maximal depth to explore.
     */
    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (minDepth < 0 || maxDepth < 0) {
            throw new IllegalArgumentException("Complete EQ Oracle: min depth and max depth must not be negative.");
        } else if (minDepth > maxDepth) {
            throw new IllegalArgumentException("Complete EQ Oracle: max depth must be greater or equal to min depth.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>>
    createEqOracle(SULOracle<String, String> membershipOracle) {
        return new CompleteExplorationEQOracle(membershipOracle, minDepth, maxDepth);
    }

}
