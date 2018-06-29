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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.api.SUL;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.Query;
import net.automatalib.words.Word;
import net.automatalib.words.WordBuilder;

import javax.annotation.ParametersAreNonnullByDefault;
import java.util.Collection;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Oracle that allows batched execution of membership queries to multiple suls.
 *
 * @param <I> Input symbol type.
 * @param <O> Output symbol type.
 */
@ParametersAreNonnullByDefault
public class MultiSULOracle<I, O> implements MembershipOracle<I, Word<O>> {

    /** The sul the membership queries should be posed to. */
    private final SUL<I, O> sul;

    /** If the learning experiment has been interrupted by the user. */
    private boolean isInterrupted = false;

    /**
     * Constructor.
     *
     * @param sul The sul the membership queries should be posed to.
     */
    public MultiSULOracle(SUL<I, O> sul) {
        this.sul = sul;
    }

    @Override
    public void processQueries(Collection<? extends Query<I, Word<O>>> queries) {
        if (queries.size() > 0) {
            if (isInterrupted) {
                // force a null pointer exception so the learner stops
                queries.forEach(q -> q.answer(null));
            } else {
                processQueries(sul, queries);
            }
        }
    }

    private void processQueries(SUL<I, O> sul, Collection<? extends Query<I, Word<O>>> queries) {
        ExecutorService executor = Executors.newFixedThreadPool(queries.size());

        for (Query<I, Word<O>> q : queries) {
            Runnable worker = () -> {

                // forking the sul allows us to pose multiple
                // queries in parallel to multiple suls
                SUL<I, O> forkedSul = null;
                Exception lastException;
                int i = 0;
                while (i < 2) {
                    try {
                        forkedSul = sul.fork();
                        forkedSul.pre();

                        // Prefix: Execute symbols, don't record output
                        for (I sym : q.getPrefix()) {
                            forkedSul.step(sym);
                        }

                        // Suffix: Execute symbols, outputs constitute output word
                        WordBuilder<O> wb = new WordBuilder<>(q.getSuffix().length());
                        for (I sym : q.getSuffix()) {
                            wb.add(forkedSul.step(sym));
                        }

                        q.answer(wb.toWord());
                        forkedSul.post();
                        break;
                    } catch (Exception e) {
                        lastException = e;
                        if (forkedSul != null) {
                            forkedSul.post();
                        }
                        i++;
                    }

                    if (i == 2) {
                        throw new LearnerException("Retried 2 times without success. " + lastException.getMessage());
                    }
                }
            };

            executor.submit(worker);
        }

        executor.shutdown();
        while (!executor.isTerminated()) { // wait for all futures to finish
        }
    }

    public void interrupt() {
        this.isInterrupted = true;
    }
}
