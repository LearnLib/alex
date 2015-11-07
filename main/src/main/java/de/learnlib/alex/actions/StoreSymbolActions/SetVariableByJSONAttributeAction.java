package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.utils.JSONHelpers;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * Action to set a variable to a value received from an element of the current (JSON) body.
 */
@Entity
@DiscriminatorValue("setVariableByJSON")
@JsonTypeName("setVariableByJSON")
public class SetVariableByJSONAttributeAction extends SetVariableAction {

    /** Use the learner logger. */
    @Transient
    @JsonIgnore
    private static final Logger LOGGER = LogManager.getLogger("learner");

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);

        String body = webServiceConnector.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, value);

        if (valueInTheBody == null) {
            LOGGER.info("Could not set the variable '" + name + "' to the value of the "
                        + "JSON attribute '" + value + "' in the body '" + body + "' "
                        + "(ignoreFailure : " + ignoreFailure + ", negated: " + negated +").");
            return getFailedOutput();
        }

        storeConnector.set(name, valueInTheBody);
        return getSuccessOutput();
    }
}
