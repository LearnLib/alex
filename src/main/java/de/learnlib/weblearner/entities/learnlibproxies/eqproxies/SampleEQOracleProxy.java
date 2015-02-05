package de.learnlib.weblearner.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.eqtests.basic.SampleSetEQOracle;
import de.learnlib.oracles.SULOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

import java.util.LinkedList;
import java.util.List;

/**
 * Proxy around a SampleSetEQOracle.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see de.learnlib.eqtests.basic.SampleSetEQOracle
 */
@JsonTypeName("sample")
public class SampleEQOracleProxy extends AbstractEquivalenceOracleProxy {

    /**
     * Class to hold all information about a (possible) counter example.
     */
    public static class SampleCounterExample {

        /** The list of inputs that is leading to the unexpected behavior. */
        private List<String> input;

        /** The output that should occur. */
        private List<String> output;

        /**
         * Get the input sequence of the counter example, i.e. a combination of inputs which lead to a wrong transition
         * within the hypothesis.
         *
         * @return The input sequence of the counter example.
         */
        public List<String> getInput() {
            return input;
        }

        /**
         * Set a input sequence which leads to a wrong transition in the hypothesis.
         *
         * @param input
         *         The input sequence of the counter example.
         */
        public void setInput(List<String> input) {
            this.input = input;
        }

        /**
         * Get the expected output which is triggered by the input sequence.
         *
         * @return The expect output of the counter example.
         */
        public List<String> getOutput() {
            return output;
        }

        /**
         * Set the expected output of the counter example.
         *
         * @param output
         *         The expected output.
         */
        public void setOutput(List<String> output) {
            this.output = output;
        }
    }

    /** A list of counter examples. */
    private List<SampleCounterExample> counterExamples;

    /**
     * Default constructor.
     */
    public SampleEQOracleProxy() {
        this.counterExamples = new LinkedList<>();
    }

    /**
     * Get the list of all counter examples that should be used during the learning process.
     *
     * @return A list of counter examples.
     */
    public List<SampleCounterExample> getCounterExamples() {
        return counterExamples;
    }

    /**
     * Set a new list of counter examples to use during a learning process.
     *
     * @param counterExamples
     *         The new counter examples to check.
     */
    public void setCounterExamples(List<SampleCounterExample> counterExamples) {
        this.counterExamples = counterExamples;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        for (SampleCounterExample counterExample : counterExamples) {
            int inputSize = counterExample.getInput().size();
            int outputSize = counterExample.getOutput().size();
            if (inputSize != outputSize) {
                throw new IllegalArgumentException(
                        "Sample EQ Oracle: The amount of inputs and outputs must be the same.");
            }
        }
    }

    /**
     * Add one counter example to the list of examples to check.
     *
     * @param counterExample
     *         The new example to verify.
     */
    public void addCounterExample(SampleCounterExample counterExample) {
        this.counterExamples.add(counterExample);
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>>
    createEqOracle(SULOracle<String, String> membershipOracle) {
        SampleSetEQOracle newEQ = new SampleSetEQOracle(false);

        for (SampleCounterExample counterExample : counterExamples) {
            newEQ.add(Word.fromList(counterExample.getInput()), Word.fromList(counterExample.getOutput()));
        }

        return newEQ;
    }
}
