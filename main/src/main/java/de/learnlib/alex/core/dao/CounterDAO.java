package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import org.jvnet.hk2.annotations.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public interface CounterDAO {

    void create(Counter counter);

    List<Counter> getAll(Long projectId);

    Counter get(Long projectId, String name) throws NoSuchElementException;

    void update(Counter counter) throws NoSuchElementException;

    void delete(Long projectId, String name) throws NoSuchElementException;

}
