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

package de.learnlib.alex.core.learner.eqOracles;

import de.learnlib.api.EquivalenceOracle;
import de.learnlib.api.MembershipOracle;
import de.learnlib.oracles.DefaultQuery;
import net.automatalib.automata.UniversalDeterministicAutomaton;
import net.automatalib.automata.concepts.Output;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.commons.util.collections.CollectionsUtil;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Word;
import net.automatalib.words.WordBuilder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * An extension of the {@link de.learnlib.eqtests.basic.WMethodEQOracle} that uses membership query batching.
 *
 * @param <A> The automaton type.
 * @param <I> The input type.
 * @param <D> The output domain type.
 */
public class WMethodEQOracle<A extends UniversalDeterministicAutomaton<?, I, ?, ?, ?> & Output<I, D>, I, D>
        implements EquivalenceOracle<A, I, D> {

    public static class MealyWMethodEQOracle<I, O> extends WMethodEQOracle<MealyMachine<?, I, ?, O>, I, Word<O>>
            implements MealyEquivalenceOracle<I, O> {

        public MealyWMethodEQOracle(int maxDepth, MembershipOracle<I, Word<O>> sulOracle, int batchSize) {
            super(maxDepth, sulOracle, batchSize);
        }
    }

    /** {@link de.learnlib.eqtests.basic.WMethodEQOracle#maxDepth}. */
    private int maxDepth;

    /** The allowed size of the query batch. */
    private int batchSize;

    /** {@link de.learnlib.eqtests.basic.WMethodEQOracle#sulOracle}. */
    private final MembershipOracle<I, D> sulOracle;

    /**
     * Constructor.
     *
     * @param maxDepth
     *         the maximum length of the "middle" part of the test cases.
     * @param sulOracle
     *         interface to the system under learning.
     */
    public WMethodEQOracle(int maxDepth, MembershipOracle<I, D> sulOracle) {
        this(maxDepth, sulOracle, 1);
    }

    /**
     * Constructor.
     *
     * @param maxDepth
     *         the maximum length of the "middle" part of the test cases.
     * @param sulOracle
     *         interface to the system under learning.
     * @param batchSize
     *         size of the query batch.
     */
    public WMethodEQOracle(int maxDepth, MembershipOracle<I, D> sulOracle, int batchSize) {
        if (maxDepth < 1) maxDepth = 1;

        this.maxDepth = maxDepth;
        this.sulOracle = sulOracle;
        this.batchSize = batchSize;
    }

    public void setMaxDepth(int maxDepth) {
        this.maxDepth = maxDepth;
    }

    @Override
    public DefaultQuery<I, D> findCounterExample(A hypothesis, Collection<? extends I> inputs) {

        List<Word<I>> transCover = Automata.transitionCover(hypothesis, inputs);
        List<Word<I>> charSuffixes = Automata.characterizingSet(hypothesis, inputs);

        // Special case: List of characterizing suffixes may be empty,
        // but in this case we still need to test!
        if (charSuffixes.isEmpty()) charSuffixes = Collections.singletonList(Word.<I>epsilon());

        WordBuilder<I> wb = new WordBuilder<>();

        List<DefaultQuery<I, D>> queryBatch = new ArrayList<>();

        for (List<? extends I> middle : CollectionsUtil.allTuples(inputs, 1, maxDepth)) {
            for (Word<I> trans : transCover) {
                for (Word<I> suffix : charSuffixes) {
                    wb.append(trans).append(middle).append(suffix);
                    Word<I> queryWord = wb.toWord();
                    wb.clear();
                    DefaultQuery<I, D> query = new DefaultQuery<>(queryWord);
                    queryBatch.add(query);

                    if (queryBatch.size() >= batchSize) {
                        DefaultQuery<I, D> ce = processBatch(hypothesis, queryBatch);
                        if (ce != null) return ce;

                        queryBatch.clear();
                    }
                }
            }
        }

        // take care of remaining queries in the batch
        if (queryBatch.size() > 0) {
            return processBatch(hypothesis, queryBatch);
        }

        return null;
    }

    private DefaultQuery<I, D> processBatch(A hypothesis, List<DefaultQuery<I, D>> queryBatch) {
        sulOracle.processQueries(queryBatch);

        for (final DefaultQuery<I, D> ioQuery : queryBatch) {
            D oracleOutput = ioQuery.getOutput();

            // trace hypothesis
            D hypOutput = hypothesis.computeOutput(ioQuery.getInput());

            // compare output of hypothesis and oracle
            if (!Objects.equals(oracleOutput, hypOutput)) {
                return ioQuery;
            }
        }

        return null;
    }
}
