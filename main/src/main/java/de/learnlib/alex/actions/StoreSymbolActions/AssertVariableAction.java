package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to assert the equality of the content of a variable with a given string
 */
@Entity
@DiscriminatorValue("assertVariable")
@JsonTypeName("assertVariable")
public class AssertVariableAction extends SymbolAction {

    /**
     * The name of the variable to assert.
     */
    @NotBlank
    private String name;

    /**
     * The value to assert the variable content with.
     */
    @NotNull
    private String value;

    /**
     * Whether the value of the variable is matched against a regular expression
     */
    private boolean regexp;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        String variableValue = storeConnector.get(name);

        if (regexp) {
            if (variableValue.matches(value)) {
                return getSuccessOutput();
            } else {
                return getFailedOutput();
            }
        } else {
            if (variableValue.equals(value)) {
                return getSuccessOutput();
            } else {
                return getFailedOutput();
            }
        }
    }

    // auto generated getter & setter

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

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }
}
