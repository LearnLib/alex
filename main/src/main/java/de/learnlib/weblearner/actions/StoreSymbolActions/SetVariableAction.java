package de.learnlib.weblearner.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;
import de.learnlib.weblearner.core.learner.connectors.VariableStoreConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("setVariable")
@JsonTypeName("setVariable")
public class SetVariableAction extends SymbolAction {

    protected String name;

    protected String value;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        try {
            storeConnector.set(name, value);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }
    }
}
