package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.utils.JSONHelpers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to set a variable to a value received from an element of the current (JSON) body.
 */
@Entity
@DiscriminatorValue("setVariableByJSON")
@JsonTypeName("setVariableByJSON")
public class SetVariableByJSONAttributeAction extends SetVariableAction {

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);

        String body = webServiceConnector.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, value);
        if (valueInTheBody == null) {
            return getFailedOutput();
        }

        try {
            storeConnector.set(name, valueInTheBody);
            return getSuccessOutput();
        } catch (IllegalStateException e) {
            return getFailedOutput();
        }
    }
}
