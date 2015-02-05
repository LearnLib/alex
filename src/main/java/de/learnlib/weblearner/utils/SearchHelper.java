package de.learnlib.weblearner.utils;

import de.learnlib.weblearner.entities.ExecuteResult;

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
     * @return ExecuteResult.OK on success, ExecuteResult.FAILED otherwise.
     */
    public static ExecuteResult search(String value, String text, boolean regex) {
        if (regex) {
            return searchWithRegex(value, text);
        } else {
            return searchWithoutRegex(value, text);
        }
    }

    private static ExecuteResult searchWithoutRegex(String value, String text) {
        if (text.contains(value)) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }

    /**
     * Search for a regular expression within a text.
     * This method allows to use the '.' for line breaks.
     *
     * @param regex
     *         The pattern to search.
     * @param text
     *         The text to match.
     * @return ExecuteResult.OK on success, ExecuteResult.FAILED otherwise.
     */
    public static ExecuteResult searchWithRegex(String regex, String text) {
        Pattern pattern = Pattern.compile(regex, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        if (matcher.matches()) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }

}
