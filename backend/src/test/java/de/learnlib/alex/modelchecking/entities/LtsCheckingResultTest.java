/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.modelchecking.entities;

import net.automatalib.words.Word;
import org.junit.Assert;
import org.junit.Test;

public class LtsCheckingResultTest {

    @Test
    public void shouldOnlyPassIfPrefixAndLoopAreEmpty() {
        LtsCheckingResult result = new LtsCheckingResult(new LtsFormula(), 1L, 1L);
        Assert.assertTrue(result.isPassed());

        result = new LtsCheckingResult(new LtsFormula(), 1L, 1L, Word.fromSymbols("a"), Word.epsilon());
        Assert.assertFalse(result.isPassed());

        result = new LtsCheckingResult(new LtsFormula(), 1L, 1L, Word.epsilon(), Word.fromSymbols("a"));
        Assert.assertFalse(result.isPassed());

        result = new LtsCheckingResult(new LtsFormula(), 1L, 1L, Word.fromSymbols("b"), Word.fromSymbols("a"));
        Assert.assertFalse(result.isPassed());
    }
}
