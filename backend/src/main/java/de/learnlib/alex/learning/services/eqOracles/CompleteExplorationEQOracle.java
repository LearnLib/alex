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

package de.learnlib.alex.learning.services.eqOracles;

import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.DefaultQuery;
import net.automatalib.automata.concepts.DetOutputAutomaton;
import net.automatalib.commons.util.collections.CollectionsUtil;
import net.automatalib.words.Word;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

/**
 * Extension of {@link de.learnlib.oracle.equivalence.CompleteExplorationEQOracle} that poses batches of membership queries.
 *
 * @param <I> The input type.
 * @param <D> The domain output type.
 */
public class CompleteExplorationEQOracle<I, D> implements EquivalenceOracle<DetOutputAutomaton<?, I, ?, D>, I, D> {

    /** The minimum length of the words to test. */
    private int minDepth;

    /** The maximum length of the words to test. */
    private int maxDepth;

    /** The allowed size of the membership query batches. */
    private int batchSize;

    /** The oracle where the membership queries are posed to. */
    private final MembershipOracle<I, D> sulOracle;

    /**
     * Constructor.
     *
     * @param sulOracle interface to the system under learning.
     * @param maxDepth  maximum exploration depth.
     */
    public CompleteExplorationEQOracle(MembershipOracle<I, D> sulOracle, int maxDepth) {
        this(sulOracle, 1, maxDepth);
    }

    /**
     * Constructor.
     *
     * @param sulOracle interface to the system under learning.
     * @param minDepth  minimum exploration depth.
     * @param maxDepth  maximum exploration depth.
     * @param batchSize size of the batch.
     */
    public CompleteExplorationEQOracle(MembershipOracle<I, D> sulOracle, int minDepth, int maxDepth, int batchSize) {
        if (maxDepth < minDepth) maxDepth = minDepth;
        if (batchSize < 1) batchSize = 1;

        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
        this.batchSize = batchSize;

        this.sulOracle = sulOracle;
    }

    /**
     * Constructor.
     *
     * @param sulOracle interface to the system under learning.
     * @param minDepth  minimum exploration depth.
     * @param maxDepth  maximum exploration depth.
     */
    public CompleteExplorationEQOracle(MembershipOracle<I, D> sulOracle, int minDepth, int maxDepth) {
        this(sulOracle, minDepth, maxDepth, 1);
    }

    @Override
    public DefaultQuery<I, D> findCounterExample(DetOutputAutomaton<?, I, ?, D> hypothesis,
                                                 Collection<? extends I> alphabet) {

        List<DefaultQuery<I, D>> queryBatch = new ArrayList<>();

        for (List<? extends I> symList : CollectionsUtil.allTuples(alphabet, minDepth, maxDepth)) {
            Word<I> queryWord = Word.fromList(symList);
            queryBatch.add(new DefaultQuery<>(queryWord));

            if (queryBatch.size() >= batchSize) {
                DefaultQuery<I, D> ce = processBatch(hypothesis, queryBatch);
                if (ce != null) return ce;

                queryBatch.clear();
            }
        }

        if (queryBatch.size() > 0) {
            return processBatch(hypothesis, queryBatch);
        }

        return null;
    }

    private DefaultQuery<I, D> processBatch(DetOutputAutomaton<?, I, ?, D> hypothesis,
                                            List<DefaultQuery<I, D>> queryBatch) {

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
