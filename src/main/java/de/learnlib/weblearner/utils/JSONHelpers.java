package de.learnlib.weblearner.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.List;

/**
 * Helper class for some JSON stuff.
 */
public final class JSONHelpers {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /**
     * Disabled default constructor, this is only a utility class with static methods.
     */
    private JSONHelpers() {
    }

    /**
     * Convert a List of JSON encoded data into a JSON encoded list without additional '"'.
     *
     * @param list
     *         A List of JSON encoded strings.
     * @return A JSON encoded list of the data.
     */
    public static String stringListToJSON(List<String> list) {
        StringBuilder json = new StringBuilder();
        json.append('[');
        if (list.size() > 0) {
            for (String p : list) {
                json.append(p);
                json.append(',');
            }
            json.deleteCharAt(json.length() - 1); // remove last ','
        }
        json.append(']');
        return json.toString();
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
                return  null;
            } else {
                return node.asText();
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
                return  null;
            } else {
                return node.getNodeType();
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
