package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base for the different action a test could do.
 * This action layer is basically a wrapper around Selenium to be more OO and can be (de-)serialized in JSON.
 */
@Entity
@DiscriminatorValue("web")
@JsonTypeName("web")
public abstract class WebSymbolAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -1990239222213631726L;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        return execute(connector.getConnector(WebSiteConnector.class));
    }

    /**
     * Execute a Web action, i.e. an action that interacts with a web site over an browser.
     *
     * @param connector The connector to connect to web site (via Selenium).
     * @return An indicator of the action was executed successfully or not.
     */
    protected abstract ExecuteResult execute(WebSiteConnector connector);

    @Override
    public String toString() {
        return "WebSymbolsAction[" + id + "] " + getClass().getName();
    }

}
