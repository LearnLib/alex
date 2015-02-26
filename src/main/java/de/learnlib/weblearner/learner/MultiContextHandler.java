package de.learnlib.weblearner.learner;

import de.learnlib.mapper.ContextExecutableInputSUL;

import java.util.LinkedList;
import java.util.List;

public class MultiContextHandler extends AbstractContextHandlerWithCounter<MultiConnector> {

    private List<ContextExecutableInputSUL.ContextHandler<? extends Connector>> handlers;

    private MultiConnector connectors;

    public MultiContextHandler() {
        this.handlers = new LinkedList<>();
        this.connectors = new MultiConnector();
        resetCounter();
    }

    public void addHandler(ContextExecutableInputSUL.ContextHandler<? extends Connector> handler) {
        this.handlers.add(handler);

    }

    @Override
    public MultiConnector createContext() {
        incrementCounter();
        connectors.clear();
        for (ContextExecutableInputSUL.ContextHandler<? extends Connector> h : handlers) {
            Connector newConnector = h.createContext();
            connectors.addConnector(newConnector.getClass(), newConnector);
        }
        return connectors;
    }

    @Override
    public void disposeContext(MultiConnector connector) {
        //TODO(alex.s): delegate disposeContext down
//        for (ContextExecutableInputSUL.ContextHandler<? extends Connector> h : handlers) {
//            Connector c = connector.getConnector(h.getClass());
//            try {
//                Class clazz = h.getClass();
//                Method method = clazz.getMethod("disposeContext", c.getClass());
//                method.invoke(c);
//            } catch (NoSuchMethodException e) {
//                e.printStackTrace();
//            } catch (InvocationTargetException e) {
//                e.printStackTrace();
//            } catch (IllegalAccessException e) {
//                e.printStackTrace();
//            }
//        }
    }
}
