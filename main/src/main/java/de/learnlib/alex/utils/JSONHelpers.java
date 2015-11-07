package de.learnlib.alex.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;

/**
 * Helper class for some JSON stuff.
 */
public final class JSONHelpers {

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

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
            JsonNode node = getNodeByAttribute(json, attribute);
            if (node == null) {
                LOGGER.info("Could not extract the value of the attribute '" + attribute + "' "
                            + "in the body '" + json + "'.");
                return  null;
            } else {
                String value = node.asText();
                LOGGER.info("The attribute '" + attribute + "' has the value '" + value + "' "
                            + " in the body '" + json + "'.");
                return value;
            }
        } catch (IOException e) {
            LOGGER.info("Could not pares the JSON to get the value of an attribute.", e);
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
    public static JsonNodeType getAttributeType(String json, String attribute) {
        try {
            JsonNode node = getNodeByAttribute(json, attribute);
            if (node == null) {
                LOGGER.info("Could not extract the type of the attribute '" + attribute + "' "
                            + "in the body '" + json + "'.");
                return  null;
            } else {
                JsonNodeType nodeType = node.getNodeType();
                LOGGER.info("The attribute '" + attribute + "' has the type '" + nodeType + "' "
                                    + " in the body '" + json + "'.");
                return nodeType;
            }
        } catch (IOException e) {
            LOGGER.info("Could not pares the JSON to get the type of an attribute.", e);
            return null;
        }
    }

    private static JsonNode getNodeByAttribute(String json, String attribute) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode current = mapper.readTree(json);

        String[] attributes = attribute.split("\\."); // "\\." is required because it uses regex

        for (int i = 0; i < attributes.length && current != null; i++) {
            current = current.get(attributes[i]);
        }

        return current;
    }

}
