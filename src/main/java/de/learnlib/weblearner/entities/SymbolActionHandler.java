package de.learnlib.weblearner.entities;

import java.util.List;

/**
 * Interface to describe how SymbolAction usually handled.
 *
 * @param <A>
 *         The Type of Action to handle.
 */
public interface SymbolActionHandler<A extends SymbolAction> {

    /**
     * Get the list of SymbolActions.
     *
     * @return The list of SymbolActions.
     */
    List<A> getActions();

    /**
     * Set the List of SymbolActions to new one.
     *
     * @param actions
     *         The new List of SymbolActions.
     */
    void setActions(List<A> actions);

    /**
     * Add a SymbolAction to the List.
     *
     * @param action
     *         The SymbolAction to add.
     * @throws IllegalArgumentException
     *         If the SymbolAction is invalid, e.g. equals null.
     */
    void addAction(A action) throws IllegalArgumentException;

    /**
     * Called shortly before the Symbol will be saved, so that e.g. relations could be updated.
     */
    void beforeSave();

    /**
     * The method loads all the lazy relations if they are needed.
     */
    void loadLazyRelations();

}
