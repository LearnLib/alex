package de.learnlib.weblearner.entities.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
import de.learnlib.weblearner.learner.connectors.VariableStoreConnector;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
import de.learnlib.weblearner.utils.JSONHelpers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("setVariableByJSON")
@JsonTypeName("setVariableByJSON")
public class SetVariableByJSONAttributeAction extends SetVariableAction {

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);

        String body = webServiceConnector.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, value);
        if (valueInTheBody == null) {
            return ExecuteResult.FAILED;
        }

        try {
            storeConnector.set(name, valueInTheBody);
            return ExecuteResult.OK;
        } catch (IllegalStateException e) {
            return ExecuteResult.FAILED;
        }
    }
}
