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
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.utils.LoggerUtil;
import de.learnlib.api.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Embedded;
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
import javax.validation.constraints.Size;
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
                @UniqueConstraint(columnNames = {"userId", "projectId", "id", "revision"}),
        }
)
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = 7987585761829495962L;

    /** The maximum length of the abbreviation. */
    private static final int MAX_ABBREVIATION_LENGTH = 15;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER  = MarkerManager.getMarker("LEARNER");

    /** The ID of the Symbol in the DB. */
    private Long symbolId;

    /** The User that owns the Symbol. */
    private User user;

    /** The plain ID of the User to be used in the JSON. */
    private Long userId;

    /** The Project the Symbol belongs to. */
    private Project project;

    /** The plain ID of the Project to be used in the JSON. */
    private Long projectId;

    /** The group the symbol belongs to. */
    private SymbolGroup group;

    /** The plain ID of the Group to be used in the JSON. */
    private Long groupId;

    /** The ID and revision of the symbol. */
    private IdRevisionPair idRevisionPair;

    /**
     * The name of the symbol.
     * @requiredField
     */
    private String name;

    /**
     * An abbreviation for the symbol.
     * @requiredField
     */
    private String abbreviation;

    /**
     * flag to mark a symbol as hidden.
     * readonly.
     */
    private boolean hidden;

    /** The actions to perform. */
    private List<SymbolAction> actions;

    /**
     * Default constructor.
     */
    public Symbol() {
        this.idRevisionPair = new IdRevisionPair();
        this.actions = new LinkedList<>();

        this.userId    = 0L;
        this.projectId = 0L;
        this.groupId   = 0L;
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
            this.userId = 0L;
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
     * @param project
     *            The new project.
     */
    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
        if (project == null) {
            this.projectId = 0L;
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
     * @param projectId
     *            The new parent Project.
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
     * @param group
     *         The new group the symbols should be part of.
     */
    @JsonIgnore
    public void setGroup(SymbolGroup group) {
        this.group = group;
        if (group == null) {
            this.groupId = 0L;
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
     * @param groupId
     *         The new group ID.
     */
    @JsonProperty("group")
    public void setGroupId(Long groupId) {
        this.group = null;
        this.groupId = groupId;
    }

    /**
     * Get the ID and revision of the symbol as pair.
     *
     * @return The current ID and revision pair.
     */
    @Embedded
    @JsonIgnore
    public IdRevisionPair getIdRevisionPair() {
        return idRevisionPair;
    }

    /**
     * Set a new ID and Revision pair.
     *
     * @param idRevisionPair
     *         The new ID and revision.
     */
    @JsonIgnore
    public void setIdRevisionPair(IdRevisionPair idRevisionPair) {
        this.idRevisionPair = idRevisionPair;
    }

    /**
     * Get the ID of the symbol.
     *
     * @return The ID.
     * @requiredField
     */
    @Transient
    @JsonProperty("id")
    public Long getId() {
        return this.idRevisionPair.getId();
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id
     *            The new ID.
     */
    @JsonProperty("id")
    public void setId(Long id) {
        this.idRevisionPair.setId(id);
    }

    /**
     * Get the revision of the symbol.
     *
     * @return The revision.
     * @requiredField
     */
    @Transient
//    @JsonProperty("revision")
    public Long getRevision() {
        return this.idRevisionPair.getRevision();
    }

    /**
     * Set the revision of the symbol.
     *
     * @param revision
     *            The new revision.
     */
//    @JsonProperty("revision")
    public void setRevision(Long revision) {
        this.idRevisionPair.setRevision(revision);
    }

    /**
     * Get the name of the Symbol.
     *
     * @return The name.
     */
    @NotBlank
//    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * Set the name of the Symbol.
     *
     * @param name
     *            The new name.
     */
//    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the abbreviation
     */
    @NotBlank
    @Size(min = 1, max = MAX_ABBREVIATION_LENGTH)
//    @JsonProperty("abbreviation")
    public String getAbbreviation() {
        return abbreviation;
    }

    /**
     * @param abbreviation
     *            the abbreviation to set
     */
//    @JsonProperty("abbreviation")
    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    /**
     * Determine if the symbol is flagged as hidden.
     * 
     * @return true if the symbol should be considered hidden; false otherwise.
     */
    @JsonProperty("hidden")
    public boolean isHidden() {
        return hidden;
    }

    /**
     * Mark the symbol as hidden or remove the hidden flag.
     *
     * @param hidden
     *            true if the symbol should be considered hidden; false otherwise.
     */
    @JsonIgnore
    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    /**
     * Get the Actions related to the Symbol.
     *
     * @return The actions of this Symbol
     */
    @OneToMany(
            mappedBy = "symbol",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @OrderBy("number ASC")
//    @JsonProperty("actions")
    public List<SymbolAction> getActions() {
        return actions;
    }

    /**
     * Set a new List of Actions related to the Symbol.
     *
     * @param actions
     *         The new list of SymbolActions
     */
//    @JsonProperty("actions")
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
     * @param action
     *         The SymbolAction to add.
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
        LOGGER.info(LEARNER_MARKER, "Executing Symbol {} ({})...", idRevisionPair.toString(), name);
        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.increaseIndent();
        }

        ExecuteResult result = ExecuteResult.OK;
        for (int i = 0; i < actions.size() && result == ExecuteResult.OK; i++) {
            SymbolAction action = actions.get(i);
            if (!action.isDisabled()) {
                ExecuteResult actionResult = executeAction(action, connector);

                if (!action.isIgnoreFailure() && actionResult != ExecuteResult.OK) {
                    result = actionResult;
                    result.setFailedActionNumber(i);
                }
            }
        }

        LOGGER.info("Executed the Symbol " + idRevisionPair.toString() + " (" + name + ") "
                    + "which returned '" + result + "'.");
        return result;
    }

    private ExecuteResult executeAction(SymbolAction action, ConnectorManager connector) {
        try {
            return action.executeAction(connector);
        } catch (Exception e) {
            LOGGER.info("Error while executing the action '" + action + "' in the symbol '" + this + "':", e);
            return ExecuteResult.FAILED;
        }
    }

    /*
    @PrePersist
    @PreUpdate
    public void preSave() {
        for (int i = 0; i < actions.size(); i++) {
            SymbolAction action = actions.get(i);

            action.setUser(this.user);
            action.setProject(this.project);
            action.setSymbol(this);
            action.setNumber(i);
        }
    }
    */

    @Override
    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Symbol symbol = (Symbol) o;
        return Objects.equals(symbolId, symbol.symbolId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(symbolId);
    }

    @Override
    public String toString() {
        int amountOfActions = actions == null ? 0 : actions.size();
        return "Symbol[" + symbolId + "] " + this.user + this.project + "/" + this.getId() + "/" + this.getRevision()
                + ", " + name + "(" + abbreviation + ") #actions: " + amountOfActions;
    }

}
