package de.learnlib.weblearner.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.connectors.CounterStoreConnector;
import de.learnlib.weblearner.learner.connectors.MultiConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("incrementCounter")
@JsonTypeName("incrementCounter")
public class IncrementCounterAction extends SymbolAction {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        try {
            storeConnector.increment(project.getId(), name);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }

    }
}
