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

import de.learnlib.api.MembershipOracle;
import de.learnlib.api.Query;
import net.automatalib.words.Word;

import javax.annotation.ParametersAreNonnullByDefault;
import java.util.Collection;

/**
 * Oracle that delegates queries to another oracle that can be exchanged.
 *
 * @param <I> Input symbol type.
 * @param <O> Output symbol type.
 */
@ParametersAreNonnullByDefault
public class DelegationOracle<I, O> implements MembershipOracle<I, Word<O>> {

    /** The sul the membership queries should be posed to. */
    private MembershipOracle<I, Word<O>> delegate;

    /**
     * Constructor.
     *
     * @param delegate The membership oracle the queries are delegated to.
     */
    public DelegationOracle(MembershipOracle<I, Word<O>> delegate) {
        this.delegate = delegate;
    }

    @Override
    public void processQueries(Collection<? extends Query<I, Word<O>>> queries) {
        delegate.processQueries(queries);
    }

    public void setDelegate(MembershipOracle<I, Word<O>> delegate) {
        this.delegate = delegate;
    }

    public MembershipOracle<I, Word<O>> getDelegate() {
        return delegate;
    }
}
