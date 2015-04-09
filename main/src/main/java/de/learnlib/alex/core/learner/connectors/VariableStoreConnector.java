package de.learnlib.alex.core.learner.connectors;

import java.util.HashMap;
import java.util.Map;

public class VariableStoreConnector implements Connector {

    private Map<String, String> store;

    public VariableStoreConnector() {
        this.store = new HashMap<>();
    }

    @Override
    public void reset() {
        store = new HashMap<>();
    }

    public void set(String name, String value) {
        store.put(name, value);
    }

    public boolean contains(String name) {
        return store.containsKey(name);
    }

    public String get(String name) throws IllegalStateException {
        String result = store.get(name);
        if (result == null) {
            throw new IllegalStateException("The variable '" + name + "' was not set and has no value!");
        }
        return result;
    }
}
