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

package de.learnlib.alex.common.utils;

import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.FileStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Helper class to make searching in a text easier.
 */
public final class SearchHelper {

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private SearchHelper() {
    }

    /**
     * Search for a value within a text. If you use a regular expression, this method allows to use the '.' for line
     * breaks.
     *
     * @param value
     *         The value to search. This can be a regular expression.
     * @param text
     *         The text to match.
     * @param regex
     *         Flag if the value is a regular expression or not.
     * @return true on success, False otherwise.
     */
    public static boolean search(String value, String text, boolean regex) {
        if (regex) {
            return searchWithRegex(value, text);
        } else {
            return searchWithoutRegex(value, text);
        }
    }

    private static boolean searchWithoutRegex(String value, String text) {
        return text.contains(value);
    }

    /**
     * Search for a regular expression within a text. This method allows to use the '.' for line breaks.
     *
     * @param regex
     *         The pattern to search.
     * @param text
     *         The text to match.
     * @return true on success, false otherwise.
     */
    public static boolean searchWithRegex(String regex, String text) {
        Pattern pattern = Pattern.compile(regex, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find();
    }

    /**
     * Replace all counters and variables within an input string by their actual values.
     *
     * @param connector
     *         The connectors to connect to the counter and variable stores.
     * @param projectId
     *         The project as context.
     * @param text
     *         The input string to pares and to replace the counters and variables in.
     * @return The input string with all counter adn variables replaced by their values.
     * @throws IllegalStateException
     *         If a variable value should be inserted, but the variable does not exists or was never set.
     */
    public static String insertVariableValues(ConnectorManager connector, Long projectId, String text)
            throws IllegalStateException {

        final VariableStoreConnector variableStore = connector.getConnector(VariableStoreConnector.class);
        final CounterStoreConnector counterStore = connector.getConnector(CounterStoreConnector.class);
        final FileStoreConnector fileStore = connector.getConnector(FileStoreConnector.class);

        String result = "" + text;

        final Pattern pattern = Pattern.compile("\\{\\{(\\$|\\#|\\\\)(.*?)}}");
        final Matcher matcher = pattern.matcher(result);

        while (matcher.find()) {
            final String type = matcher.group(1);
            final String name = matcher.group(2);

            switch (type) {
                case "$":
                    result = result.replaceAll("\\{\\{\\$" + name + "}}", variableStore.get(name));
                    break;
                case "#":
                    result = result.replaceAll("\\{\\{\\#" + name + "}}", String.valueOf(counterStore.get(name)));
                    break;
                case "\\":
                    final String path = fileStore.getAbsoluteFileLocation(projectId, name);
                    result = result.replaceAll("\\{\\{\\\\" + name + "}}", path);
                    break;
                default:
                    break;
            }
        }

        return result;
    }

}
