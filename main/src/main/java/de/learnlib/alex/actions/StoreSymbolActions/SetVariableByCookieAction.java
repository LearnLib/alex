package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.ws.rs.core.NewCookie;
import java.util.Map;
import java.util.Set;

@Entity
@DiscriminatorValue("setVariableByCookie")
@JsonTypeName("setVariableByCookie")
public class SetVariableByCookieAction extends SetVariableAction {

    private enum CookieType {
        WEB, REST
    }

    /**
     * The type of the cookie. Either by selenium cookie or from a http request
     *
     * @requiredField
     */
    private CookieType cookieType;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            String value = null;

            if (cookieType == CookieType.WEB) {
                Set<Cookie> cookies = webSiteConnector.getDriver().manage().getCookies();

                for (Cookie c : cookies) {
                    if (c.getName().equals(getName())) {
                        value = c.getValue();
                        break;
                    }
                }
            } else if (cookieType == CookieType.REST) {
                Map<String, NewCookie> cookies = webServiceConnector.getCookies();

                for (Map.Entry<String, NewCookie> entry : cookies.entrySet()) {
                    if (entry.getKey().equals(getName())) {
                        value = entry.getValue().getValue();
                        break;
                    }
                }
            } else {
                return getFailedOutput();
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

    public CookieType getCookieType() {
        return cookieType;
    }

    public void setCookieType(CookieType t) {
        cookieType = t;
    }
}