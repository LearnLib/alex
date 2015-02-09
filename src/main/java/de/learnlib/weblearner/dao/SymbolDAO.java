package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.IdRevisionPair;
import de.learnlib.weblearner.entities.Symbol;

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
    void create(Symbol<?> symbol) throws ValidationException;

    /**
     * Save the given symbols.
     *
     * @param symbols
     *            The symbols to save.
     * @throws ValidationException
     *             When one the symbols was not valid.
     *             In this case all symbols are reverted and not saved.
     */
    void create(List<Symbol<?>> symbols) throws ValidationException;

    /**
     * Get all symbols of a project.
     *
     * @param projectID
     *         The project the symbols should belong to.
     * @param withHidden
     *         Include symbols that are currently marked as deleted?
     * @return A list of symbols belonging to the project.
     */
    List<Symbol<?>> getAll(long projectID, boolean withHidden);

    /**
     * Get all symbols of a project which have a specific type.
     * 
     * @param projectId
     *            The project the symbols should belong to.
     * @param type
     *            The requested type for the symbols.
     * @param withHidden
     *         Include symbols that are currently marked as deleted?
     * @return A list of symbols matching the project and type.
     */
    List<Symbol<?>> getAll(long projectId, Class<? extends Symbol> type, boolean withHidden);

    /**
     * Get a list of specific symbols of a project.
     * 
     * @param projectId
     *            The project the symbols should belong to.
     * @param idRevPairs
     *            A list of pairs of an ID and revisions to specify the expected symbols.
     * @return A list of symbols matching the project and list of IDs and revisions.
     */
    List<Symbol<?>> get(long projectId, List<IdRevisionPair> idRevPairs);

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
    Symbol<?> get(long projectId, long id);

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
    Symbol<?> get(long projectId, long id, long revision);

    /**
     * Update a symbol.
     * 
     * @param symbol
     *            The symbol to update.
     * @throws IllegalArgumentException
     *             When the Symbol was not found.
     * @throws ValidationException
     *             When the Symbol was not valid.
     */
    void update(Symbol<?> symbol) throws IllegalArgumentException, ValidationException;

    /**
     * Mark a symbol as deleted.
     * 
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param id
     *            The ID of the symbol.
     * @throws IllegalArgumentException
     *             When the Symbol was not found.
     */
    void hide(long projectId, long id) throws IllegalArgumentException;

    /**
     * Revive a symbol from the deleted state.
     *
     * @param projectId
     *            The ID of the project the symbol belongs to.
     * @param id
     *            The ID of the symbol.
     * @throws IllegalArgumentException
     *             When the Symbol was not found.
     */
    void show(long projectId, long id) throws IllegalArgumentException;

}
