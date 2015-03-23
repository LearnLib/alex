package de.learnlib.weblearner.learner.connectors;

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

    public void declare(String name) throws IllegalArgumentException {
        if (store.containsKey(name)) {
            throw new IllegalArgumentException("Counter already declared.");
        }
        store.put(name, "");
    }

    public void set(String name, String value) throws IllegalStateException {
        if (!store.containsKey(name)) {
            throw new IllegalStateException("A variable must be declared before the first use.");
        }
        store.put(name, value);
    }

    public boolean contains(String name) {
        return store.containsKey(name);
    }

    public String get(String name) throws IllegalStateException {
        String result = store.get(name);
        if (result == null) {
            throw new IllegalStateException("A variable must be declared before the first use.");
        }
        return result;
    }
}
