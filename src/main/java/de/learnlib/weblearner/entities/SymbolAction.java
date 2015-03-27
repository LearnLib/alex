package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.weblearner.entities.actions.ExecuteSymbolAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckAttributeExistsAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckAttributeTypeAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckAttributeValueAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckHeaderFieldAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckStatusAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.CheckTextRestAction;
import de.learnlib.weblearner.entities.actions.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.weblearner.entities.actions.StoreSymbolActions.IncrementCounterAction;
import de.learnlib.weblearner.entities.actions.StoreSymbolActions.SetCounterAction;
import de.learnlib.weblearner.entities.actions.StoreSymbolActions.SetVariableAction;
import de.learnlib.weblearner.entities.actions.StoreSymbolActions.SetVariableByHTMLElementAction;
import de.learnlib.weblearner.entities.actions.StoreSymbolActions.SetVariableByJSONAttributeAction;
import de.learnlib.weblearner.entities.actions.WaitAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.CheckNodeAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.CheckTextWebAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.ClearAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.ClickAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.FillAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.SelectAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.SubmitAction;
import de.learnlib.weblearner.entities.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
import org.hibernate.annotations.NaturalId;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Abstract super type of how a Action for Symbols should look & work like.
 */
@Entity
@Table(name = "ACTIONS")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "executeSymbol", value = ExecuteSymbolAction.class),
        @JsonSubTypes.Type(name = "wait", value = WaitAction.class),
        // Counter & Variables
        @JsonSubTypes.Type(name = "incrementCounter", value = IncrementCounterAction.class),
        @JsonSubTypes.Type(name = "setCounter", value = SetCounterAction.class),
        @JsonSubTypes.Type(name = "setVariable", value = SetVariableAction.class),
        @JsonSubTypes.Type(name = "setVariableByJSON", value = SetVariableByJSONAttributeAction.class),
        @JsonSubTypes.Type(name = "setVariableByHTML", value = SetVariableByHTMLElementAction.class),
        // Web Actions
        @JsonSubTypes.Type(name = "web", value = WebSymbolAction.class),
        @JsonSubTypes.Type(name = "web_checkForNode", value = CheckNodeAction.class),
        @JsonSubTypes.Type(name = "web_checkForText", value = CheckTextWebAction.class),
        @JsonSubTypes.Type(name = "web_clear", value = ClearAction.class),
        @JsonSubTypes.Type(name = "web_click", value = ClickAction.class),
        @JsonSubTypes.Type(name = "web_fill", value = FillAction.class),
        @JsonSubTypes.Type(name = "web_goto", value = GotoAction.class),
        @JsonSubTypes.Type(name = "web_submit", value = SubmitAction.class),
        @JsonSubTypes.Type(name = "web_select", value = SelectAction.class),
        // REST Actions
        @JsonSubTypes.Type(name = "rest", value = RESTSymbolAction.class),
        @JsonSubTypes.Type(name = "rest_call", value = CallAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeExists", value = CheckAttributeExistsAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeType", value = CheckAttributeTypeAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeValue", value = CheckAttributeValueAction.class),
        @JsonSubTypes.Type(name = "rest_checkForText", value = CheckTextRestAction.class),
        @JsonSubTypes.Type(name = "rest_checkHeaderField", value = CheckHeaderFieldAction.class),
        @JsonSubTypes.Type(name = "rest_checkStatus", value = CheckStatusAction.class),
})
public abstract class SymbolAction implements Serializable {

    /** The ID of the Action in the DB. */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    protected Long id;

    @NaturalId
    @ManyToOne
    @JoinColumn(name = "projectId")
    @JsonIgnore
    protected Project project;

    @NaturalId
    @ManyToOne
    @JoinColumn(name = "symbolId")
    @JsonIgnore
    protected Symbol symbol;

    /** The position the action has in the actions list of the Symbol. */
    @NaturalId
    @JsonIgnore
    protected int number;

    protected boolean negated;

    protected boolean ignoreFailure;

    /**
     * Get the ID of the Action used in the DB.
     *
     * @return The DB ID of the Action.
     */
    public Long getId() {
        return id;
    }

    /**
     * Set the ID of the Action in the DB.
     *
     * @param id
     *            The DB ID of the Action.
     */
    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Symbol getSymbol() {
        return symbol;
    }

    public void setSymbol(Symbol symbol) {
        this.symbol = symbol;
    }

    /**
     * Get the position the action has in the actions list of the {@link Symbol}.
     *
     * @return The position of the action in the list.
     */
    public int getNumber() {
        return number;
    }

    /**
     * Set the position the action has in the actions list.
     *
     * @param no The new position.
     */
    public void setNumber(int no) {
        this.number = no;
    }

    public boolean isNegated() {
        return negated;
    }

    public void setNegated(boolean negated) {
        this.negated = negated;
    }

    public boolean isIgnoreFailure() {
        return ignoreFailure;
    }

    public void setIgnoreFailure(boolean ignoreFailure) {
        this.ignoreFailure = ignoreFailure;
    }

    /**
     * Execute the Action. This is the important method in which all the magic will happen.
     *
     * @param connector
     *              The context to use.
     * @return An {@link ExecuteResult} to indicate if the action
     *          run successfully or not.
     */
    public abstract ExecuteResult execute(MultiConnector connector);

    protected ExecuteResult getSuccessOutput() {
        if (negated) {
            return ExecuteResult.FAILED;
        } else {
            return ExecuteResult.OK;
        }
    }

    protected ExecuteResult getFailedOutput() {
        if (negated) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber - auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SymbolAction)) return false;

        SymbolAction that = (SymbolAction) o;

        if (number != that.number) return false;
        if (project != null ? !project.equals(that.project) : that.project != null) return false;
        if (symbol != null ? !symbol.equals(that.symbol) : that.symbol != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = project != null ? project.hashCode() : 0;
        result = 31 * result + (symbol != null ? symbol.hashCode() : 0);
        result = 31 * result + number;
        return result;
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber


}
