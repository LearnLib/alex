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

import de.learnlib.alex.learning.services.oracles.QueryMonitorOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.DefaultQuery;
import net.automatalib.words.Word;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class QueryMonitorOracleTest {

    private MembershipOracle<String, Word<String>> mqOracle;

    private QueryMonitorOracle<String, String> monitorOracle;

    private int count1;
    private int count2;

    @Before
    public void before() {
        this.mqOracle = Mockito.mock(MembershipOracle.class);
        Mockito.doNothing().when(mqOracle).processQueries(Mockito.anyCollection());

        count1 = 0;
        count2 = 0;

        final QueryMonitorOracle.QueryProcessingListener<String, String> preListener = queries -> count1 = queries.size();
        final QueryMonitorOracle.QueryProcessingListener<String, String> postListener = queries -> count2 = queries.size();

        this.monitorOracle = new QueryMonitorOracle<>(mqOracle);
        this.monitorOracle.addPreProcessingListener(preListener);
        this.monitorOracle.addPostProcessingListener(postListener);
    }

    @Test
    public void shouldDoNothingIfNoQueriesAreProcessed() {
        monitorOracle.processQueries(Collections.emptyList());
        Mockito.verify(mqOracle, Mockito.never()).processQueries(Mockito.anyCollection());
        Assert.assertEquals(0, count1);
        Assert.assertEquals(0, count2);
    }

    @Test
    public void shouldProcessPreAndPostListeners() {
        final List<DefaultQuery<String, Word<String>>> queries = new ArrayList<>();
        queries.add(new DefaultQuery<>(Word.fromSymbols("a", "b")));
        queries.add(new DefaultQuery<>(Word.fromSymbols("b", "c")));

        monitorOracle.processQueries(queries);
        Mockito.verify(mqOracle, Mockito.times(1)).processQueries(queries);
        Assert.assertEquals(2, count1);
        Assert.assertEquals(2, count2);
    }
}
