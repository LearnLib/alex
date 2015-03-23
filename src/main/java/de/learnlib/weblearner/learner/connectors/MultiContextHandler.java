package de.learnlib.weblearner.learner.connectors;

import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.weblearner.entities.Symbol;

import java.util.LinkedList;
import java.util.List;

public class MultiContextHandler implements ContextExecutableInputSUL.ContextHandler<MultiConnector> {

    private Symbol resetSymbol;

    private MultiConnector connectors;

    public MultiContextHandler() {
        this.connectors = new MultiConnector();
    }

    public void addConnector(Connector connector) {
        this.connectors.addConnector(connector.getClass(), connector);
    }

    public void setResetSymbol(Symbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    @Override
    public MultiConnector createContext() {
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
    public void disposeContext(MultiConnector connector) {
        // nothing to do here
    }

}
