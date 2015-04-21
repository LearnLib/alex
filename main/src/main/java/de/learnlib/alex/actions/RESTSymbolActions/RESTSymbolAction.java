package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base class for all the REST specific actions.
 */
@Entity
@DiscriminatorValue("rest")
@JsonTypeName("rest")
public abstract class RESTSymbolAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -897337751104947135L;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        return execute(connector.getConnector(WebServiceConnector.class));
    }

    /**
     * Execute a REST action, i.e. a action that interacts with an web service interface.
     *
     * @param connector
     *         The connector to connect to web services.
     * @return An indicator of the action was executed successfully or not.
     */
    protected abstract ExecuteResult execute(WebServiceConnector connector);

}
