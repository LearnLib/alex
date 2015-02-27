package de.learnlib.weblearner.entities;

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
     * Link to the Symbols that are must be used during the learning.
     * @requiredField
     */
    private List<IdRevisionPair> symbols;

    /**
     * The algorithm to be used during the learning.
     * @requiredField
     */
    private LearnAlgorithms algorithm;

    private IdRevisionPair resetSymbol;

    /**
     * Default constructor.
     */
    public LearnerConfiguration() {
        super();
        this.symbols = new LinkedList<>();
        this.algorithm = LearnAlgorithms.EXTENSIBLE_LSTAR;
    }

    /**
     * Get a List of IdRevisionPairs that describes the symbols to be used during the learning process.
     *
     * @return A List of IdRevisionPair referring to symbols that must be used during the learning.
     */
    @Transient
    public List<IdRevisionPair> getSymbols() {
        return symbols;
    }

    /**
     * Set a List of IdRevisionPairs to find all the symbols that must be used during a learning process.
     *
     * @param symbols
     *         The List of IdRevisionPairs to refer to symbols that must be used during the learning.
     */
    @JsonProperty
    public void setSymbols(List<IdRevisionPair> symbols) {
        this.symbols = symbols;
    }

    /**
     * Get the LearnerAlgorithm that should be used for the learning process.
     * @return The selected LearnerAlgorithm.
     */
    @Transient
    public LearnAlgorithms getAlgorithm() {
        return algorithm;
    }

    /**
     * Set a new LearnerAlgorithm to use for the learning.
     * @param algorithm The new algorithm to be used.
     */
    public void setAlgorithm(LearnAlgorithms algorithm) {
        this.algorithm = algorithm;
    }

    public IdRevisionPair getResetSymbol() {
        return resetSymbol;
    }

    public void setResetSymbol(IdRevisionPair resetSymbol) {
        this.resetSymbol = resetSymbol;
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
