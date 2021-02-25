/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.entities.actions.misc.AssertCounterAction;
import de.learnlib.alex.data.entities.actions.misc.AssertVariableAction;
import de.learnlib.alex.data.entities.actions.misc.CreateLabelAction;
import de.learnlib.alex.data.entities.actions.misc.IncrementCounterAction;
import de.learnlib.alex.data.entities.actions.misc.JumpToLabelAction;
import de.learnlib.alex.data.entities.actions.misc.SetCounterAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByCookieAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByHTMLElementAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByHttpResponseAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByHttpStatusAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByJSONAttributeAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByNodeAttributeAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByNodeCountAction;
import de.learnlib.alex.data.entities.actions.misc.SetVariableByRegexGroupAction;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.data.entities.actions.rest.CallAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeExistsAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeTypeAction;
import de.learnlib.alex.data.entities.actions.rest.CheckAttributeValueAction;
import de.learnlib.alex.data.entities.actions.rest.CheckHeaderFieldAction;
import de.learnlib.alex.data.entities.actions.rest.CheckStatusAction;
import de.learnlib.alex.data.entities.actions.rest.CheckTextRestAction;
import de.learnlib.alex.data.entities.actions.rest.RESTSymbolAction;
import de.learnlib.alex.data.entities.actions.rest.ValidateJsonAction;
import de.learnlib.alex.data.entities.actions.web.AlertAcceptDismissAction;
import de.learnlib.alex.data.entities.actions.web.AlertGetTextAction;
import de.learnlib.alex.data.entities.actions.web.AlertSendKeysAction;
import de.learnlib.alex.data.entities.actions.web.BrowserAction;
import de.learnlib.alex.data.entities.actions.web.CheckNodeAction;
import de.learnlib.alex.data.entities.actions.web.CheckNodeAttributeValueAction;
import de.learnlib.alex.data.entities.actions.web.CheckNodeSelectedAction;
import de.learnlib.alex.data.entities.actions.web.CheckPageTitleAction;
import de.learnlib.alex.data.entities.actions.web.CheckTextWebAction;
import de.learnlib.alex.data.entities.actions.web.ClearAction;
import de.learnlib.alex.data.entities.actions.web.ClickAction;
import de.learnlib.alex.data.entities.actions.web.ClickElementByTextAction;
import de.learnlib.alex.data.entities.actions.web.ClickLinkAction;
import de.learnlib.alex.data.entities.actions.web.DragAndDropAction;
import de.learnlib.alex.data.entities.actions.web.DragAndDropByAction;
import de.learnlib.alex.data.entities.actions.web.ExecuteScriptAction;
import de.learnlib.alex.data.entities.actions.web.FillAction;
import de.learnlib.alex.data.entities.actions.web.GotoAction;
import de.learnlib.alex.data.entities.actions.web.MoveMouseAction;
import de.learnlib.alex.data.entities.actions.web.PressKeyAction;
import de.learnlib.alex.data.entities.actions.web.SelectAction;
import de.learnlib.alex.data.entities.actions.web.SubmitAction;
import de.learnlib.alex.data.entities.actions.web.SwitchToAction;
import de.learnlib.alex.data.entities.actions.web.SwitchToFrameAction;
import de.learnlib.alex.data.entities.actions.web.UploadFileAction;
import de.learnlib.alex.data.entities.actions.web.WaitForNodeAction;
import de.learnlib.alex.data.entities.actions.web.WaitForNodeAttributeAction;
import de.learnlib.alex.data.entities.actions.web.WaitForScriptAction;
import de.learnlib.alex.data.entities.actions.web.WaitForTextAction;
import de.learnlib.alex.data.entities.actions.web.WaitForTitleAction;
import de.learnlib.alex.data.entities.actions.web.WebSymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.Objects;

/**
 * Abstract super type of how a Action for Symbols should look & work like.
 */
