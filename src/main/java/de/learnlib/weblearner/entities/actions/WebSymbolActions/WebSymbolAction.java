package de.learnlib.weblearner.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import de.learnlib.weblearner.utils.SearchHelper;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;

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

    @Transient
    private MultiConnector multiConnector;

    @Override
    public ExecuteResult execute(MultiConnector connector) {
        this.multiConnector = connector;
        return execute(connector.getConnector(WebSiteConnector.class));
    }

    protected abstract ExecuteResult execute(WebSiteConnector connector);

    protected String insertVariableValues(String text) {
        return SearchHelper.insertVariableValues(multiConnector, project.getId(), text);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "WebSymbolsAction[" + id + "] " + getClass().getName();
    }

}
