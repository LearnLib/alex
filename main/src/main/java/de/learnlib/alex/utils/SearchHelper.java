package de.learnlib.alex.utils;

import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.FileStoreConnector;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;

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
     * Search for a value within a text.
     * If you use a regular expression, this method allows to use the '.' for line breaks.
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
     * Search for a regular expression within a text.
     * This method allows to use the '.' for line breaks.
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
        return matcher.matches();
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
        StringBuilder result = new StringBuilder();
        int variableStartPos = text.indexOf("{{");
        int variableEndPos = -2; // because of the length of '}}' we will always +2 to the endPos,
                                 // so this is a start at 0

        while (variableStartPos > -1) {
            result.append(text.substring(variableEndPos + 2, variableStartPos)); // add everything before the variable.

            variableEndPos = text.indexOf("}}", variableStartPos);
            String variableName = text.substring(variableStartPos + 3, variableEndPos);

            String variableValue;
            switch (text.charAt(variableStartPos + 2)) {
                case '#': // counter
                    variableValue = String.valueOf(connector.getConnector(CounterStoreConnector.class).get(projectId, variableName));
                    result.append(variableValue);
                    break;
                case '$': // variable:
                    variableValue = connector.getConnector(VariableStoreConnector.class).get(variableName);
                    result.append(variableValue);
                    break;
                case '/': // file name
                    variableValue = connector.getConnector(FileStoreConnector.class)
                                             .getAbsoluteFileLocation(projectId,variableName);
                    result.append(variableValue);
                    break;
                default: // bullshit
                    result.append(text.substring(variableStartPos, variableEndPos + 2));
                    break;
            }

            variableStartPos = text.indexOf("{{", variableEndPos); // prepare next step
        }

        result.append(text.substring(variableEndPos + 2));

        return result.toString();
    }

}
