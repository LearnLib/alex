package de.learnlib.weblearner.learner.connectors;

import de.learnlib.weblearner.dao.CounterDAO;
import de.learnlib.weblearner.dao.CounterDAOImpl;
import de.learnlib.weblearner.entities.Counter;
import de.learnlib.weblearner.entities.Project;
import org.jvnet.hk2.annotations.Service;

import javax.inject.Inject;
import javax.ws.rs.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

public class CounterStoreConnector implements Connector {

    private CounterDAO counterDAO;

    public CounterStoreConnector() {
        this(new CounterDAOImpl());
    }

    public CounterStoreConnector(CounterDAO counterDAO) {
        this.counterDAO = counterDAO;
    }

    @Override
    public void reset() {
        // nothing to do here
    }

    public void set(Long projectId, String name, Integer value) {
        Counter counter;
        try {
            counter = counterDAO.get(projectId, name);
            counter.setValue(value);
            counterDAO.update(counter);
        } catch (NoSuchElementException e) {
            createCounter(projectId, name, value);
        }
    }

    public void reset(Long projectId, String name) throws IllegalStateException {
        set(projectId, name, 0);
    }

    public void increment(Long projectId, String name) throws IllegalStateException {
        Counter counter;
        try {
            if (counterDAO == null) {
                System.out.println("====================================");
                System.out.println("====================================");
                System.out.println("====================================");
                System.out.println("counterDAO Injection Failed!");
                System.out.println("====================================");
                System.out.println("====================================");
                System.out.println("====================================");
            }

            counter = counterDAO.get(projectId, name);
            counter.setValue(counter.getValue() + 1);
            counterDAO.update(counter);
        } catch (NoSuchElementException e) {
            createCounter(projectId, name, 1);
        }
    }

    public Integer get(Long projectId, String name) throws IllegalStateException {
        try {
            Counter counter;
            counter = counterDAO.get(projectId, name);
            counter.setValue(counter.getValue() + 1);
            counterDAO.update(counter);
            return counter.getValue();
        } catch (NoSuchElementException e) {
            throw new IllegalStateException("A counter must be declared before the first use.");
        }
    }

    void createCounter(Long projectId, String name, Integer value) {
        Counter counter;
        counter = new Counter();
        counter.setProject(new Project(projectId));
        counter.setName(name);
        counter.setValue(value);
        counterDAO.create(counter);
    }

}
