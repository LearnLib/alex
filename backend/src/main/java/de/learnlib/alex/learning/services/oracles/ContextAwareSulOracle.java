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

import de.learnlib.alex.common.exceptions.LearnerInterruptedException;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.SymbolMapper;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.api.SUL;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.Query;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.SULMappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracle.membership.SULOracle;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.subjects.Subject;
import java.util.Collection;
import java.util.concurrent.atomic.AtomicBoolean;
import net.automatalib.words.Word;

/**
 * Wrapper for a {@link SULOracle} that knows its context.
 */
public class ContextAwareSulOracle implements MembershipOracle<String, Word<String>> {

    /** The oracle to pose queries to. */
    private final SULOracle<String, String> sulOracle;

    /** The context handler for the learning process. */
    private final ConnectorContextHandler contextHandler;

    private final AtomicBoolean aborted = new AtomicBoolean(false);

    private final Disposable abortSubscription;

    /**
     * Constructor.
     *
     * @param symbolMapper
     *         The shared instance of the symbol mapper.
     * @param contextHandler
     *         {@link #contextHandler}.
     */
    public ContextAwareSulOracle(SymbolMapper symbolMapper, ConnectorContextHandler contextHandler, Subject<Boolean> abortSubject) {
        this.contextHandler = contextHandler;

        final ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult, ConnectorManager> ceiSUL
                = new ContextExecutableInputSUL<>(contextHandler);
        final SUL<String, String> sul = SULMappers.apply(symbolMapper, ceiSUL);
        this.sulOracle = new SULOracle<>(sul);

        this.abortSubscription = abortSubject.subscribe(aborted::set);
    }

    @Override
    public void processQueries(Collection<? extends Query<String, Word<String>>> queries) {
        for (var query: queries) {
            if (aborted.get()) {
                throw new LearnerInterruptedException("The learning process has been aborted by the user");
            } else {
                sulOracle.processQuery(query);
            }
        }
    }

    /** Clears the context. */
    public void shutdown() {
        abortSubscription.dispose();
        contextHandler.post();
    }
}
