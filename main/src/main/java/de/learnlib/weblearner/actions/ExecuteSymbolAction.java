package de.learnlib.weblearner.actions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.IdRevisionPair;
import de.learnlib.weblearner.core.entities.Symbol;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

@Entity
@DiscriminatorValue("executeSymbol")
@JsonTypeName("executeSymbol")
public class ExecuteSymbolAction extends SymbolAction {

    @Transient
    @JsonProperty("symbolToExecute")
    private IdRevisionPair symbolToExecuteAsIdRevisionPair;

    @ManyToOne
    @JsonIgnore
    private Symbol symbolToExecute;

    public IdRevisionPair getSymbolToExecuteAsIdRevisionPair() {
        if (symbolToExecuteAsIdRevisionPair == null) {
            return new IdRevisionPair(symbol.getId(), symbol.getRevision());
        }
        return symbolToExecuteAsIdRevisionPair;
    }

    public void setSymbolToExecuteAsIdRevisionPair(IdRevisionPair symbolToExecuteAsIdRevisionPair) {
        this.symbolToExecuteAsIdRevisionPair = symbolToExecuteAsIdRevisionPair;
    }

    public Symbol getSymbolToExecute() {
        return symbolToExecute;
    }

    public void setSymbolToExecute(Symbol symbolToExecute) {
        this.symbolToExecute = symbolToExecute;
    }

    @JsonProperty("symbolToExecuteName")
    public String getSymbolToExecuteName() {
        if (symbolToExecute == null) {
            return "";
        }

        return symbolToExecute.getName();
    }

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        if (symbolToExecute == null) {
            System.err.println("ExecuteSymbolAction.execute: Symbol not found!"); //todo(alex.s): add proper logging or remove me
            return getFailedOutput();
        }

        return ExecuteResult.valueOf(symbolToExecute.execute(connector));
    }
}
