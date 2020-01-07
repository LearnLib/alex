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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestReport;
import org.hibernate.validator.constraints.Length;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Representation of a testing project with different symbols.
 */
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Project implements Serializable {

    private static final long serialVersionUID = -6760395646972200067L;

    /** The maximum length for the project description. */
    public static final int MAX_DESCRIPTION_LENGTH = 250;

    /**
     * The project ID.
     */
    @Id
    @GeneratedValue
    private Long id;

    @ManyToMany(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    @JoinTable(
            name = "project_owners",
            joinColumns = @JoinColumn(name = "project_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id")
    )
    private List<User> owners;

    @ManyToMany(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id")
    )
    private List<User> members;

    /**
     * The name of the project. This property is required & must be unique.
     */
    @NotBlank
    private String name;

    /**
     * A text to describe the Project.
     */
    @Length(max = MAX_DESCRIPTION_LENGTH)
    private String description;

    /**
     * The list of groups in the project.
     */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonIgnore
    private Set<SymbolGroup> groups;

    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.REMOVE}
    )
    private List<ProjectEnvironment> environments;

    /**
     * The list of test reports in the project.
     */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonIgnore
    private Set<TestReport> testReports;

    /**
     * The symbols used to test.
     */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Symbol> symbols;

    /** The tests of this project. */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Test> tests;

    /** The test configurations of this project. */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonIgnore
    private List<TestExecutionConfig> testExecutionConfigs;

    /**
     * The counters of the project.
     */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Counter> counters;

    /**
     * The lts formulas of the project.
     */
    @OneToMany(
            mappedBy = "project",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private List<LtsFormula> ltsFormulas;

    /**
     * Default constructor.
     */
    public Project() {
        this(0L);
    }

    /**
     * Constructor which set the ID.
     *
     * @param projectId The ID.
     */

    public Project(Long projectId) {
        this.id = projectId;
        this.groups = new HashSet<>();
        this.symbols = new HashSet<>();
        this.tests = new HashSet<>();
        this.testReports = new HashSet<>();
        this.testExecutionConfigs = new ArrayList<>();
        this.ltsFormulas = new ArrayList<>();
        this.environments = new ArrayList<>();
        this.owners = new ArrayList<>();
        this.members = new ArrayList<>();
    }

    /**
     * Get the ID of the project.
     *
     * @return The ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Set the ID of this project.
     *
     * @param id The new ID.
     */
    public void setId(Long id) {
        this.id = id;
    }

    @JsonIgnore
    public List<User> getOwners() {
        return owners;
    }

    @JsonIgnore
    public void addOwner(User owner) {
        owners.add(owner);
    }

    @JsonIgnore
    public void setOwners(List<User> owners) {
        this.owners = owners;
    }

    @JsonIgnore
    public boolean removeOwner(User owner) {
        return owners.remove(owner);
    }

    @JsonIgnore
    public List<User> getMembers() {
        return members;
    }

    @JsonIgnore
    public void addMember(User member) {
        members.add(member);
    }

    @JsonIgnore
    public void setMembers(List<User> members) {
        this.members = members;
    }

    @JsonIgnore
    public boolean removeMember(User member) {
        return members.remove(member);
    }

    @JsonProperty("members")
    public List<Long> getMemberIds() {
        return this.members.stream().map(User::getId).collect(Collectors.toList());
    }

    @JsonProperty("owners")
    public List<Long> getOwnerIds() {
        return this.owners.stream().map(User::getId).collect(Collectors.toList());
    }

    /**
     * Get the name of this project.
     *
     * @return The name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set a new name for the project. The name must be there and be unique.
     *
     * @param name The new name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the description of the Project.
     *
     * @return The Project description.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Set the description of this project.
     *
     * @param description The new description.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Get the groups of the project.
     *
     * @return The related groups.
     */
    public Set<SymbolGroup> getGroups() {
        return groups;
    }

    /**
     * Set a new set of groups that are used in the project.
     *
     * @param groups The new set of groups.
     */
    public void setGroups(Set<SymbolGroup> groups) {
        this.groups = groups;
    }

    /**
     * Add one group to the project.
     *
     * @param group The group to add.
     */
    public void addGroup(SymbolGroup group) {
        this.groups.add(group);
        group.setProject(this);
    }

    /**
     * Get the set of symbols in the project.
     *
     * @return The Set of Symbols.
     */
    @JsonIgnore
    public Collection<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * @param symbols the symbols to set
     */
    @JsonIgnore
    public void setSymbols(Set<Symbol> symbols) {
        this.symbols = symbols;
    }

    public List<ProjectEnvironment> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<ProjectEnvironment> environments) {
        this.environments = environments;
    }

    /**
     * Add a Symbol to the Project and set the Project in the Symbol.
     * This only establishes the bidirectional relation does nothing else,
     * e.g. it does not take care of the right id.
     *
     * @param symbol The Symbol to add.
     */
    public void addSymbol(Symbol symbol) {
        this.symbols.add(symbol);
        symbol.setProject(this);
    }

    @JsonIgnore
    public Collection<Test> getTests() {
        return tests;
    }

    @JsonIgnore
    public void setTests(Set<Test> tests) {
        this.tests = tests;
    }

    @JsonIgnore
    public Set<TestReport> getTestReports() {
        return testReports;
    }

    @JsonIgnore
    public void setTestReports(Set<TestReport> testReports) {
        this.testReports = testReports;
    }

    /**
     * @return All the counters of the Project.
     */
    @JsonProperty
    @JsonIgnore
    public Set<Counter> getCounters() {
        return counters;
    }

    /**
     * @param counters The new set of counters for the project.
     */
    @JsonIgnore
    public void setCounters(Set<Counter> counters) {
        this.counters = counters;
    }

    public List<LtsFormula> getLtsFormulas() {
        return ltsFormulas;
    }

    public void setLtsFormulas(List<LtsFormula> ltsFormulas) {
        this.ltsFormulas = ltsFormulas;
    }

    public List<TestExecutionConfig> getTestExecutionConfigs() {
        return testExecutionConfigs;
    }

    public void setTestExecutionConfigs(List<TestExecutionConfig> testExecutionConfigs) {
        this.testExecutionConfigs = testExecutionConfigs;
    }

    @Transient
    @JsonIgnore
    public ProjectEnvironment getDefaultEnvironment() {
        return this.environments.stream()
                .filter(ProjectEnvironment::isDefault)
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return Objects.equals(id, project.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "[Project " + id + "]: " /* + user */ + ", " + name;
    }

}
