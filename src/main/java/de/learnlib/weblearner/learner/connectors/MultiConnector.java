package de.learnlib.weblearner.learner.connectors;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MultiConnector implements Connector, Iterable<Connector> {

    private Map<Class<? extends Connector>, Connector> connectors;

    public MultiConnector() {
        this.connectors = new HashMap<>();
    }

    @Override
    public void reset() {
        this.connectors.clear();
    }

    public void addConnector(Class<? extends Connector> type, Connector connector) {
        this.connectors.put(type, connector);
    }

    public <T> T getConnector(Class<T> type) {
        return (T) this.connectors.get(type);
    }

    @Override
    public Iterator<Connector> iterator() {
        return connectors.values().iterator();
    }
}
