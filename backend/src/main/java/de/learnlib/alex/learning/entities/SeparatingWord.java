/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.automatalib.words.Word;

import java.util.List;

/** Helper class for the output difference of two hypotheses. */
public class SeparatingWord {

    /** The input. */
    private Word<String> input;

    /** The The output of the first hypothesis. */
    private Word<String> output1;

    /** The output of the second hypothesis. */
    private Word<String> output2;

    /** Constructor. */
    public SeparatingWord() {
        this(Word.epsilon(), Word.epsilon(), Word.epsilon());
    }

    /**
     * Constructor.
     *
     * @param input
     *         The input.
     * @param output1
     *         The output of the first hypothesis.
     * @param output2
     *         The output of the second hypothesis.
     */
    public SeparatingWord(Word<String> input, Word<String> output1, Word<String> output2) {
        this.input = input;
        this.output1 = output1;
        this.output2 = output2;
    }

    public Word<String> getInput() {
        return input;
    }

    public Word<String> getOutput1() {
        return output1;
    }

    public Word<String> getOutput2() {
        return output2;
    }

    @JsonProperty("input")
    public List<String> getInputList() {
        return input.asList();
    }

    @JsonProperty("output1")
    public List<String> getOutput1List() {
        return output1.asList();
    }

    @JsonProperty("output2")
    public List<String> getOutput2List() {
        return output2.asList();
    }
}
