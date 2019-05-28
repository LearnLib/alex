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

package de.learnlib.alex.learning.services.oracles;

import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.Query;

import java.util.Collection;

public class StatisticsOracle<I, D> implements MembershipOracle<I, D> {

    private final MembershipOracle<I, D> delegate;

    private long queryCount = 0;

    private long symbolCount = 0;

    public StatisticsOracle(MembershipOracle<I, D> delegate) {
        this.delegate = delegate;
    }

    @Override
    public void processQueries(Collection<? extends Query<I, D>> queries) {
        queryCount += queries.size();
        for (Query<I, D> qry : queries) {
            symbolCount += qry.getInput().length();
        }
        delegate.processQueries(queries);
    }

    public void reset() {
        queryCount = 0;
        symbolCount = 0;
    }

    public long getQueryCount() {
        return queryCount;
    }

    public long getSymbolCount() {
        return symbolCount;
    }
}
