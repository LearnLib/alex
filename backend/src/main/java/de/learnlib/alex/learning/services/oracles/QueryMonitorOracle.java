/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.learning.services.oracles;

import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.Query;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.annotation.ParametersAreNonnullByDefault;
import net.automatalib.words.Word;

/**
 * Oracle that allows query pre and post processing.
 *
 * @param <I>
 *         Input symbol type.
 * @param <O>
 *         Output symbol type.
 */
@ParametersAreNonnullByDefault
public class QueryMonitorOracle<I, O> implements MembershipOracle<I, Word<O>> {

    /**
     * The query listener interface.
     *
     * @param <I>
     *         Input symbol type.
     * @param <O>
     *         Output symbol type.
     */
    public interface QueryProcessingListener<I, O> {

        /**
         * Process incoming queries.
         *
         * @param queries
         *         The queries that are or have been processed.
         */
        void process(Collection<? extends Query<I, Word<O>>> queries);
    }

    /** The sul the membership queries should be posed to. */
    private final MembershipOracle<I, Word<O>> delegate;

    /** The pre process listeners. */
    private final List<QueryProcessingListener<I, O>> preProcessListeners;

    /** The pre process listeners. */
    private final List<QueryProcessingListener<I, O>> postProcessListeners;

    /**
     * Constructor.
     *
     * @param delegate
     *         The membership oracle the queries are delegated to.
     */
    public QueryMonitorOracle(MembershipOracle<I, Word<O>> delegate) {
        this.delegate = delegate;
        this.preProcessListeners = new ArrayList<>();
        this.postProcessListeners = new ArrayList<>();
    }

    /**
     * Adds a pre process listener to the list.
     *
     * @param listener
     *         The listener.
     */
    public void addPreProcessingListener(QueryProcessingListener<I, O> listener) {
        this.preProcessListeners.add(listener);
    }

    /**
     * Adds a post process listener to the list.
     *
     * @param listener
     *         The listener.
     */
    public void addPostProcessingListener(QueryProcessingListener<I, O> listener) {
        this.preProcessListeners.add(listener);
    }

    @Override
    public void processQueries(Collection<? extends Query<I, Word<O>>> queries) {
        if (queries.size() > 0) {
            preProcessListeners.forEach(listener -> listener.process(queries));
            delegate.processQueries(queries);
            postProcessListeners.forEach(listener -> listener.process(queries));
        }
    }
}
