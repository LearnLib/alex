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
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.common.utils.LoggerUtil;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Representation of a symbol for the learning process.
 * A Symbol is one unit which will be executed and it is made of a sequence of actions.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"projectId", "id"},
                        name = "Unique ID project")
        }
)
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    private static final long serialVersionUID = 7987585761829495962L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The ID of the Symbol in the DB. */
    private UUID uuid;

    /** The id of the symbol in the project. */
    private Long id;

    /** The Project the Symbol belongs to. */
    private Project project;

    /** The group the symbol belongs to. */
    private SymbolGroup group;

    /** The name of the symbol. */
    private String name;

    /** The description of the symbol. */
    private String description;

    /**
     * flag to mark a symbol as hidden.
     * readonly.
     */
    private boolean hidden;

    /** The actions to perform. */
    private List<SymbolAction> actions;

    /** The custom output if the symbol is executed successfully. */
    private String successOutput;

    /** The list of input variables. */
    private List<SymbolInputParameter> inputs;

    /** The list of output variables. */
    private List<SymbolOutputParameter> outputs;

    /** Constructor. */
    public Symbol() {
        this.actions = new LinkedList<>();
        this.inputs = new ArrayList<>();
        this.outputs = new ArrayList<>();
    }

    /**
     * Get the ID of Symbol used in the DB.
     *
     * @return The internal ID.
     */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @JsonIgnore
    public UUID getUUID() {
        return uuid;
    }

    /**
     * Set the ID the Symbol has in the DB new.
     *
     * @param uuid The new internal ID.
     */
    @JsonIgnore
    public void setUUID(UUID uuid) {
        this.uuid = uuid;
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
        return project == null ? null : project.getId();
    }

    /**
     * Set the {@link Project} the Symbol belongs to.
     *
     * @param projectId The new parent Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
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
    }

    /**
     * Get the ID of the related group.
     *
     * @return The ID of the group the symbol belongs to or 0L.
     */
    @Transient
    @JsonProperty("group")
    public Long getGroupId() {
        return group == null ? null : group.getId();
    }

    /**
     * Set the ID of the related group.
     *
     * @param groupId The new group ID.
     */
    @JsonProperty("group")
    public void setGroupId(Long groupId) {
        this.group = new SymbolGroup();
        this.group.setId(groupId);
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

    @JsonProperty
    @Column(columnDefinition = "CLOB")
    public String getDescription() {
        return description;
    }

    @JsonProperty
    public void setDescription(String description) {
        this.description = description;
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

    @OneToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.REMOVE},
            orphanRemoval = true
    )
    @OrderBy("name ASC")
    @JsonProperty
    public List<SymbolInputParameter> getInputs() {
        return inputs;
    }

    @JsonProperty
    public void setInputs(List<SymbolInputParameter> inputs) {
        this.inputs = inputs;
    }

    @OneToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.REMOVE},
            orphanRemoval = true
    )
    @OrderBy("name ASC")
    @JsonProperty
    public List<SymbolOutputParameter> getOutputs() {
        return outputs;
    }

    @JsonProperty
    public void setOutputs(List<SymbolOutputParameter> outputs) {
        this.outputs = outputs;
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

        final VariableStoreConnector globalVariableStore = connector.getConnector(VariableStoreConnector.class);
        final VariableStoreConnector localVariableStore = new VariableStoreConnector();

        try {
            // get the input variables from the global context
            inputs.stream()
                    .filter(in -> in.getParameterType().equals(SymbolParameter.ParameterType.STRING))
                    .forEach(in -> localVariableStore.set(in.getName(), globalVariableStore.get(in.getName())));
            connector.addConnector(localVariableStore);
        } catch (IllegalStateException e) {
            return new ExecuteResult(false, e.getMessage());
        }

        final CounterStoreConnector globalCounterStore = connector.getConnector(CounterStoreConnector.class);
        final CounterStoreConnector localCounterStore = globalCounterStore.copy();

        try {
            // get the input counters from the global context
            inputs.stream()
                    .filter(in -> in.getParameterType().equals(SymbolParameter.ParameterType.COUNTER))
                    .forEach(in -> {
                        final String counterName = in.getName();
                        localCounterStore.set(project.getId(), counterName, globalCounterStore.get(counterName));
                    });
            connector.addConnector(localCounterStore);
        } catch (IllegalStateException e) {
            return new ExecuteResult(false, e.getMessage());
        }

        // assume the output is ok until proven otherwise
        ExecuteResult result = new ExecuteResult(true);

        for (int i = 0; i < actions.size(); i++) {
            final SymbolAction action = actions.get(i);

            if (!action.isDisabled()) {
                final ExecuteResult actionResult = executeAction(action, connector);

                // if the execution of one symbol fails do not continue executing the following actions
                if (!actionResult.isSuccess() && !action.isIgnoreFailure()) {
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
        if (result.isSuccess()) {
            if (successOutput != null && !successOutput.trim().equals("")) {
                result.setOutput(SearchHelper.insertVariableValues(connector, project.getId(), successOutput));
            } else {
                result.setOutput(ExecuteResult.DEFAULT_SUCCESS_OUTPUT);
            }
        }

        if (LOGGER.isEnabled(Level.INFO, LEARNER_MARKER)) {
            LoggerUtil.decreaseIndent();
        }
        LOGGER.info(LEARNER_MARKER, "Executed the Symbol {} ({}) => {}.", String.valueOf(id), name, result);

        // set the values of the outputs to the global context
        if (result.isSuccess()) {
            try {
                outputs.stream()
                        .filter(out -> out.getParameterType().equals(SymbolParameter.ParameterType.STRING))
                        .forEach(out -> globalVariableStore.set(out.getName(), localVariableStore.get(out.getName())));

                outputs.stream()
                        .filter(out -> out.getParameterType().equals(SymbolParameter.ParameterType.COUNTER))
                        .forEach(out -> {
                            final String counterName = out.getName();
                            globalCounterStore.set(project.getId(), counterName, localCounterStore.get(counterName));
                        });
            } catch (IllegalStateException e) {
                return new ExecuteResult(false, e.getMessage());
            }
        }
        connector.addConnector(globalVariableStore);
        connector.addConnector(globalCounterStore);

        return result;
    }

    private ExecuteResult executeAction(SymbolAction action, ConnectorManager connector) {
        try {
            return action.executeAction(connector);
        } catch (Exception e) {
            LOGGER.info(LEARNER_MARKER, "Error while executing the action '{}' in the symbol '{}':", action, this, e);
            return new ExecuteResult(false);
        }
    }

    /**
     * Check if the given symbol contains a specific parameter in its inputs or outputs.
     *
     * @param parameter The parameter.
     * @return If the parameter exists as input or output parameter.
     */
    public boolean containsParameter(SymbolParameter parameter) {
        final List<SymbolParameter> parameters = new ArrayList<>(inputs);
        parameters.addAll(outputs);
        return parameters.contains(parameter);
    }

    /**
     * Adds a parameter.
     *
     * @param parameter The parameter to add.
     */
    public void addParameter(SymbolParameter parameter) {
        if (parameter instanceof SymbolInputParameter) {
            this.inputs.add((SymbolInputParameter) parameter);
        } else if (parameter instanceof SymbolOutputParameter) {
            this.outputs.add((SymbolOutputParameter) parameter);
        }
    }

    /**
     * Removes a parameter.
     *
     * @param parameter The parameter to remove.
     */
    public void removeParameter(SymbolParameter parameter) {
        if (parameter instanceof SymbolInputParameter) {
            this.inputs.remove(parameter);
        } else if (parameter instanceof SymbolOutputParameter) {
            this.outputs.remove(parameter);
        }
    }

    @Override
    @SuppressWarnings({"checkstyle:needbraces", "checkstyle:operatorwrap"}) // Partly auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Symbol symbol = (Symbol) o;

        if (getProjectId() == null || getId() == null) {
            return Objects.equals(getName(), symbol.getName());
        }

        return Objects.equals(getProjectId(), symbol.getProjectId()) &&
                Objects.equals(getGroupId(), symbol.getGroupId()) &&
                Objects.equals(getId(), symbol.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getProjectId(), getGroupId(), getId());
    }

    @Override
    public String toString() {
        return "Symbol[" + uuid + "] " + this.project + "/" + this.getId() + ", "
                + name + " #actions: " + actions.size();
    }

}
