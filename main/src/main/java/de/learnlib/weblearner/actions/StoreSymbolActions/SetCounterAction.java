package de.learnlib.weblearner.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.CounterStoreConnector;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("setCounter")
@JsonTypeName("setCounter")
public class SetCounterAction extends SymbolAction {

    private String name;

    private Integer counterValue;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return counterValue;
    }

    public void setValue(Integer value) {
        this.counterValue = value;
    }

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        try {
            storeConnector.set(name, counterValue);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }
    }
}
