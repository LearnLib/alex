package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.api.SULException;
import de.learnlib.weblearner.entities.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.weblearner.learner.MultiConnector;
import de.learnlib.weblearner.learner.WebServiceConnector;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import java.util.LinkedList;
import java.util.List;

/**
 * AbstractSymbol used to test a REST API.
 */
@Entity
@DiscriminatorValue("rest")
@JsonTypeName("rest")
public class RESTSymbol extends Symbol implements SymbolActionHandler<RESTSymbolAction> {

    /** to be serializable. */
    private static final long serialVersionUID = 7534219643367558281L;

    /** The actions to perform. */
    @OneToMany(fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @OrderBy("number ASC")
    protected List<RESTSymbolAction> actions;

    /** The actions handler. */
    @Transient
    @JsonIgnore
    private transient DefaultSymbolActionHandler<RESTSymbolAction, WebServiceConnector> actionHandler;

    /**
     * Default constructor.
     */
    public RESTSymbol() {
        this.actions = new LinkedList<>();
        this.actionHandler = new DefaultSymbolActionHandler<>(this, actions);
    }

    /**
     * Get the Actions related to the Symbol.
     *
     * @return The actions of this Symbol
     */
    public List<RESTSymbolAction> getActions() {
        return actions;
    }

    /**
     * Set a new List of Actions related to the Symbol.
     *
     * @param actions
     *         The new list of RESTActions
     */
    public void setActions(List<RESTSymbolAction> actions) {
        this.actions = actions;
    }

    /**
     * Add one action to the end of the Action List.
     *
     * @param action
     *         The SymbolAction to add.
     */
    public void addAction(RESTSymbolAction action) {
        actionHandler.addAction(action);
    }

    @Override
    public void loadLazyRelations() {
        resetSymbol = project.getResetSymbols().containsValue(this);
        actionHandler.loadLazyRelations();
    }

    @Override
    public void beforeSave() {
        actionHandler.beforeSave();
    }

    @Override
    public String execute(MultiConnector connector) throws SULException {
        return execute((WebServiceConnector) connector.getConnector(WebServiceConnector.class));
    }

    public String execute(WebServiceConnector connector) throws SULException {
        return actionHandler.execute(connector);
    }

}
