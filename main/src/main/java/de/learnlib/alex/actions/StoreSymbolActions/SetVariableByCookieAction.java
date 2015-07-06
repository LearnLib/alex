package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.ws.rs.core.NewCookie;
import java.util.Map;

@Entity
@DiscriminatorValue("setVariableByCookie")
@JsonTypeName("setVariableByCookie")
public class SetVariableByCookieAction extends SetVariableAction {

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);

        try {
            Map<String, NewCookie> cookies = webServiceConnector.getCookies();
            String value = null;

            for (Map.Entry<String, NewCookie> entry : cookies.entrySet()) {
                if (entry.getKey().equals(getName())) {
                    value = entry.getValue().getValue();
                    break;
                }
            }

            if (value != null) {
                storeConnector.set(getName(), value);
                return getSuccessOutput();
            } else {
                return getFailedOutput();
            }
        } catch (IllegalStateException | NoSuchElementException e) {
            return getFailedOutput();
        }
    }
}