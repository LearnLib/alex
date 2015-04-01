package de.learnlib.weblearner.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import javax.persistence.Transient;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Entity to hold the information and parameters to configure a learn process.
 */
@JsonPropertyOrder(alphabetic = true)
public class LearnerConfiguration extends LearnerResumeConfiguration implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5130245647384793948L;

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
     * The algorithm to be used during the learning.
     * @requiredField
     */
    private LearnAlgorithms algorithm;

    /**
     * Default constructor.
     */
    public LearnerConfiguration() {
        super();
        this.symbolsAsIdRevisionPairs = new LinkedList<>();
        this.algorithm = LearnAlgorithms.TTT;
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
     * Get the LearnerAlgorithm that should be used for the learning process.
     *
     * @return The selected LearnerAlgorithm.
     */
    @Transient
    public LearnAlgorithms getAlgorithm() {
        return algorithm;
    }

    /**
     * Set a new LearnerAlgorithm to use for the learning.
     *
     * @param algorithm
     *         The new algorithm to be used.
     */
    public void setAlgorithm(LearnAlgorithms algorithm) {
        this.algorithm = algorithm;
    }

    /**
     * Update the configuration based on the different parameters in the ResumeConfiguration.
     *
     * @param configuration
     *         Resume Configuration that specifies the new parameters for this Configuration
     */
    public void updateConfiguration(LearnerResumeConfiguration configuration) {
        this.maxAmountOfStepsToLearn = configuration.maxAmountOfStepsToLearn;
        this.eqOracle = configuration.eqOracle;
    }
}
