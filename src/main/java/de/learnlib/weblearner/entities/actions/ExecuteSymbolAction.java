package de.learnlib.weblearner.entities.actions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.connectors.MultiConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("executeSymbol")
@JsonTypeName("executeSymbol")
public class ExecuteSymbolAction extends SymbolAction {

    @ManyToOne
    @JsonIgnore
    private Symbol symbolToExecute;

    @JsonIgnore
    public Symbol getSymbolToExecute() {
        return symbolToExecute;
    }

    @JsonIgnore
    public void setSymbolToExecute(Symbol symbolToExecute) {
        this.symbolToExecute = symbolToExecute;
    }

    @JsonProperty("symbolToExecute")
    public Long getSymbolToExectuteId() {
        if (symbolToExecute == null) {
            return 0L;
        }

        return symbolToExecute.getId();
    }

    @JsonProperty("symbolToExecute")
    public void getSymbolToExectuteId(Long symbolId) {
        this.symbolToExecute = new Symbol();
        this.symbolToExecute.setId(symbolId);
    }

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        if (symbolToExecute == null) {
            //todo(alex.s): this is always true
            //System.err.println("ExecuteSymbolAction.execute: Symbol not found!");
            return getFailedOutput();
        }

        return ExecuteResult.valueOf(symbolToExecute.execute(connector));
    }
}
