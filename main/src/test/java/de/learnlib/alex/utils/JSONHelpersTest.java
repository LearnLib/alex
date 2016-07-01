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

package de.learnlib.alex.utils;


import de.learnlib.alex.actions.RESTSymbolActions.CheckAttributeTypeAction.JsonType;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

public class JSONHelpersTest {

    private final String json = "{\"field\": 2}";

    @Test
    public void shouldAlwaysGetTheCorrectAttributeValue() {
        String json2 = "[{\"field\": 1}]";
        String json3 = "{\"field\": [{\"sub\": 0}]}";
        String json4 = "{\"field\": {\"sub\": 0}}";

        assertEquals(JSONHelpers.getAttributeValue(json, "field"), "2");
        assertEquals(JSONHelpers.getAttributeValue(json2, "[0].field"), "1");
        assertEquals(JSONHelpers.getAttributeValue(json3, "field[0].sub"), "0");
        assertEquals(JSONHelpers.getAttributeValue(json4, "field.sub"), "0");
    }

    @Test
    public void shouldReturnCorrectValueIfJSONIsNotStrictJSONOnGetValue() {
        assertThat(JSONHelpers.getAttributeValue("{field: Test}", "field"), is(equalTo("Test")));
    }

    @Test
    public void shouldReturnNullIfJSONIsEmptyOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue("", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONIsInvalidOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue("{\"foo\": \"bar\" \"field\": \"Test\"}", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONIsNotEvenCloseToProperJSONOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue("this is not real json", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONPathIsInvalidOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue(json, "(field"));
    }

    @Test
    public void shouldGetTheTypeStringCorrectly() {
        String json = "{\"field\": \"stringggg\"}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.STRING);
    }

    @Test
    public void shouldGetTheTypeNumberCorrectly1() {
        String json = "{\"field\": 1}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.INTEGER);
    }

    @Test
    public void shouldGetTheTypeNumberCorrectly2() {
        String json = "{\"field\": 1.2}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.INTEGER);
    }

    @Test
    public void shouldGetTheTypeTrueCorrectly() {
        String json = "{\"field\": true}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.BOOLEAN);
    }

    @Test
    public void shouldGetTheTypeFalseCorrectly() {
        String json = "{\"field\": false}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.BOOLEAN);
    }

    @Test
    public void shouldGetTheTypeObjectCorrectly1() {
        String json = "{\"field\": {}}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.OBJECT);
    }

    @Test
    public void shouldGetTheTypeArrayCorrectly1() {
        String json = "{\"field\": []}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.ARRAY);
    }

    @Test
    public void shouldGetTheTypeNullCorrectly1() {
        String json = "{\"field\": null}";

        assertEquals(JSONHelpers.getAttributeType(json, "field"), JsonType.NULL);
    }

    @Test
    public void shouldReturnCorrectTypeIfJSONIsNotStrictJSONOnGetType() {
        assertThat(JSONHelpers.getAttributeType("{field: Test}", "field"), is(equalTo(JsonType.STRING)));
    }

    @Test
    public void shouldReturnNullIfJSONIsEmptyOnGetType() {
        assertNull(JSONHelpers.getAttributeType("", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONIsNotEvenCloseToProperJSONOnGetType() {
        assertNull(JSONHelpers.getAttributeType("this is not real json", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONIsInvalidOnGetType() {
        assertNull(JSONHelpers.getAttributeType("{\"foo\": \"bar\" \"field\": \"Test\"}", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONPathIsInvalidOnGetType() {
        assertNull(JSONHelpers.getAttributeType(json, "!=field"));
    }
}
