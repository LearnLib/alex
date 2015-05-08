package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.exceptions.NotFoundException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Symbols are handled.
 */
public interface SymbolDAO {

    /**
     * Save the given symbol.
     * 
     * @param symbol
     *            The symbol to save.
     * @throws ValidationException
     *             When the symbol was not valid.
     */
    void create(Symbol symbol) throws ValidationException;

    /**
     * Save the given symbols.
     *
     * @param symbols
     *            The symbols to save.
     * @throws ValidationException
     *             When one the symbols was not valid.
     *             In this case all symbols are reverted and not saved.
     */
    void create(List<Symbol> symbols) throws ValidationException;

    /**
     * Get a list of specific symbols of a project.
     *
     * @param projectId
     *            The project the symbols should belong to.
     * @param idRevPairs
     *            A list of pairs of an ID and revisions to specify the expected symbols.
     * @return A list of symbols matching the project and list of IDs and revisions.
     */
    List<Symbol> getAll(Long projectId, List<IdRevisionPair> idRevPairs) throws NotFoundException;

    List<Symbol> getAllWithLatestRevision(Long projectId, Long groupId) throws NotFoundException;

    List<Symbol> getAllWithLatestRevision(Long projectId, Long groupId, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException;

    /**
     * Get a list of symbols by their ids. Fetch only the latest revision of each.
     *
     * @param projectId
     *         The project the symbols should belong to.
     * @param ids
     *         The ids of the symbols you want to get.
     * @return A list of symbols. Can be empty.
     */
    List<Symbol> getByIdsWithLatestRevision(Long projectId, Long... ids) throws NotFoundException;

    /**
     * Get a list of symbols by their ids. Fetch only the latest revision of each.
     *
     * @param projectId
     *         The project the symbols should belong to.
     * @param visibilityLevel
     *         The visibility level that returned symbols should have.
     * @param ids
     *         The ids of the symbols you want to get.
     * @return A list of symbols. Can be empty.
     */
    List<Symbol> getByIdsWithLatestRevision(Long projectId, SymbolVisibilityLevel visibilityLevel, Long... ids)
            throws NotFoundException;

    /**
     * Get all symbols of a project.
     *
     * @param projectID
     *         The project the symbols should belong to.
     * @param visibilityLevel
     *         Include symbols that are currently marked as hidden?
     * @return A list of symbols belonging to the project.
     */
    List<Symbol> getAllWithLatestRevision(Long projectID, SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException;

    Symbol get(Long projectId, IdRevisionPair idRevisionPair) throws NotFoundException;

    /**
     * Get a specific symbol by its identifying parameters.
     * 
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param id
     *            The ID of the symbol itself in the project.
     * @param revision
     *            The wanted revision of the symbol.
     * @return The Symbol or null.
     */
    Symbol get(Long projectId, Long id, Long revision) throws NotFoundException;

    /**
     * Get a specific symbol by its identifying parameters and the last
     * revision.
     *
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param id
     *            The ID of the symbol itself in the project.
     * @return The Symbol or null.
     */
    Symbol getWithLatestRevision(Long projectId, Long id) throws NotFoundException;

    List<Symbol> getWithAllRevisions(Long projectId, Long id) throws NotFoundException;

    /**
     * Update a symbol.
     *
     * @param symbol
     *         The symbol to update.
     * @throws IllegalArgumentException
     *         If an old revision is used.
     * @throws NotFoundException
     *         When the Symbol was not found.
     * @throws ValidationException
     *         When the Symbol was not valid.
     */
    void update(Symbol symbol) throws IllegalArgumentException, NotFoundException, ValidationException;

    /**
     * Update a list of Symbols.
     *
     * @param symbols
     *         The symbol sto update.
     * @throws IllegalArgumentException
     *         If an old revision is used.
     * @throws NotFoundException
     *         When one of the Symbol was not found.
     * @throws ValidationException
     *         When one of the Symbol was not valid.
     */
    void update(List<Symbol> symbols) throws IllegalArgumentException, NotFoundException, ValidationException;

    void move(Symbol symbol, Long newGroupId) throws NotFoundException;

    void move(List<Symbol> symbols, Long newGroupId) throws NotFoundException;

    /**
     * Mark a symbol as hidden.
     * 
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param ids
     *            The IDs of the symbols to hide.
     * @throws NotFoundException
     *             When the Symbol was not found.
     */
    void hide(Long projectId, Long... ids) throws NotFoundException;

    /**
     * Revive a symbol from the hidden state.
     *
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param ids
     *            The ID of the symbols to show.
     * @throws NotFoundException
     *             When the Symbol was not found.
     */
    void show(Long projectId, Long... ids) throws NotFoundException;

}
