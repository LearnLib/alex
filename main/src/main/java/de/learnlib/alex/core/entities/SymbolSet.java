package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Transient;
import java.util.List;

public class SymbolSet {

    /**
     * Link to the Symbols that should be used as a reset Symbol.
     * @requiredField
     */
    @Transient
    @JsonProperty("resetSymbol")
    private IdRevisionPair resetSymbolAsIdRevisionPair;

    /**
     * The actual Symbols that should be used as a reset Symbol.
     * Only used internally.
     */
    @Transient
    @JsonIgnore
    private Symbol resetSymbol;

    /**
     * Link to the Symbols that are used during the learning.
     * @requiredField
     */
    @Transient
    @JsonProperty("symbols")
    private List<IdRevisionPair> symbolsAsIdRevisionPairs;

    /**
     * The actual list of Symbols used during the learning.
     * Only used internally.
     */
    @Transient
    @JsonIgnore
    private List<Symbol> symbols;

    /**
     * Get the IdRevisionPair of the reset symbol.
     *
     * @return The link to the reset symbol.
     */
    public IdRevisionPair getResetSymbolAsIdRevisionPair() {
        return resetSymbolAsIdRevisionPair;
    }

    /**
     * Set the IdRevisionPair of the reset symbol. This updates not the reset symbol itself.
     *
     * @param resetSymbolAsIdRevisionPair
     *         The new pair of the reset symbol.
     */
    public void setResetSymbolAsIdRevisionPair(IdRevisionPair resetSymbolAsIdRevisionPair) {
        this.resetSymbolAsIdRevisionPair = resetSymbolAsIdRevisionPair;
    }

    /**
     * Get the actual reset symbol.
     *
     * @return The reset symbol.
     */
    public Symbol getResetSymbol() {
        return resetSymbol;
    }

    /**
     * Set the reset symbol. This updates not the IdRevisionPair of the reset symbol.
     * @param resetSymbol The new reset symbol.
     */
    public void setResetSymbol(Symbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    /**
     * Get a List of IdRevisionPairs that describes the symbols to be used during the learning process.
     *
     * @return A List of IdRevisionPair referring to symbols that must be used during the learning.
     */
    public List<IdRevisionPair> getSymbolsAsIdRevisionPairs() {
        return symbolsAsIdRevisionPairs;
    }

    /**
     * Set a List of IdRevisionPairs to find all the symbols that must be used during a learning process.
     *
     * @param symbolsAsIdRevisionPairs
     *         The List of IdRevisionPairs to refer to symbols that must be used during the learning.
     */
    public void setSymbolsAsIdRevisionPairs(List<IdRevisionPair> symbolsAsIdRevisionPairs) {
        this.symbolsAsIdRevisionPairs = symbolsAsIdRevisionPairs;
    }

    /**
     * Get the list of Symbols that must be used for the learning process.
     *
     * @return The list of Symbols.
     */
    public List<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * Set a list of symbols to be used for the learning process.
     *
     * @param symbols
     *         The new list of Symbols.
     */
    public void setSymbols(List<Symbol> symbols) {
        this.symbols = symbols;
    }

}
