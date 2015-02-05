package de.learnlib.weblearner.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.eqtests.basic.RandomWordsEQOracle;
import de.learnlib.oracles.SULOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

import java.util.Random;

/**
 * Proxy around a MealyRandomWordsEQOracle.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see de.learnlib.eqtests.basic.RandomWordsEQOracle.MealyRandomWordsEQOracle
 */
@JsonTypeName("random_word")
public class MealyRandomWordsEQOracleProxy extends AbstractEquivalenceOracleProxy {

    /** The seed to use for the RNG. */
    public static final int RANDOM_SEED = 42;

    /** The minimal length of the random generated words. */
    private int minLength;

    /** The maximal length of the random generated words. */
    private int maxLength;

    /** How many words should be created before ending the oracle with the assumption that no counter example exists. */
    private int maxNoOfTests;

    /**
     * Default constructor.
     */
    public MealyRandomWordsEQOracleProxy() {
        this.minLength = 1;
        this.maxLength = 1;
        this.maxNoOfTests = 1;
    }

    /**
     * Constructor that initialises all fields.
     *
     * @param minLength
     *         The minimal length of the random generated words.
     * @param maxLength
     *         The maximal length of the random generated words.
     * @param maxNoOfTests
     *         Highest amount of generated word before ending the search.
     */
    public MealyRandomWordsEQOracleProxy(int minLength, int maxLength, int maxNoOfTests) {
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
    }

    /**
     * Get the shortest possible length of the random generated words.
     *
     * @return The minimal length of the random generated words.
     */
    public int getMinLength() {
        return minLength;
    }

    /**
     * Set a new minimal length that each random generated word will have.
     *
     * @param minLength
     *         The new minimum length of the words.
     */
    public void setMinLength(int minLength) {
        this.minLength = minLength;
    }

    /**
     * Get the largest possible length of the random generated words.
     *
     * @return The maximal length of the random generated words.
     */
    public int getMaxLength() {
        return maxLength;
    }

    /**
     * Set a new maximal length that each random generated word will have.
     *
     * @param maxLength
     *         The new maximal length of the words.
     */
    public void setMaxLength(int maxLength) {
        this.maxLength = maxLength;
    }

    /**
     * Get the amount of how many words will be generated before the EQoraclee ends with the assumption that no counter
     * example exists.
     *
     * @return The highest amount of random generated words.
     */
    public int getMaxNoOfTests() {
        return maxNoOfTests;
    }

    /**
     * Set a new amount of how many words the EQ oracle should generate before assuming that no counter example exists.
     *
     * @param maxNoOfTests
     *         The new maximal amount of random generated words.
     */
    public void setMaxNoOfTests(int maxNoOfTests) {
        this.maxNoOfTests = maxNoOfTests;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (minLength < 0 || maxLength < 0) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: min length and max length must not be negative.");
        } else if (minLength > maxLength) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: max depth must be greater or equal to min depth.");
        } else if (maxNoOfTests < 1) {
            throw new IllegalArgumentException(
                    "Random Word EQ Oracle: max no of test must be greater than 0.");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>>
    createEqOracle(SULOracle<String, String> membershipOracle) {
        return new RandomWordsEQOracle.MealyRandomWordsEQOracle<>(membershipOracle, minLength, maxLength, maxNoOfTests,
                                                                    new Random(RANDOM_SEED));
    }

}
