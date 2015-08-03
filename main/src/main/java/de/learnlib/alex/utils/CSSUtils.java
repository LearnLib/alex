package de.learnlib.alex.utils;

/**
 * Utility class for CSS stuff
 */
public class CSSUtils {

    /**
     * Escape special characters in css id selectors
     *
     * Port of https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js
     *
     * @param id The id selector of an element starting with #
     * @return The escaped id
     */
    private static String escapeIdentifier(String id) {
        String result = "";
        Integer firstUnit = (int) id.charAt(0);

        for (Integer i = 0; i < id.length(); i++) {
            char c = id.charAt(i);
            Integer unit = (int) c;

            if (unit.equals(0)) {
                return null;
            }

            if (
                (unit >= 1 && unit <= 31) || unit.equals(127) ||
                (i.equals(0) && unit >= 48 && unit <= 57) ||
                (i.equals(1) && unit >= 48 && unit <= 57 && firstUnit.equals(45))
            ) {
                result += "\\" + Integer.toHexString(unit) + " ";
                continue;
            }

            if (
                unit >= 128 ||
                unit.equals(45) ||
                unit.equals(95) ||
                unit >= 48 && unit <= 57 ||
                unit >= 65 && unit <= 90 ||
                unit >= 97 && unit <= 122
            ) {
                result += c;
                continue;
            }

            result += "\\" + c;
        }

        return result;
    }

    /**
     * Escapes special characters in CSS selectors in case it contains ids
     *
     * @param css The css string to escape
     * @return The escaped css string
     */
    public static String escapeSelector(String css) {

        if (!css.contains(" ") && css.startsWith("#")) {
            return "#" + escapeIdentifier(css.substring(1, css.length()));
        } else {
            String result = "";
            String[] pieces = css.split(" ");

            for (String p : pieces) {
                if (p.startsWith("#")) {
                    result += "#" + escapeIdentifier(p.substring(1, p.length())) + " ";
                } else {
                    result += p + " ";
                }
            }

            return result;
        }
    }
}
