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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.BeforeClass;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class UploadableFileTest {

    private static ObjectMapper om;

    @BeforeClass
    public static void setup() {
        om = new ObjectMapper();
    }

    @Test
    public void shouldSerializeCorrectly() throws Exception {
        final UploadableFile file = new UploadableFile();
        file.setName("test");
        file.setProjectId(1L);
        file.setId(1L);

        final String fileString = om.writeValueAsString(file);
        final String expectedFileString = "{\"id\":1,\"name\":\"test\",\"project\":1}";
        JSONAssert.assertEquals(expectedFileString, fileString, true);
    }
}
