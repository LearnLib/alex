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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.automatalib.words.Word;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class SeparatingWordTest {

    private final ObjectMapper om = new ObjectMapper();

    @Test
    public void shouldSerializeEmptySeparatingWordCorrectly() throws Exception {
        final SeparatingWord sw = new SeparatingWord();
        final String swString = om.writeValueAsString(sw);
        final String expectedSwString = "{\"input\":[],\"output1\":[],\"output2\":[]}";
        JSONAssert.assertEquals(expectedSwString, swString, true);
    }

    @Test
    public void shouldSerializeSeparatingWordCorrectly() throws Exception {
        final SeparatingWord sw = new SeparatingWord(Word.fromLetter("a"), Word.fromLetter("1"), Word.fromLetter("2"));
        final String swString = om.writeValueAsString(sw);
        final String expectedSwString = "{\"input\":[\"a\"],\"output1\":[\"1\"],\"output2\":[\"2\"]}";
        JSONAssert.assertEquals(expectedSwString, swString, true);
    }
}
