package de.learnlib.weblearner.learner.connectors;

import de.learnlib.mapper.ContextExecutableInputSUL;

public class CounterStoreContextHandler implements ContextExecutableInputSUL.ContextHandler<CounterStoreConnector> {

    private CounterStoreConnector connector;

    public CounterStoreContextHandler() {
        this.connector = new CounterStoreConnector();
    }

    @Override
    public CounterStoreConnector createContext() {
        connector.clear();
        return connector;
    }

    @Override
    public void disposeContext(CounterStoreConnector counterStoreConnector) {
        // nothing to do here
    }
}
