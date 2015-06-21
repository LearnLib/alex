package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.exceptions.NotFoundException;

/**
 * Connector to store and manage counters.
 */
public class CounterStoreConnector implements Connector {

    /** The DAO to persist the counters to and fetch the counters from. */
    private CounterDAO counterDAO;

    /**
     * Default constructor.
     * Creates a new CounterDAO object.
     */
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

    @Override
    public void dispose() {
        // nothing to do here
    }

    public void set(Long projectId, String name, Integer value) {
        Counter counter;
        try {
            counter = counterDAO.get(projectId, name);
            counter.setValue(value);
            counterDAO.update(counter);
        } catch (NotFoundException e) {
            createCounter(projectId, name, value);
        }
    }

    public void reset(Long projectId, String name) {
        set(projectId, name, 0);
    }

    public void increment(Long projectId, String name) {
        Counter counter;
        try {
            counter = counterDAO.get(projectId, name);
            counter.setValue(counter.getValue() + 1);
            counterDAO.update(counter);
        } catch (NotFoundException e) {
            createCounter(projectId, name, 1);
        }
    }

    public Integer get(Long projectId, String name) throws IllegalStateException {
        try {
            Counter counter;
            counter = counterDAO.get(projectId, name);
            return counter.getValue();
        } catch (NotFoundException e) {
            throw new IllegalStateException("The counter '" + name + "' was not set and has no value!");
        }
    }

    void createCounter(Long projectId, String name, Integer value) {
        Counter counter = new Counter();
        counter.setProject(new Project(projectId));
        counter.setName(name);
        counter.setValue(value);
        counterDAO.create(counter);
    }

}
