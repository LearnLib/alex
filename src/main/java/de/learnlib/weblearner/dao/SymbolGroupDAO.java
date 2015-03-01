package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.SymbolGroup;

import javax.validation.ValidationException;
import java.util.List;

public interface SymbolGroupDAO {

    void create(SymbolGroup group) throws ValidationException;

    List<SymbolGroup> getAll(long projectId);

    SymbolGroup get(long projectId, Long groupId);

    void update(SymbolGroup group) throws IllegalArgumentException, ValidationException;

    void delete(long projectId, Long groupId) throws IllegalArgumentException;

}
