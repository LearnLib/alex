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

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.LoggerUtil;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

/**
 * Representation of a symbol for the learning process.
 * A Symbol is one unit which will be executed and it is made of a sequence of actions.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"userId", "projectId", "id"},
                        name = "Unique ID per user & project")
        }
)
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    private static final long serialVersionUID = 7987585761829495962L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The ID of the Symbol in the DB. */
    private Long symbolId;

    /** The id of the symbol in the project. */
    private Long id;

    /** The User that owns the Symbol. */
    private User user;

    /** The ID of the User to be used in the JSON. */
    private Long userId;

    /** The Project the Symbol belongs to. */
    private Project project;

    /** The ID of the Project to be used in the JSON. */
    private Long projectId;

    /** The group the symbol belongs to. */
    private SymbolGroup group;

    /** The ID of the Group to be used in the JSON. */
    private Long groupId;

    /** The name of the symbol. */
    private String name;

    /**
     * flag to mark a symbol as hidden.
     * readonly.
     */
    private boolean hidden;

    /** The actions to perform. */
    private List<SymbolAction> actions;

    /** The custom output if the symbol is executed successfully. */
    private String successOutput;

    /** Constructor. */
    public Symbol() {
        this.actions = new LinkedList<>();
    }

    /**
     * Get the ID of Symbol used in the DB.
     *
     * @return The internal ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    public Long getSymbolId() {
        return symbolId;
    }

    /**
     * Set the ID the Symbol has in the DB new.
     *
     * @param symbolId The new internal ID.
     */
    @JsonIgnore
    public void setSymbolId(Long symbolId) {
        this.symbolId = symbolId;
    }

    /**
     * @return The user that owns the project.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "userId")
    @JsonIgnore
    public User getUser() {
        return user;
    }

    /**
     * @param user The new user that owns the project.
     */
    @JsonIgnore
    public void setUser(User user) {
        this.user = user;
        if (user == null) {
            this.userId = null;
        } else {
            this.userId = user.getId();
        }
    }

    /**
     * @return The ID of the user, which is needed for the JSON.
     */
    @Transient
    @JsonProperty("user")
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId The new ID of the user, which is needed for the JSON.
     */
    @JsonProperty("user")
    public void setUserId(Long userId) {
        this.user = null;
        this.userId = userId;
    }

    /**
     * Get the project the symbol belongs to.
     *
     * @return The (parent) project.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    /**
     * Set the project the symbol belongs to.
     *
     * @param project The new project.
     */
    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
        if (project == null) {
            this.projectId = null;
        } else {
            this.projectId = project.getId();
        }
    }

    /**
     * Get the {@link Project} the Symbol belongs to.
     *
     * @return The parent Project.
     * @requiredField
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * Set the {@link Project} the Symbol belongs to.
     *
     * @param projectId The new parent Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = null;
        this.projectId = projectId;
    }

    /**
     * Get related group of the symbol.
     *
     * @return The group the symbols is a part of.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "groupId")
    @JsonIgnore
    public SymbolGroup getGroup() {
        return group;
    }

    /**
     * Set the group of the symbol.
     *
     * @param group The new group the symbols should be part of.
     */
    @JsonIgnore
    public void setGroup(SymbolGroup group) {
        this.group = group;
        if (group == null) {
            this.groupId = null;
        } else {
            this.groupId = group.getId();
        }
    }

    /**
     * Get the ID of the related group.
     *
     * @return The ID of the group the symbol belongs to or 0L.
     */
    @Transient
    @JsonProperty("group")
    public Long getGroupId() {
        return groupId;
    }

    /**
     * Set the ID of the related group.
     *
     * @param groupId The new group ID.
     */
    @JsonProperty("group")
    public void setGroupId(Long groupId) {
        this.group = null;
        this.groupId = groupId;
    }

    /**
     * Get the ID of the symbol.
     *
     * @return The ID.
     * @requiredField
     */
    @JsonProperty
    public Long getId() {
        return this.id;
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id The new ID.
     */
    @JsonProperty
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the name of the Symbol.
     *
     * @return The name.
     */
    @NotBlank
    @JsonProperty
    public String getName() {
        return name;
    }

    /**
     * Set the name of the Symbol.
     *
     * @param name The new name.
     */
    @JsonProperty
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Determine if the symbol is flagged as hidden.
     *
     * @return true if the symbol should be considered hidden; false otherwise.
     */
    @JsonProperty
    public boolean isHidden() {
        return hidden;
    }

    /**
     * Mark the symbol as hidden or remove the hidden flag.
     *
     * @param hidden true if the symbol should be considered hidden; false otherwise.
     */
    @JsonProperty
    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    @JsonProperty
    public String getSuccessOutput() {
        return successOutput;
    }

    @JsonProperty
    public void setSuccessOutput(String successOutput) {
        this.successOutput = successOutput;
    }

    /**
     * Get the Actions related to the Symbol.
     *
     * @return The actions of this Symbol
     */
    @OneToMany(
            mappedBy = "symbol",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.ALL})
    @OrderBy("number ASC")
    @JsonProperty
    public List<SymbolAction> getActions() {
        return actions;
    }

    /**
     * Set a new List of Actions related to the Symbol.
     *
     * @param actions The new list of SymbolActions
     */
    @JsonProperty
    public void setActions(List<SymbolAction> actions) {
        if (actions == null) {
            this.actions = new LinkedList<>();
        } else {
            this.actions = actions;
        }
    }

    /**
     * Add one action to the end of the Action List.
     *
     * @param action The SymbolAction to add.
     */
    public void addAction(SymbolAction action) {
        if (action == null) {
            throw new IllegalArgumentException("Can not add action 'null'");
        }

        actions.add(action);
        action.setSymbol(this);
    }

    @Override
    public ExecuteResult execute(ConnectorManager connector) throws SULException {
        LOGGER.info(LEARNER_MARKER, "Executing Symbol {} ({})...", String.valueOf(id), name);
        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.increaseIndent();
        }

        // assume the output is ok until proven otherwise
        ExecuteResult result = ExecuteResult.OK;

        for (int i = 0; i < actions.size(); i++) {
            final SymbolAction action = actions.get(i);

            if (!action.isDisabled()) {
                final ExecuteResult actionResult = executeAction(action, connector);

                // if the execution of one symbol fails do not continue executing the following actions
                if (actionResult == ExecuteResult.FAILED && !action.isIgnoreFailure()) {
                    if (action.getErrorOutput() != null && !action.getErrorOutput().trim().equals("")) {
                        actionResult.setOutput(action.insertVariableValues(action.getErrorOutput()));
                    } else {
                        actionResult.setOutput(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (" + (i + 1) + ")");
                    }
                    result = actionResult;
                    break;
                }
            }
        }

        // set the output of the symbol *after* all actions are executed so that variables and counters have their
        // proper values.
        if (result == ExecuteResult.OK) {
            if (successOutput != null && !successOutput.trim().equals("")) {
                result.setOutput(SearchHelper.insertVariableValues(connector, userId, projectId, successOutput));
            } else {
                result.setOutput(ExecuteResult.DEFAULT_SUCCESS_OUTPUT);
            }
        }

        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.decreaseIndent();
        }
        LOGGER.info(LEARNER_MARKER, "Executed the Symbol {} ({}) => {}.", String.valueOf(id), name, result);
        return result;
    }

    private ExecuteResult executeAction(SymbolAction action, ConnectorManager connector) {
        try {
            return action.executeAction(connector);
        } catch (Exception e) {
            LOGGER.info(LEARNER_MARKER, "Error while executing the action '{}' in the symbol '{}':", action, this, e);
            return ExecuteResult.FAILED;
        }
    }

    @Override
    @SuppressWarnings({"checkstyle:needbraces", "checkstyle:operatorwrap"}) // Partly auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Symbol symbol = (Symbol) o;

        if (getUserId() == null || getProjectId() == null || getId() == null) {
            return Objects.equals(getName(), symbol.getName());
        }

        return Objects.equals(getUserId(), symbol.getUserId()) &&
                Objects.equals(getProjectId(), symbol.getProjectId()) &&
                Objects.equals(getGroupId(), symbol.getGroupId()) &&
                Objects.equals(getId(), symbol.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUserId(), getProjectId(), getGroupId(), getId());
    }

    @Override
    public String toString() {
        return "Symbol[" + symbolId + "] " + this.user + this.project + "/" + this.getId() + ", "
                + name + " #actions: " + actions.size();
    }

}
