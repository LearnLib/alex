package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Increment a counter by 1.
 */
@Entity
@DiscriminatorValue("incrementCounter")
@JsonTypeName("incrementCounter")
public class IncrementCounterAction extends SymbolAction {

    /** The name of the counter to increment. */
    @NotBlank
    private String name;

    /**
     * Get the name of the counter.
     *
     * @return The counter name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set a new counter by its name.
     *
     * @param name
     *         The new name of the counter to use.
     */
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        CounterStoreConnector storeConnector = connector.getConnector(CounterStoreConnector.class);
        try {
            storeConnector.increment(user.getId(), project.getId(), name);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }

    }
}
