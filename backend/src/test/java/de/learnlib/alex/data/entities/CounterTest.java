/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class CounterTest {

    private static ObjectMapper om;

    private Counter c;

    @BeforeClass
    public static void init() {
        om = new ObjectMapper();
    }

    @Before
    public void before() {
        final Project project = new Project(1L);
        c = new Counter();
        c.setId(1L);
        c.setName("test");
        c.setValue(42);
        c.setProject(project);
    }

    @Test
    public void shouldSerializeCounterCorrectly() throws Exception {
        final String counterString = om.writeValueAsString(c);
        final String expectedCounterString = "{\"id\":1,\"name\":\"test\",\"project\":1,\"value\":42}";
        JSONAssert.assertEquals(expectedCounterString, counterString, true);
    }
}
