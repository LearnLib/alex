package de.learnlib.alex.core.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.eqtests.basic.WMethodEQOracle;
import de.learnlib.oracles.SULOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

@JsonTypeName("wmethod")
public class WMethodEQOracleProxy extends AbstractEquivalenceOracleProxy {

    /** The maximal depth to explore, i.e. minimal length of words to test. */
    private int maxDepth;

    public WMethodEQOracleProxy() {
        this.maxDepth = 1;
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
        if (maxDepth < 0) {
            throw new IllegalArgumentException("W Method EQ Oracle: max depth must not be negative.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            SULOracle<String, String> membershipOracle) {
        return new WMethodEQOracle.MealyWMethodEQOracle<>(this.maxDepth, membershipOracle);
    }
}
