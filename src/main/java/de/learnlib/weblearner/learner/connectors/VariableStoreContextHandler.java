package de.learnlib.weblearner.learner.connectors;


import de.learnlib.mapper.ContextExecutableInputSUL;

public class VariableStoreContextHandler implements ContextExecutableInputSUL.ContextHandler<VariableStoreConnector> {

    private VariableStoreConnector connector;

    public VariableStoreContextHandler() {
        this.connector = new VariableStoreConnector();
    }

    @Override
    public VariableStoreConnector createContext() {
        connector.clear();
        return connector;
    }

    @Override
    public void disposeContext(VariableStoreConnector variableStoreConnector) {
        // nothing to do here
    }
}
