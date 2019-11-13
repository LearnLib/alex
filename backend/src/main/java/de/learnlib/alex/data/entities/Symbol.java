/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.actions.misc.CreateLabelAction;
import de.learnlib.alex.data.entities.actions.misc.JumpToLabelAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.api.exception.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Representation of a symbol for the learning process. A Symbol is one unit which will be executed and it is made of a
 * sequence of actions.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"projectId", "name"},
                        name = "unique_name_in_project")
        }
)
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<ExecuteResult, ConnectorManager>, Serializable {

    private static final long serialVersionUID = 7987585761829495962L;

    private static final Logger LOGGER = LogManager.getLogger();

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

    /** Description of what should be the state after the symbol has been executed. */
    private String expectedResult;

    /** flag to mark a symbol as hidden. readonly. */
    private boolean hidden;

    /** The steps to execute when the symbol is executed. */
    private List<SymbolStep> steps;

    /** The custom output if the symbol is executed successfully. */
    private String successOutput;

    /** The list of input variables. */
    private List<SymbolInputParameter> inputs;

    /** The list of output variables. */
    private List<SymbolOutputParameter> outputs;

    /** Constructor. */
    public Symbol() {
        this.inputs = new ArrayList<>();
        this.outputs = new ArrayList<>();
        this.steps = new ArrayList<>();
        this.expectedResult = "";
        this.description = "";
        this.hidden = false;
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
     *         The new project.
     */
    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the {@link Project} the Symbol belongs to.
     *
     * @return The parent Project.
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return project == null ? null : project.getId();
    }

    /**
     * Set the {@link Project} the Symbol belongs to.
     *
     * @param projectId
     *         The new parent Project.
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
     * @param group
     *         The new group the symbols should be part of.
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
     * @param groupId
     *         The new group ID.
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
     */
    @Id
    @GeneratedValue
    @JsonProperty
    public Long getId() {
        return this.id;
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id
     *         The new ID.
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
     * @param name
     *         The new name.
     */
    @JsonProperty
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty
    @Column(columnDefinition = "MEDIUMTEXT")
    public String getDescription() {
        return description;
    }

    @JsonProperty
    public void setDescription(String description) {
        this.description = description == null ? "" : description;
    }

    @JsonProperty
    @Column(columnDefinition = "MEDIUMTEXT")
    public String getExpectedResult() {
        return expectedResult;
    }

    @Column
    public void setExpectedResult(String expectedResult) {
        this.expectedResult = expectedResult == null ? "" : expectedResult;
    }

    /**
     * Determine if the symbol is flagged as hidden.
     *
     * @return true if the symbol should be considered hidden; false otherwise.
     */
    public boolean isHidden() {
        return hidden;
    }

    /**
     * Mark the symbol as hidden or remove the hidden flag.
     *
     * @param hidden
     *         true if the symbol should be considered hidden; false otherwise.
     */
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

    @OneToMany(
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

    @OneToMany(
            cascade = {CascadeType.REMOVE, CascadeType.MERGE},
            mappedBy = "symbol"
    )
    @OrderBy("position ASC")
    @JsonProperty
    public List<SymbolStep> getSteps() {
        return steps;
    }

    @JsonProperty
    public void setSteps(List<SymbolStep> steps) {
        this.steps = steps;
    }

    @Override
    public ExecuteResult execute(ConnectorManager connectors) throws SULException {
        LOGGER.info(LoggerMarkers.LEARNER, "Executing Symbol {} ({})...", String.valueOf(id), name);

        if (steps.isEmpty()) {
            return new ExecuteResult(false, "Not implemented");
        }


        final Map<String, Integer> labels = getLabelsMap();

        // assume the output is ok until proven otherwise
        ExecuteResult result = new ExecuteResult(true);

        final long startTime = System.currentTimeMillis();
        for (int i = 0; i < steps.size(); i++) {
            final SymbolStep step = steps.get(i);

            if (!step.isDisabled()) {
                final ExecuteResult stepResult = step.execute(i, connectors);

                if (!stepResult.isSuccess() && !step.isIgnoreFailure()) {
                    if (step instanceof SymbolActionStep && ((SymbolActionStep) step).getAction() instanceof JumpToLabelAction) {
                        continue;
                    }

                    result = stepResult;

                    if (step.errorOutput != null && !step.errorOutput.equals("")) {
                        result.setMessage(SearchHelper.insertVariableValues(connectors, getProjectId(), step.errorOutput));
                    } else {
                        result.setMessage(String.valueOf(i + 1));
                    }
                    result.addTrace(this, result);

                    break;
                } else {
                    if (step instanceof SymbolActionStep && ((SymbolActionStep) step).getAction() instanceof JumpToLabelAction) {
                        final String label = ((JumpToLabelAction) ((SymbolActionStep) step).getAction()).getLabel();
                        i = labels.get(label);
                    }
                }
            }
        }
        result.setTime(System.currentTimeMillis() - startTime);

        // set the output of the symbol *after* all actions are executed so that variables and counters have their
        // proper values.
        if (result.isSuccess()) {
            if (successOutput != null && !successOutput.trim().equals("")) {
                result.setMessage(SearchHelper.insertVariableValues(connectors, project.getId(), successOutput));
            }
        }

        LOGGER.info(LoggerMarkers.LEARNER, "Executed the Symbol {} ({}) => {}.", String.valueOf(id), name, result);

        return result;
    }

    /**
     * Check if the given symbol contains a specific parameter in its inputs or outputs.
     *
     * @param parameter
     *         The parameter.
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
     * @param parameter
     *         The parameter to add.
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
     * @param parameter
     *         The parameter to remove.
     */
    public void removeParameter(SymbolParameter parameter) {
        if (parameter instanceof SymbolInputParameter) {
            this.inputs.remove(parameter);
        } else if (parameter instanceof SymbolOutputParameter) {
            this.outputs.remove(parameter);
        }
    }

    @Transient
    private Map<String, Integer> getLabelsMap() {
        final Map<String, Integer> labelsMap = new HashMap<>();

        for (int i = 0; i < steps.size(); i++) {
            final SymbolStep step = steps.get(i);
            if (step instanceof SymbolActionStep && ((SymbolActionStep) step).getAction() instanceof CreateLabelAction) {
                final String label = ((CreateLabelAction) ((SymbolActionStep) step).getAction()).getLabel();
                labelsMap.put(label, i);
            }
        }

        return labelsMap;
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
        return "Symbol[" + id + "] " + this.project + "/" + this.getId() + ", "
                + name + " #steps: " + steps.size();
    }

}
