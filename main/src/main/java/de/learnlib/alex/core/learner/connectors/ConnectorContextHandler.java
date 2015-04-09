package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.mapper.ContextExecutableInputSUL;

/**
 * ContextHandler for the connectors.
 */
public class ConnectorContextHandler implements ContextExecutableInputSUL.ContextHandler<ConnectorManager> {

    /** The symbol used to reset the SUL. */
    private Symbol resetSymbol;

    /** The manager which holds all the connectors. */
    private ConnectorManager connectors;

    /**
     * Default constructor.
     */
    public ConnectorContextHandler() {
        this.connectors = new ConnectorManager();
    }

    /**
     * Add a connector to the set of connectors.
     *
     * @param connector
     *         The new connector.
     */
    public void addConnector(Connector connector) {
        this.connectors.addConnector(connector.getClass(), connector);
    }

    /**
     * Set the reset symbol that should be used to reset the SUL.
     *
     * @param resetSymbol
     *         The new reset symbol.
     */
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