@Entity
@Table(
        name = "ACTIONS",
        indexes = @Index(columnList = "symbolId")
)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "wait", value = WaitAction.class),
        // Counter & Variables
        @JsonSubTypes.Type(name = "assertCounter", value = AssertCounterAction.class),
        @JsonSubTypes.Type(name = "assertVariable", value = AssertVariableAction.class),
        @JsonSubTypes.Type(name = "incrementCounter", value = IncrementCounterAction.class),
        @JsonSubTypes.Type(name = "setCounter", value = SetCounterAction.class),
        @JsonSubTypes.Type(name = "setVariable", value = SetVariableAction.class),
        @JsonSubTypes.Type(name = "setVariableByJSON", value = SetVariableByJSONAttributeAction.class),
        @JsonSubTypes.Type(name = "setVariableByHttpResponse", value = SetVariableByHttpResponseAction.class),
        @JsonSubTypes.Type(name = "setVariableByHTML", value = SetVariableByHTMLElementAction.class),
        @JsonSubTypes.Type(name = "setVariableByCookie", value = SetVariableByCookieAction.class),
        @JsonSubTypes.Type(name = "setVariableByNodeAttribute", value = SetVariableByNodeAttributeAction.class),
        @JsonSubTypes.Type(name = "setVariableByNodeCount", value = SetVariableByNodeCountAction.class),
        @JsonSubTypes.Type(name = "setVariableByRegexGroup", value = SetVariableByRegexGroupAction.class),
        @JsonSubTypes.Type(name = "setVariableByHttpStatus", value = SetVariableByHttpStatusAction.class),
        @JsonSubTypes.Type(name = "createLabel", value = CreateLabelAction.class),
        @JsonSubTypes.Type(name = "jumpToLabel", value = JumpToLabelAction.class),
        // Web Actions
        @JsonSubTypes.Type(name = "web", value = WebSymbolAction.class),
        @JsonSubTypes.Type(name = "web_alertAcceptDismiss", value = AlertAcceptDismissAction.class),
        @JsonSubTypes.Type(name = "web_alertGetText", value = AlertGetTextAction.class),
        @JsonSubTypes.Type(name = "web_alertSendKeys", value = AlertSendKeysAction.class),
        @JsonSubTypes.Type(name = "web_browser", value = BrowserAction.class),
        @JsonSubTypes.Type(name = "web_checkNodeAttributeValue", value = CheckNodeAttributeValueAction.class),
        @JsonSubTypes.Type(name = "web_checkForNode", value = CheckNodeAction.class),
        @JsonSubTypes.Type(name = "web_checkForText", value = CheckTextWebAction.class),
        @JsonSubTypes.Type(name = "web_checkNodeSelected", value = CheckNodeSelectedAction.class),
        @JsonSubTypes.Type(name = "web_checkPageTitle", value = CheckPageTitleAction.class),
        @JsonSubTypes.Type(name = "web_clear", value = ClearAction.class),
        @JsonSubTypes.Type(name = "web_click", value = ClickAction.class),
        @JsonSubTypes.Type(name = "web_clickElementByText", value = ClickElementByTextAction.class),
        @JsonSubTypes.Type(name = "web_clickLinkByText", value = ClickLinkAction.class),
        @JsonSubTypes.Type(name = "web_dragAndDrop", value = DragAndDropAction.class),
        @JsonSubTypes.Type(name = "web_dragAndDropBy", value = DragAndDropByAction.class),
        @JsonSubTypes.Type(name = "web_executeScript", value = ExecuteScriptAction.class),
        @JsonSubTypes.Type(name = "web_fill", value = FillAction.class),
        @JsonSubTypes.Type(name = "web_goto", value = GotoAction.class),
        @JsonSubTypes.Type(name = "web_moveMouse", value = MoveMouseAction.class),
        @JsonSubTypes.Type(name = "web_pressKey", value = PressKeyAction.class),
        @JsonSubTypes.Type(name = "web_submit", value = SubmitAction.class),
        @JsonSubTypes.Type(name = "web_select", value = SelectAction.class),
        @JsonSubTypes.Type(name = "web_switchTo", value = SwitchToAction.class),
        @JsonSubTypes.Type(name = "web_switchToFrame", value = SwitchToFrameAction.class),
        @JsonSubTypes.Type(name = "web_uploadFile", value = UploadFileAction.class),
        @JsonSubTypes.Type(name = "web_waitForTitle", value = WaitForTitleAction.class),
        @JsonSubTypes.Type(name = "web_waitForNode", value = WaitForNodeAction.class),
        @JsonSubTypes.Type(name = "web_waitForNodeAttribute", value = WaitForNodeAttributeAction.class),
        @JsonSubTypes.Type(name = "web_waitForText", value = WaitForTextAction.class),
        @JsonSubTypes.Type(name = "web_waitForScript", value = WaitForScriptAction.class),
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    /** The symbol the action belongs to. */
    @ManyToOne
    @JoinColumn(name = "symbolId")
    @JsonIgnore
    protected Symbol symbol;

    /** The connections that the action can use. */
    @Transient
    @JsonIgnore
    private ConnectorManager connectorManager;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
     *         The context to use.
     * @return An {@link ExecuteResult} to indicate if the action run successfully or not.
     */
    protected abstract ExecuteResult execute(ConnectorManager connector);

    /**
     * Checks the given text for any occurrences of a variable and replaces this part with the actual value. The input
     * string will not be modified.
     *
     * @param text
     *         The text to check for variables, which than will be replaced by the real value.
     * @return The input string with all variables inserted.
     */
    protected final String insertVariableValues(String text) {
        return SearchHelper.insertVariableValues(connectorManager, symbol.getProjectId(), text);
    }

    /**
     * Get the proper return value for a successful action. This method checks the 'negated' field and should be used by
     * all actions if no failure / error occurred.
     *
     * @return OK if 'negated' is false; FALSE if 'negated' is true.
     */
    protected final ExecuteResult getSuccessOutput() {
        return new ExecuteResult(true);
    }

    /**
     * Get the proper return value for a failed action. This method checks the 'negated' field and should be used by all
     * actions if an failure / error occurred.
     *
     * @return FAILED if 'negated' is false; OK if 'negated' is true.
     */
    protected final ExecuteResult getFailedOutput() {
        return new ExecuteResult(false);
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SymbolAction)) return false;

        SymbolAction that = (SymbolAction) o;

        if (symbol != null ? !symbol.equals(that.symbol) : that.symbol != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getSymbol(), connectorManager);
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber|NeedBraces

}
