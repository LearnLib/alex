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

/**
 * Utility class for CSS stuff.
 */
public final class CSSUtils {

    /** ASCII Code for the unit separator character, which is not really printable. */
    public static final int UNIT_SEPARATOR_CHARACTER = 31;

    /** ASCII Code for the delete character, which is not really printable. */
    public static final int DELETE_CHARACTER = 127;

    /**
     * Deactivate the constructor because this is a utility class.
     */
    private CSSUtils() {
    }

    /**
     * Escape special characters in css id selectors.
     *
     * Port of https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js
     *
     * @param id The id selector of an element starting with #
     * @return The escaped id
     */
    private static String escapeIdentifier(String id) {
        StringBuilder result = new StringBuilder();
        char firstUnit = id.charAt(0);

        for (int i = 0; i < id.length(); i++) {
            char unit = id.charAt(i);

            if (unit == 0) { // null character
                return null;
            }

            if (
                unit <= UNIT_SEPARATOR_CHARACTER || unit == DELETE_CHARACTER // the non printable ASCII characters
                || (i == 0 && unit >= '0' && unit <= '9')
                || (i == 1 && unit >= '0' && unit <= '9' && firstUnit == '-')
            ) {
                result.append("\\").append(Integer.toHexString(unit)).append(" ");
                continue;
            }

            if (
                unit > DELETE_CHARACTER // "second half" of the (extended) ASCII table
                || unit == '-'
                || unit == '_'
                || unit >= '0' && unit <= '9'
                || unit >= 'A' && unit <= 'Z'
                || unit >= 'a' && unit <= 'z'
            ) {
                result.append(unit);
                continue;
            }

            result.append("\\").append(unit);
        }

        return result.toString();
    }

    /**
     * Escapes special characters in CSS selectors in case it contains ids.
     *
     * @param css The css string to escape
     * @return The escaped css string
     */
    public static String escapeSelector(String css) {

        if (!css.contains(" ") && css.startsWith("#")) {
            return "#" + escapeIdentifier(css.substring(1, css.length()));
        } else {
            StringBuilder result = new StringBuilder();
            String[] pieces = css.split(" ");

            for (String p : pieces) {
                if (p.startsWith("#")) {
                    result.append("#").append(escapeIdentifier(p.substring(1, p.length()))).append(" ");
                } else {
                    result.append(p).append(" ");
                }
            }

            return result.toString();
        }
    }
}
