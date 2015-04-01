package de.learnlib.weblearner.core.learner.connectors;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class ConnectorManager implements Iterable<Connector> {

    private Map<Class<? extends Connector>, Connector> connectors;

    public ConnectorManager() {
        this.connectors = new HashMap<>();
    }

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
