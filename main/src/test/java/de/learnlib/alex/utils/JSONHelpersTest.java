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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

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
    public void shouldReturnNullIfJSONIsEmptyOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue("", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONPathIsInvalidOnGetValue() {
        assertNull(JSONHelpers.getAttributeValue(json, "(field"));
    }

    @Test
    public void shouldAlwaysGetTheCorrectAttributeType() {
        String jsonString = "{\"field\": \"stringggg\"}";
        String jsonNumber1 = "{\"field\": 1}";
        String jsonNumber2 = "{\"field\": 1.2}";
        String jsonBoolean1 = "{\"field\": true}";
        String jsonBoolean2 = "{\"field\": false}";
        String jsonObject = "{\"field\": {}}";
        String jsonArray = "{\"field\": []}";
        String jsonNull = "{\"field\": null}";

        assertEquals(JSONHelpers.getAttributeType(jsonString, "field"), JsonType.STRING);
        assertEquals(JSONHelpers.getAttributeType(jsonNumber1, "field"), JsonType.INTEGER);
        assertEquals(JSONHelpers.getAttributeType(jsonNumber2, "field"), JsonType.INTEGER);
        assertEquals(JSONHelpers.getAttributeType(jsonBoolean1, "field"), JsonType.BOOLEAN);
        assertEquals(JSONHelpers.getAttributeType(jsonBoolean2, "field"), JsonType.BOOLEAN);
        assertEquals(JSONHelpers.getAttributeType(jsonObject, "field"), JsonType.OBJECT);
        assertEquals(JSONHelpers.getAttributeType(jsonArray, "field"), JsonType.ARRAY);
        assertEquals(JSONHelpers.getAttributeType(jsonNull, "field"), JsonType.NULL);
    }

    @Test
    public void shouldReturnNullIfJSONIsEmptyOnGetType() {
        assertNull(JSONHelpers.getAttributeType("", "field"));
    }

    @Test
    public void shouldReturnNullIfJSONPathIsInvalidOnGetType() {
        assertNull(JSONHelpers.getAttributeType(json, "!=field"));
    }
}
