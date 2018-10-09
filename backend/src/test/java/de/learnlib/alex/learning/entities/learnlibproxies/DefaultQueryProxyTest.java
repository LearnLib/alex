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

package de.learnlib.alex.learning.entities.learnlibproxies;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.api.query.DefaultQuery;
import net.automatalib.words.Word;
import org.junit.Assert;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class DefaultQueryProxyTest {

    private final ObjectMapper om = new ObjectMapper();

    @Test
    public void shouldSerializeCorrectly() throws Exception {
        final DefaultQuery<String, Word<String>> query = createQuery();
        final DefaultQueryProxy queryProxy = DefaultQueryProxy.createFrom(query);
        final String queryString = om.writeValueAsString(queryProxy);
        final String expectedQueryString = "{\"prefix\":[],\"suffix\":[\"a\",\"b\"],\"output\":[\"1\",\"2\"]}";

        JSONAssert.assertEquals(expectedQueryString, queryString, true);
    }

    @Test
    public void shouldCreateQueryFromProxy() {
        final DefaultQuery<String, Word<String>> query = createQuery();
        final DefaultQueryProxy queryProxy = DefaultQueryProxy.createFrom(query);

        Assert.assertEquals(query, queryProxy.createDefaultQuery());
    }

    private DefaultQuery<String, Word<String>> createQuery() {
        final DefaultQuery<String, Word<String>> query = new DefaultQuery<>(Word.fromSymbols("a", "b"));
        query.answer(Word.fromSymbols("1", "2"));
        return query;
    }

}
