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

package de.learnlib.alex.core.learner;

import de.learnlib.api.MembershipOracle.MealyMembershipOracle;
import de.learnlib.api.Query;
import de.learnlib.api.SUL;
import net.automatalib.words.Word;
import net.automatalib.words.WordBuilder;

import javax.annotation.ParametersAreNonnullByDefault;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.*;

@ParametersAreNonnullByDefault
public class MultiSULOracle<I, O> implements MealyMembershipOracle<I, O> {

    private final SUL<I, O> sul;

    public MultiSULOracle(SUL<I, O> sul) {
        this.sul = sul;
    }

    @Override
    public void processQueries(Collection<? extends Query<I, Word<O>>> queries) {
        if (queries.size() > 0) {
            processQueries(sul, queries);
        }
    }

    private static <I, O> void processQueries(SUL<I, O> sul, Collection<? extends Query<I, Word<O>>> queries) {
        ExecutorService executor = Executors.newFixedThreadPool(queries.size());

        List<Future<Word<O>>> futures = new ArrayList<>(); // stores the futures with the words
        List<Query<I, Word<O>>> qs = new ArrayList<>();

        for (Query<I, Word<O>> q : queries) {
            qs.add(q);

            Callable<Word<O>> worker = () -> {

                // forking the sul allows us to pose multiple
                // queries in parallel to multiple suls
                SUL<I, O> forkedSul = sul.fork();
                forkedSul.pre();

                try {

                    // Prefix: Execute symbols, don't record output
                    for (I sym : q.getPrefix()) {
                        forkedSul.step(sym);
                    }

                    // Suffix: Execute symbols, outputs constitute output word
                    WordBuilder<O> wb = new WordBuilder<>(q.getSuffix().length());
                    for (I sym : q.getSuffix()) {
                        wb.add(forkedSul.step(sym));
                    }

                    return wb.toWord();
                } finally {
                    forkedSul.post();
                }
            };

            Future<Word<O>> submit = executor.submit(worker);
            futures.add(submit);
        }

        executor.shutdown();
        while (!executor.isTerminated()) { // wait for all futures to finish
        }
        for (int i = 0; i < futures.size(); i++) {
            try {
                Word<O> output = futures.get(i).get();
                qs.get(i).answer(output);
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }
    }
}