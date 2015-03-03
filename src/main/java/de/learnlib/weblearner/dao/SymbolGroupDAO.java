package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.SymbolGroup;

import javax.validation.ValidationException;
import java.util.List;
import java.util.NoSuchElementException;

public interface SymbolGroupDAO {

    void create(SymbolGroup group) throws ValidationException;

    List<SymbolGroup> getAll(long projectId) throws NoSuchElementException;

    SymbolGroup get(long projectId, Long groupId) throws NoSuchElementException;

    void update(SymbolGroup group) throws IllegalStateException, ValidationException;

    void delete(long projectId, Long groupId) throws IllegalArgumentException;

}
