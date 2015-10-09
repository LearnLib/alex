package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to set a counter to a specific value.
 */
@Entity
@DiscriminatorValue("setCounter")
@JsonTypeName("setCounter")
public class SetCounterAction extends SymbolAction {

    /** The name of the counter to set a new value to. */
    @NotBlank
    private String name;

    /** The new value. */
    @NotNull
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
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        try {
            storeConnector.set(getUser().getId(), project.getId(), name, counterValue);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }
    }
}
