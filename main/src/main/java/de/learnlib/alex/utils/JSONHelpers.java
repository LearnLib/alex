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

import com.jayway.jsonpath.InvalidJsonException;
import com.jayway.jsonpath.InvalidPathException;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.actions.RESTSymbolActions.CheckAttributeTypeAction.JsonType;
import net.minidev.json.JSONArray;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.LinkedHashMap;

/**
 * Helper class for some JSON stuff.
 */
public final class JSONHelpers {

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private JSONHelpers() {
    }

    /**
     * Get the value of an attribute from a JSON encoded String.
     *
     * @param json
     *         The JSON with the the attribute.
     * @param attribute
     *         The attribute to search for.
     * @return The value of the attribute as JSON encoded String or null.
     */
    public static String getAttributeValue(String json, String attribute) {
        try {
            String value = String.valueOf(getParsedAttributeValue(json, attribute));
            LOGGER.info("The attribute '{}' has the value '{}' in the body '{}'.", attribute, value, json);
            return value;
        } catch (InvalidJsonException e) {
            LOGGER.info("JSON was not valid, e.g. the body was empty.", e);
            return null;
        } catch (InvalidPathException e) {
            LOGGER.info("Could not parse the JSON to get the value of an attribute.", e);
            return null;
        }
    }

    /**
     * Get the type of an attribute from a JSON encoded String.
     *
     * @param json
     *         The JSON with the the attribute.
     * @param attribute
     *         The attribute to search for.
     * @return The type of the attribute or null.
     */
    public static JsonType getAttributeType(String json, String attribute) {
        try {
            Object o = getParsedAttributeValue(json, attribute);
            if (o == null) {
                return JsonType.NULL;
            } else if (o instanceof String) {
                return JsonType.STRING;
            } else if (o instanceof Integer || o instanceof Double) {
                return JsonType.INTEGER;
            } else if (o instanceof JSONArray) {
                return JsonType.ARRAY;
            } else if (o instanceof LinkedHashMap) {
                return JsonType.OBJECT;
            } else if (o instanceof Boolean) {
                return JsonType.BOOLEAN;
            } else {
                LOGGER.info("Unsupported JSON type.");
                return null;
            }
        } catch (InvalidJsonException e) {
            LOGGER.info("JSON was not valid, e.g. the body was empty.", e);
            return null;
        } catch (InvalidPathException e) {
            LOGGER.info("Could not parse the JSON to get the type of an attribute.", e);
            return null;
        }
    }

    private static Object getParsedAttributeValue(String json, String attribute)
            throws InvalidJsonException, InvalidPathException {
        if (json.startsWith("[")) {
            return JsonPath.read(json, "$" + attribute);
        } else if (json.startsWith("{")) {
            return JsonPath.read(json, "$." + attribute);
        } else {
            throw new InvalidJsonException();
        }
    }
}
