package de.learnlib.weblearner.utils;

/**
 * A helper class used by the REST resources to parse and handel their input parameters.
 */
public final class ResourceInputHelpers {

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private ResourceInputHelpers() {
    }

    /**
     * Split up a csv like string into an array of long values.
     *
     * @param input
     *         The array to split up.
     * @return An array of long values that are encoded in the input string.
     * @throws IllegalArgumentException
     *         If something went wrong while splitting the input.
     *         A NumberFormatException is thrown, if one part could not be pares into a long.
     */
    public static Long[] splitUp(String input) throws IllegalArgumentException {
        String[] stringArray = input.split(",");
        if (stringArray.length == 0) {
            throw new IllegalArgumentException();
        }

        Long[] resultArray = new Long[stringArray.length];
        for (int i = 0; i < stringArray.length; i++) {
            resultArray[i] = Long.valueOf(stringArray[i]);
        }

        return resultArray;
    }

}
