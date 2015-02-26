package de.learnlib.weblearner.learner;

import java.util.HashMap;
import java.util.Map;

public class MultiConnector {

    private Map<Class<?>, Connector> connectors;

    public MultiConnector() {
        this.connectors = new HashMap<>();
    }

    public void addConnector(Class<?> type, Connector connector) {
        this.connectors.put(type, connector);
    }

    public Connector getConnector(Class<?> type) {
        return this.connectors.get(type);
    }

    public void clear() {
        this.connectors.clear();
    }

}
