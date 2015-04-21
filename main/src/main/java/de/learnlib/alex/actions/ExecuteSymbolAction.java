package de.learnlib.alex.actions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;


/**
 * Action to execute another symbol.
 */
@Entity
@DiscriminatorValue("executeSymbol")
@JsonTypeName("executeSymbol")
public class ExecuteSymbolAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 3143716533295082498L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /**
     * Reference to the Symbol that will be executed.
     * @requiredField
     */
    @Transient
    @JsonProperty("symbolToExecute")
    private IdRevisionPair symbolToExecuteAsIdRevisionPair;

    /**
     * The actual reference to the Symbol that will be executed.
     * Only used internally.
     */
    @ManyToOne
    @JsonIgnore
    private Symbol symbolToExecute;

    /**
     * Get the reference to the Symbol which will be executed.
     *
     * @return The reference as IdRevisionPair. Just add the project id ;)
     */
    public IdRevisionPair getSymbolToExecuteAsIdRevisionPair() {
        if (symbolToExecuteAsIdRevisionPair == null) {
            return new IdRevisionPair(symbolToExecute);
        }
        return symbolToExecuteAsIdRevisionPair;
    }

    /**
     * Set a new reference to the Symbol to execute.
     * This does not update the actual Symbol!
     *
     * @param symbolToExecuteAsIdRevisionPair
     *         The new IdRevisionPair of the Symbol to execute.
     */
    public void setSymbolToExecuteAsIdRevisionPair(IdRevisionPair symbolToExecuteAsIdRevisionPair) {
        this.symbolToExecuteAsIdRevisionPair = symbolToExecuteAsIdRevisionPair;
    }

    /**
     * Get the actual Symbol to execute.
     *
     * @return The Symbol which should be executed.
     */
    public Symbol getSymbolToExecute() {
        return symbolToExecute;
    }

    /**
     * Set a new Symbol to execute.
     * This does not update the reference (IdRevisionPair)!
     *
     * @param symbolToExecute The new Symbol which will be executed.
     */
    public void setSymbolToExecute(Symbol symbolToExecute) {
        this.symbolToExecute = symbolToExecute;
    }

    /**
     * Get the name of the Symbol to execute.
     * Readonly.
     *
     * @return The name of the Symbol to execute.
     */
    @JsonProperty("symbolToExecuteName")
    public String getSymbolToExecuteName() {
        if (symbolToExecute == null) {
            return "";
        }

        return symbolToExecute.getName();
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        if (symbolToExecute == null) {
            LOGGER.info("ExecuteSymbolAction.execute: Symbol not found!");
            return getFailedOutput();
        }

        ExecuteResult symbolResult = ExecuteResult.valueOf(symbolToExecute.execute(connector));

        if (symbolResult == ExecuteResult.OK) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }
}
