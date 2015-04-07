package de.learnlib.alex.actions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;

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
            return new IdRevisionPair(symbolToExecute);
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
    public ExecuteResult execute(ConnectorManager connector) {
        if (symbolToExecute == null) {
            System.err.println("ExecuteSymbolAction.execute: Symbol not found!"); //todo(alex.s): add proper logging or remove me
            return getFailedOutput();
        }

        ExecuteResult symbolResutl = ExecuteResult.valueOf(symbolToExecute.execute(connector));

        if (symbolResutl == ExecuteResult.OK) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }
}
