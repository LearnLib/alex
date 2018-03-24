/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeExistsAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeTypeAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeValueAction;
import de.learnlib.alex.data.entities.actions.rest.CheckHeaderFieldAction;
import de.learnlib.alex.data.entities.actions.rest.CheckStatusAction;
import de.learnlib.alex.data.entities.actions.rest.CheckTextRestAction;
import de.learnlib.alex.data.entities.actions.rest.RESTSymbolAction;
import de.learnlib.alex.data.entities.actions.rest.ValidateJsonAction;
import de.learnlib.alex.data.entities.actions.misc.AssertCounterAction;
import de.learnlib.alex.data.entities.actions.misc.AssertVariableAction;
import de.learnlib.alex.data.entities.actions.misc.IncrementCounterAction;
import de.learnlib.alex.data.entities.actions.misc.SetCounterAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByCookieAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByHTMLElementAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByJSONAttributeAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByNodeAttributeAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByNodeCountAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByRegexGroup;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.data.entities.actions.web.AlertAcceptDismissAction;
import de.learnlib.alex.data.entities.actions.web.AlertGetTextAction;
import de.learnlib.alex.data.entities.actions.web.AlertSendKeysAction;
import de.learnlib.alex.data.entities.actions.web.BrowserAction;
import de.learnlib.alex.data.entities.actions.web.CheckNodeAction;
import de.learnlib.alex.data.entities.actions.web.CheckNodeAttributeValueAction;
import de.learnlib.alex.data.entities.actions.web.CheckPageTitleAction;
import de.learnlib.alex.data.entities.actions.web.CheckTextWebAction;
import de.learnlib.alex.data.entities.actions.web.ClearAction;
import de.learnlib.alex.data.entities.actions.web.ClickAction;
import de.learnlib.alex.data.entities.actions.web.ClickLinkAction;
import de.learnlib.alex.data.entities.actions.web.ExecuteScriptAction;
import de.learnlib.alex.data.entities.actions.web.FillAction;
import de.learnlib.alex.data.entities.actions.web.GotoAction;
import de.learnlib.alex.data.entities.actions.web.MoveMouseAction;
import de.learnlib.alex.data.entities.actions.web.PressKeyAction;
import de.learnlib.alex.data.entities.actions.web.SelectAction;
import de.learnlib.alex.data.entities.actions.web.SubmitAction;
import de.learnlib.alex.data.entities.actions.web.SwitchTo;
import de.learnlib.alex.data.entities.actions.web.SwitchToFrame;
import de.learnlib.alex.data.entities.actions.web.WaitForNodeAction;
import de.learnlib.alex.data.entities.actions.web.WaitForNodeAttributeAction;
import de.learnlib.alex.data.entities.actions.web.WaitForTextAction;
import de.learnlib.alex.data.entities.actions.web.WaitForTitleAction;
import de.learnlib.alex.data.entities.actions.web.WebSymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.UUID;

/**
 * Abstract super type of how a Action for Symbols should look & work like.
 */
