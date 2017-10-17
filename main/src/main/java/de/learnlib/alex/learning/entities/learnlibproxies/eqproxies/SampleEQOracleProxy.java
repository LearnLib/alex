/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.learning.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.oracle.equivalence.SampleSetEQOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;
import org.hibernate.validator.constraints.NotBlank;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Stream;

/**
 * Proxy around a SampleSetEQOracle.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see de.learnlib.oracle.equivalence.SampleSetEQOracle
 */
@JsonTypeName("sample")
public class SampleEQOracleProxy extends AbstractEquivalenceOracleProxy implements Serializable {

    private static final long serialVersionUID = -110995671060498443L;

    /**
     * Construct to hold a pair of an input and output string.
     */
    public static class InputOutputPair implements Serializable {

        private static final long serialVersionUID = 2200629936714510637L;

        /** The input. */
        @NotBlank
        private String input;

        /** The output that should occur. */
        @NotBlank
        private String output;

        /**
         * Default constructor.
         */
        public InputOutputPair() {
        }

        /**
         * Constructor.
         * @param input The input symbol.
         * @param output The output symbol.
         */
        public InputOutputPair(String input, String output) {
            this.input = input;
            this.output = output;
        }

        /**
         * Get the input.
         * @return The input.
         */
        public String getInput() {
            return input;
        }

        /**
         * Set the input.
         * @param input The input.
         */
        public void setInput(String input) {
            this.input = input;
        }

        /**
         * Get the output.
         * @return The output.
         */
        public String getOutput() {
            return output;
        }

        /**
         * Set the output.
         * @param output The output.
         */
        public void setOutput(String output) {
            this.output = output;
        }

        @Override
        public String toString() {
            return "(" + input + "/" + output + ")";
        }
    }

    /** A list of counter examples. */
    private List<List<InputOutputPair>> counterExamples;

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
    public List<List<InputOutputPair>> getCounterExamples() {
        return counterExamples;
    }

    /**
     * Set a new list of counter examples to use during a learning process.
     *
     * @param counterExamples
     *         The new counter examples to check.
     */
    public void setCounterExamples(List<List<InputOutputPair>> counterExamples) {
        this.counterExamples = counterExamples;
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (counterExamples.isEmpty()) {
            throw new IllegalArgumentException("You need to specify at least one counter example!");
        }
    }

    /**
     * Add one counter example to the list of examples to check.
     *
     * @param counterExample
     *         The new example to verify.
     */
    public void addCounterExample(List<InputOutputPair> counterExample) {
        this.counterExamples.add(counterExample);
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle, int batchSize) {
        SampleSetEQOracle newEQ = new SampleSetEQOracle(false);

        for (List<InputOutputPair> counterExample : counterExamples) {
            Stream<InputOutputPair> inputOutputPairStream = counterExample.stream();
            String[] inputs = inputOutputPairStream.map(InputOutputPair::getInput).toArray(String[]::new);
            Word input = Word.fromArray(inputs, 0, inputs.length);
            inputOutputPairStream = counterExample.stream();
            String[] outputs = inputOutputPairStream.map(InputOutputPair::getOutput).toArray(String[]::new);
            Word output = Word.fromArray(outputs, 0, outputs.length);
            newEQ.add(input, output);
        }

        return newEQ;
    }
}
