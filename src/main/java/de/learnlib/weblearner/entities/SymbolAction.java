package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.weblearner.entities.RESTSymbolActions.CallAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeExistsAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeTypeAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckAttributeValueAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckHeaderFieldAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckStatusAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.CheckTextRestAction;
import de.learnlib.weblearner.entities.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.DeclareCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.DeclareVariableAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.IncrementCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetCounterAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableByJSONAttributeAction;
import de.learnlib.weblearner.entities.StoreSymbolActions.SetVariableByNodeAction;
import de.learnlib.weblearner.entities.WebSymbolActions.CheckNodeAction;
import de.learnlib.weblearner.entities.WebSymbolActions.CheckTextWebAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClearAction;
import de.learnlib.weblearner.entities.WebSymbolActions.ClickAction;
import de.learnlib.weblearner.entities.WebSymbolActions.FillAction;
import de.learnlib.weblearner.entities.WebSymbolActions.GotoAction;
import de.learnlib.weblearner.entities.WebSymbolActions.SubmitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WaitAction;
import de.learnlib.weblearner.entities.WebSymbolActions.WebSymbolAction;
import de.learnlib.weblearner.learner.connectors.MultiConnector;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
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
        // Counter & Variables
        @JsonSubTypes.Type(name = "declareCounter", value = DeclareCounterAction.class),
        @JsonSubTypes.Type(name = "declareVariable", value = DeclareVariableAction.class),
        @JsonSubTypes.Type(name = "incrementCounter", value = IncrementCounterAction.class),
        @JsonSubTypes.Type(name = "setCounter", value = SetCounterAction.class),
        @JsonSubTypes.Type(name = "setVariable", value = SetVariableAction.class),
        @JsonSubTypes.Type(name = "setVariableByJSON", value = SetVariableByJSONAttributeAction.class),
        @JsonSubTypes.Type(name = "setVariableByHTML", value = SetVariableByNodeAction.class),
        // Web Actions
        @JsonSubTypes.Type(name = "web", value = WebSymbolAction.class),
        @JsonSubTypes.Type(name = "web_checkNode", value = CheckNodeAction.class),
        @JsonSubTypes.Type(name = "web_checkText", value = CheckTextWebAction.class),
        @JsonSubTypes.Type(name = "web_clear", value = ClearAction.class),
        @JsonSubTypes.Type(name = "web_click", value = ClickAction.class),
        @JsonSubTypes.Type(name = "web_fill", value = FillAction.class),
        @JsonSubTypes.Type(name = "web_goto", value = GotoAction.class),
        @JsonSubTypes.Type(name = "web_submit", value = SubmitAction.class),
        @JsonSubTypes.Type(name = "wait", value = WaitAction.class),
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
    protected long id;

    /** The position the action has in the actions list of the {@link Symbol}. */
    @JsonIgnore
    protected int number;

    /**
     * Get the ID of the Action used in the DB.
     *
     * @return The DB ID of the Action.
     */
    public long getId() {
        return id;
    }

    /**
     * Set the ID of the Action in the DB.
     *
     * @param id
     *            The DB ID of the Action.
     */
    public void setId(long id) {
        this.id = id;
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

    /**
     * Execute the Action. This is the important method in which all the magic will happen.
     *
     * @param connector
     *              The context to use.
     * @return An {@link ExecuteResult} to indicate if the action
     *          run successfully or not.
     */
    public abstract ExecuteResult execute(MultiConnector connector);
}
