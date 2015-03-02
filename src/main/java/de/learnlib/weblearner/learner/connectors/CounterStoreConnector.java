package de.learnlib.weblearner.learner.connectors;

import java.util.HashMap;
import java.util.Map;

public class CounterStoreConnector implements Connector {

    private Map<String, Integer> store;

    public CounterStoreConnector() {
        this.store = new HashMap<>();
    }

    public void clear() {
        store = new HashMap<>();
    }

    public void declare(String name) throws IllegalArgumentException {
        if (store.containsKey(name)) {
            throw new IllegalArgumentException("Counter already declared.");
        }
        store.put(name, 0);
    }

    public void set(String name, Integer value) throws IllegalStateException {
        if (!store.containsKey(name)) {
            throw new IllegalStateException("A counter must be declared before the first use.");
        }
        store.put(name, value);
    }

    public void reset(String name) throws IllegalStateException {
        if (!store.containsKey(name)) {
            throw new IllegalStateException("A counter must be declared before the first use.");
        }
        store.put(name, 0);
    }

    public void increment(String name) throws IllegalStateException {
        Integer currentValue = store.get(name);
        if (currentValue == null) {
            throw new IllegalStateException("A counter must be declared before the first use.");
        }
        store.put(name, currentValue + 1);
    }

    public boolean contains(String name) {
        return store.containsKey(name);
    }

    public Integer get(String name) throws IllegalStateException {
        Integer result = store.get(name);
        if (result == null) {
            throw new IllegalStateException("A counter must be declared before the first use.");
        }
        return result;
    }


}