@Entity
@Table(
        name = "ACTIONS",
        indexes = @Index(columnList = "symbolId, number")
)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
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
        @JsonSubTypes.Type(name = "setVariableByNodeCount", value = SetVariableByNodeCountAction.class),
        @JsonSubTypes.Type(name = "setVariableByRegexGroup", value = SetVariableByRegexGroup.class),
        // Web Actions
        @JsonSubTypes.Type(name = "web", value = WebSymbolAction.class),
        @JsonSubTypes.Type(name = "web_alertAcceptDismiss", value = AlertAcceptDismissAction.class),
        @JsonSubTypes.Type(name = "web_alertGetText", value = AlertGetTextAction.class),
        @JsonSubTypes.Type(name = "web_alertSendKeys", value = AlertSendKeysAction.class),
        @JsonSubTypes.Type(name = "web_browser", value = BrowserAction.class),
        @JsonSubTypes.Type(name = "web_checkNodeAttributeValue", value = CheckNodeAttributeValueAction.class),
        @JsonSubTypes.Type(name = "web_checkForNode", value = CheckNodeAction.class),
        @JsonSubTypes.Type(name = "web_checkForText", value = CheckTextWebAction.class),
        @JsonSubTypes.Type(name = "web_checkPageTitle", value = CheckPageTitleAction.class),
        @JsonSubTypes.Type(name = "web_clear", value = ClearAction.class),
        @JsonSubTypes.Type(name = "web_click", value = ClickAction.class),
        @JsonSubTypes.Type(name = "web_clickLinkByText", value = ClickLinkAction.class),
        @JsonSubTypes.Type(name = "web_executeScript", value = ExecuteScriptAction.class),
        @JsonSubTypes.Type(name = "web_fill", value = FillAction.class),
        @JsonSubTypes.Type(name = "web_goto", value = GotoAction.class),
        @JsonSubTypes.Type(name = "web_moveMouse", value = MoveMouseAction.class),
        @JsonSubTypes.Type(name = "web_pressKey", value = PressKeyAction.class),
        @JsonSubTypes.Type(name = "web_submit", value = SubmitAction.class),
        @JsonSubTypes.Type(name = "web_select", value = SelectAction.class),
        @JsonSubTypes.Type(name = "web_switchTo", value = SwitchTo.class),
        @JsonSubTypes.Type(name = "web_switchToFrame", value = SwitchToFrame.class),
        @JsonSubTypes.Type(name = "web_waitForTitle", value = WaitForTitleAction.class),
        @JsonSubTypes.Type(name = "web_waitForNode", value = WaitForNodeAction.class),
        @JsonSubTypes.Type(name = "web_waitForNodeAttribute", value = WaitForNodeAttributeAction.class),
        @JsonSubTypes.Type(name = "web_waitForText", value = WaitForTextAction.class),
        // REST Actions
        @JsonSubTypes.Type(name = "rest", value = RESTSymbolAction.class),
        @JsonSubTypes.Type(name = "rest_call", value = CallAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeExists", value = CheckAttributeExistsAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeType", value = CheckAttributeTypeAction.class),
        @JsonSubTypes.Type(name = "rest_checkAttributeValue", value = CheckAttributeValueAction.class),
        @JsonSubTypes.Type(name = "rest_checkForText", value = CheckTextRestAction.class),
        @JsonSubTypes.Type(name = "rest_checkHeaderField", value = CheckHeaderFieldAction.class),
        @JsonSubTypes.Type(name = "rest_checkStatus", value = CheckStatusAction.class),
        @JsonSubTypes.Type(name = "rest_validateJson", value = ValidateJsonAction.class),
})
public abstract class SymbolAction implements Serializable {

    /** The ID of the Action in the DB. */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @JsonIgnore
    protected UUID uuid;

    /** The symbol the action belongs to. */
    @ManyToOne
    @JoinColumn(name = "symbolId")
    @JsonIgnore
    protected Symbol symbol;

    /** The position the action has in the actions list of the Symbol. */
    @GeneratedValue(generator = "symbol_action_number_generator")
    @GenericGenerator(
            name = "symbol_action_number_generator",
            strategy = "de.learnlib.alex.core.entities.validators.SymbolActionNumberGenerator")
    @JsonIgnore
    protected int number;

    /** Should the action be executed or skipped? */
    protected boolean disabled;

    /** Negate the outcome of the action? */
    protected boolean negated;

    /** Ignore if the execution of the action failed? */
    protected boolean ignoreFailure;

    /** The custom output if the execution of this action fails. */
    protected String errorOutput;

    /** The connections that the action can use. */
    @Transient
    @JsonIgnore
    private ConnectorManager connectorManager;

    /**
     * Get the ID of the Action used in the DB.
     *
     * @return The DB ID of the Action.
     */
    public UUID getUUID() {
        return uuid;
    }

    /**
     * Set the ID of the Action in the DB.
     *
     * @param uuid
     *            The DB ID of the Action.
     */
    public void setUUID(UUID uuid) {
        this.uuid = uuid;
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

    public String getErrorOutput() {
        return errorOutput;
    }

    public void setErrorOutput(String errorOutput) {
        this.errorOutput = errorOutput;
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
        return SearchHelper.insertVariableValues(connectorManager, symbol.getProjectId(), text);
    }

    /**
     * Get the proper return value for a successful action.
     * This method checks the 'negated' field and should be used by all actions if no failure / error occurred.
     *
     * @return OK if 'negated' is false; FALSE if 'negated' is true.
     */
    protected final ExecuteResult getSuccessOutput() {
        return negated ? new ExecuteResult(false, errorOutput) : new ExecuteResult(true);
    }

    /**
     * Get the proper return value for a failed action.
     * This method checks the 'negated' field and should be used by all actions if an failure / error occurred.
     *
     * @return FAILED if 'negated' is false; OK if 'negated' is true.
     */
    protected final ExecuteResult getFailedOutput() {
        return negated ? new ExecuteResult(true) : new ExecuteResult(false, errorOutput);
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SymbolAction)) return false;

        SymbolAction that = (SymbolAction) o;

        if (number != that.number) return false;
        if (symbol != null ? !symbol.equals(that.symbol) : that.symbol != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = symbol != null ? symbol.hashCode() : 0;
        result = 31 * result + number;
        return result;
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber|NeedBraces

}
