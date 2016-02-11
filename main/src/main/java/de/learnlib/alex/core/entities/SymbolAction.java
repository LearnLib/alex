/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.alex.actions.ExecuteSymbolAction;
import de.learnlib.alex.actions.RESTSymbolActions.CallAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckAttributeExistsAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckAttributeTypeAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckAttributeValueAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckHeaderFieldAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckStatusAction;
import de.learnlib.alex.actions.RESTSymbolActions.CheckTextRestAction;
import de.learnlib.alex.actions.RESTSymbolActions.RESTSymbolAction;
import de.learnlib.alex.actions.StoreSymbolActions.AssertCounterAction;
import de.learnlib.alex.actions.StoreSymbolActions.AssertVariableAction;
import de.learnlib.alex.actions.StoreSymbolActions.IncrementCounterAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetCounterAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetVariableAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetVariableByCookieAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetVariableByHTMLElementAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetVariableByJSONAttributeAction;
import de.learnlib.alex.actions.StoreSymbolActions.SetVariableByNodeAttributeAction;
import de.learnlib.alex.actions.WaitAction;
import de.learnlib.alex.actions.WebSymbolActions.CheckNodeAction;
import de.learnlib.alex.actions.WebSymbolActions.CheckPageTitleAction;
import de.learnlib.alex.actions.WebSymbolActions.CheckTextWebAction;
import de.learnlib.alex.actions.WebSymbolActions.ClearAction;
import de.learnlib.alex.actions.WebSymbolActions.ClickAction;
import de.learnlib.alex.actions.WebSymbolActions.ClickLinkAction;
import de.learnlib.alex.actions.WebSymbolActions.FillAction;
import de.learnlib.alex.actions.WebSymbolActions.GotoAction;
import de.learnlib.alex.actions.WebSymbolActions.SelectAction;
import de.learnlib.alex.actions.WebSymbolActions.SubmitAction;
import de.learnlib.alex.actions.WebSymbolActions.WaitForNodeAction;
import de.learnlib.alex.actions.WebSymbolActions.WaitForTitleAction;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.utils.SearchHelper;
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
import javax.persistence.Transient;
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
        @JsonSubTypes.Type(name = "assertCounter", value = AssertCounterAction.class),
        @JsonSubTypes.Type(name = "assertVariable", value = AssertVariableAction.class),
        @JsonSubTypes.Type(name = "incrementCounter", value = IncrementCounterAction.class),
        @JsonSubTypes.Type(name = "setCounter", value = SetCounterAction.class),
        @JsonSubTypes.Type(name = "setVariable", value = SetVariableAction.class),
        @JsonSubTypes.Type(name = "setVariableByJSON", value = SetVariableByJSONAttributeAction.class),
        @JsonSubTypes.Type(name = "setVariableByHTML", value = SetVariableByHTMLElementAction.class),
        @JsonSubTypes.Type(name = "setVariableByCookie", value = SetVariableByCookieAction.class),
        @JsonSubTypes.Type(name = "setVariableByNodeAttribute", value = SetVariableByNodeAttributeAction.class),
        // Web Actions
        @JsonSubTypes.Type(name = "web", value = WebSymbolAction.class),
        @JsonSubTypes.Type(name = "web_checkForNode", value = CheckNodeAction.class),
        @JsonSubTypes.Type(name = "web_checkForText", value = CheckTextWebAction.class),
        @JsonSubTypes.Type(name = "web_checkPageTitle", value = CheckPageTitleAction.class),
        @JsonSubTypes.Type(name = "web_clear", value = ClearAction.class),
        @JsonSubTypes.Type(name = "web_click", value = ClickAction.class),
        @JsonSubTypes.Type(name = "web_clickLinkByText", value = ClickLinkAction.class),
        @JsonSubTypes.Type(name = "web_fill", value = FillAction.class),
        @JsonSubTypes.Type(name = "web_goto", value = GotoAction.class),
        @JsonSubTypes.Type(name = "web_submit", value = SubmitAction.class),
        @JsonSubTypes.Type(name = "web_select", value = SelectAction.class),
        @JsonSubTypes.Type(name = "web_waitForTitle", value = WaitForTitleAction.class),
        @JsonSubTypes.Type(name = "web_waitForNode", value = WaitForNodeAction.class),
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

    /** The user the actions belongs to. */
    @NaturalId
    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonIgnore
    protected User user;

    /** The project the actions belongs to. */
    @NaturalId
    @ManyToOne
    @JoinColumn(name = "projectId")
    @JsonIgnore
    protected Project project;

    /** The symbol the action belongs to. */
    @NaturalId
    @ManyToOne
    @JoinColumn(name = "symbolId")
    @JsonIgnore
    protected Symbol symbol;

    /** The position the action has in the actions list of the Symbol. */
    @NaturalId
    @JsonIgnore
    protected int number;

    /** Should the action be executed or skipped? */
    protected boolean disabled;

    /** Negate the outcome of the action? */
    protected boolean negated;

    /** Ignore if the execution of the action failed? */
    protected boolean ignoreFailure;

    /** The connections that the action can use. */
    @Transient
    @JsonIgnore
    private ConnectorManager connectorManager;

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

    /**
     * The user of the action.
     *
     * @return The related user.
     */
    public User getUser() {
        return user;
    }

    /**
     * Set a new user as 'parent' of teh action.
     *
     * @param user
     *         The new related user.
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Get the project of the action.
     *
     * @return The related project.
     */
    public Project getProject() {
        return project;
    }

    /**
     * Set a new project as 'parent' of the action.
     *
     * @param project
     *         The new related project.
     */
    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the symbol the action is part of.
     *
     * @return The 'parent' symbol.
     */
    public Symbol getSymbol() {
        return symbol;
    }

    /**
     * Set a new symbol as 'parent' of the action.
     *
     * @param symbol
     *         The new related symbol.
     */
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

    /**
     * Should the result of the execute method be inverted?
     * @return true, if the outcome should be negated; false otherwise.
     */
    public boolean isNegated() {
        return negated;
    }

    /**
     * Set the negated flag, i.e. if the outcome of the execute method will be inverted.
     *
     * @param negated
     *         true, if the outcome should be inverted.
     */
    public void setNegated(boolean negated) {
        this.negated = negated;
    }

    /**
     * Usually the sequential execution of action will be interrupted if an action returns FAILED.
     * With this property this behaviour can be overwritten.
     *
     * @return true if the following action should be executed, even if the action FAILED; false otherwise.
     */
    public boolean isIgnoreFailure() {
        return ignoreFailure;
    }

    /**
     * Set the ignore failure flag, i.e. even if the action FAILED following actions will be executed.
     *
     * @param ignoreFailure
     *         true, if the following action should be executed; false otherwise.
     */
    public void setIgnoreFailure(boolean ignoreFailure) {
        this.ignoreFailure = ignoreFailure;
    }

    /**
     * As a default, an action is executed when the learner calls a symbols. If this method returns false, the learner
     * skips the execution of the action and executes the following
     *
     * @return true if the action should be executed, false if should be skipped
     */
    public boolean isDisabled() {
        return disabled;
    }

    /**
     * Set the enable flag, i.e. if the execution of the action should be skipped
     *
     * @param disabled
     *          true if the action should be executed, false if should be skipped
     */
    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    /**
     * Execute the action.
     *
     * @param connectors
     *         The connectors that can be used.
     * @return OK or FAILED.
     */
    public ExecuteResult executeAction(ConnectorManager connectors) {
        this.connectorManager = connectors;
        return execute(connectors);
    }

    /**
     * Execute the Action. This is the important method in which all the magic will happen.
     *
     * @param connector
     *              The context to use.
     * @return An {@link ExecuteResult} to indicate if the action
     *          run successfully or not.
     */
    protected abstract ExecuteResult execute(ConnectorManager connector);

    /**
     * Checks the given text for any occurrences of a variable and replaces this part with the actual value.
     * The input string will not be modified.
     *
     * @param text
     *         The text to check for variables, which than will be replaced by the real value.
     * @return The input string with all variables inserted.
     */
    protected final String insertVariableValues(String text) {
        return SearchHelper.insertVariableValues(connectorManager, user.getId(), project.getId(), text);
    }

    /**
     * Get the proper return value for a successful action.
     * This method checks the 'negated' field and should be used by all actions if no failure / error occurred.
     *
     * @return OK if 'negated' is false; FALSE if 'negated' is true.
     */
    protected final ExecuteResult getSuccessOutput() {
        if (negated) {
            return ExecuteResult.FAILED;
        } else {
            return ExecuteResult.OK;
        }
    }

    /**
     * Get the proper return value for a failed action.
     * This method checks the 'negated' field and should be used by all actions if an failure / error occurred.
     *
     * @return FAILED if 'negated' is false; OK if 'negated' is true.
     */
    protected final ExecuteResult getFailedOutput() {
        if (negated) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ
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
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber|NeedBraces


}
