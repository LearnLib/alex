package de.learnlib.alex.core.learner.connectors;

import java.util.HashMap;
import java.util.Map;

/**
 * Connector to hold and manage variables.
 */
public class VariableStoreConnector implements Connector {

    /** The variable store. */
    private Map<String, String> store;

    /**
     * Default constructor.
     */
    public VariableStoreConnector() {
        this.store = new HashMap<>();
    }

    @Override
    public void reset() {
        store = new HashMap<>();
    }

    /**
     * Set a variable to a certain value.
     *
     * @param name
     *         The name of the variable to set.
     * @param value
     *         The value to set.
     */
    public void set(String name, String value) {
        store.put(name, value);
    }

    /**
     * Check if a variable with a specific name exists.
     *
     * @param name
     *         The name to check.
     * @return true if the variable exists; false otherwise.
     */
    public boolean contains(String name) {
        return store.containsKey(name);
    }

    /**
     * Get the value of a variable.
     *
     * @param name
     *         The variable to get the value from.
     * @return The value of the variabl.
     * @throws IllegalStateException
     *         If the variable was not set before.
     */
    public String get(String name) throws IllegalStateException {
        String result = store.get(name);
        if (result == null) {
            throw new IllegalStateException("The variable '" + name + "' was not set and has no value!");
        }
        return result;
    }
}
