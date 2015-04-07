package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
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
            return counter.getValue();
        } catch (NoSuchElementException e) {
            throw new IllegalStateException("The counter '" + name + "' was not set and has no value!");
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
