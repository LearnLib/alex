package de.learnlib.alex.utils;

import java.util.LinkedList;

/**
 * Helper class to allow batch paths to have a csv-list of Strings.
 */
public class StringList extends LinkedList<String> {

    /**
     * Constructor
     * This is needed for Jersey, so that an StringList can be used as PathParameter.
     *
     * @param value
     *         The strings as comma separated list.
     */
    public StringList(String value) {
        String[] parts = value.split(",");
        if (parts.length == 0) {
            throw new IllegalArgumentException("No parts found!");
        }

        for (String s : parts) {
            add(s);
        }
    }


}
