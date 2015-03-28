package de.learnlib.weblearner.learner.connectors;

import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.weblearner.entities.Symbol;

public class ConnectorContextHandler implements ContextExecutableInputSUL.ContextHandler<ConnectorManager> {

    private Symbol resetSymbol;

    private ConnectorManager connectors;

    public ConnectorContextHandler() {
        this.connectors = new ConnectorManager();
    }

    public void addConnector(Connector connector) {
        this.connectors.addConnector(connector.getClass(), connector);
    }

    public void setResetSymbol(Symbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    @Override
    public ConnectorManager createContext() {
        connectors.forEach(Connector::reset);

        try {
            resetSymbol.execute(connectors);
        } catch (Exception e) {
            // todo(alex.s): what shall we do with the broken reset symbol?
            e.printStackTrace();
        }

        return connectors;
    }

    @Override
    public void disposeContext(ConnectorManager connector) {
        // nothing to do here
    }

}
