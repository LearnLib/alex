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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.testsuites.entities.Test;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Representation of a testing project with different symbols.
 */
@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "name"})
)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Project implements Serializable {

    private static final long serialVersionUID = -6760395646972200067L;

    /**
     * The project ID.
     */
    @Id
    @GeneratedValue
    private Long id;

    /** The user that owns this project. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JsonIgnore
    private User user;

    /** The plain ID of the User to be used in the JSON. */
    @Transient
    @JsonProperty("user")
    private Long userId;

    /**
     * The name of the project. This property is required & must be unique.
     *
     * @requiredField
     */
    @NotBlank
    private String name;

    /**
     * The root URL of the project.
     *
     * @requiredField
     */
    @NotBlank
    private String baseUrl;

    /**
     * A text to describe the Project.
     */
    private String description;

    /**
     * The list of groups in the project.
     */
    @OneToMany(
            mappedBy = "project",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonProperty("groups")
    private Set<SymbolGroup> groups;

    /**
     * The next id for a group in the project.
     */
    @JsonIgnore
    private Long nextGroupId;

    /**
     * The symbols used to test.
     */
    @OneToMany(
            mappedBy = "project",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Symbol> symbols;

    /**
     * The next id for a symbol in this project.
     */
    @JsonIgnore
    private Long nextSymbolId;

    @OneToMany(
            mappedBy = "project",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Test> tests;

    /**
     * The results of the test for the project.
     */
    @OneToMany(
            mappedBy = "project",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<LearnerResult> testResults;

    /**
     * The counters of the project.
     */
    @OneToMany(
            mappedBy = "project",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonIgnore
    private Set<Counter> counters;

    /**
     * The URLs of the mirrors of the application.
     */
    @Column(columnDefinition = "CLOB")
    private String mirrorUrls;

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
        this.nextGroupId = 0L;
        this.symbols = new HashSet<>();
        this.nextSymbolId = 1L;

        this.mirrorUrls = "";
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

    /**
     * @return The user that owns the project.
     */
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
     * Get the root URL of the Project.
     *
     * @return The base URl.
     */
    public String getBaseUrl() {
        return baseUrl;
    }

    /**
     * Set the base URL of the Project.
     *
     * @param baseUrl The new base URL.
     */
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
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
     * Get the next ID that a new group in this project should have.
     * This will not increment the next ID!
     *
     * @return The next group ID.
     */
    public Long getNextGroupId() {
        return nextGroupId;
    }

    /**
     * Set a new ID that a group in the project should have.
     *
     * @param nextGroupId The new next group id.
     */
    public void setNextGroupId(Long nextGroupId) {
        this.nextGroupId = nextGroupId;
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

    /**
     * Get the amount of Symbols related to this project.
     *
     * @return The current count of Symbols. If the project has no symbols (== null) 0 is returned.
     */
    @JsonProperty("symbolAmount")
    public int getSymbolsSize() {
        if (symbols == null) {
            return 0;
        } else {
            return symbols.size();
        }
    }

    /**
     * Get the next free id for a symbol in the project.
     *
     * @return The next symbol id.
     */
    public Long getNextSymbolId() {
        return nextSymbolId;
    }

    /**
     * Set the ID the next symbol in this project should have.
     *
     * @param nextSymbolId The next free id for a symbol.
     */
    public void setNextSymbolId(Long nextSymbolId) {
        this.nextSymbolId = nextSymbolId;
    }

    @JsonIgnore
    public Collection<Test> getTests() {
        return tests;
    }

    @JsonIgnore
    public void setTests(Set<Test> tests) {
        this.tests = tests;
    }

    public void addTest(Test test) {
        this.tests.add(test);
    }

    /**
     * Get a set of all tests results related to the project.
     *
     * @return The test results of the project.
     */
    @JsonProperty
    public Set<LearnerResult> getTestResults() {
        return testResults;
    }

    /**
     * Set the related test results for this project.
     *
     * @param testResults The test result of the project.
     */
    @JsonIgnore
    public void setTestResults(Set<LearnerResult> testResults) {
        this.testResults = testResults;
    }

    /**
     * @return All the counters of the Project.
     */
    @JsonProperty
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

    /**
     * @return The mirror URLs for the project.
     */
    public List<String> getMirrorUrls() {
        return mirrorUrls.equals("") ? new ArrayList<>() : Arrays.asList(mirrorUrls.split(","));
    }

    /**
     * @param mirrorUrls The mirror URLs for the project.
     */
    public void setMirrorUrls(List<String> mirrorUrls) {
        this.mirrorUrls = String.join(",", mirrorUrls);
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
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
        return "[Project " + id + "]: " + user + ", " + name + "(" + baseUrl + ")";
    }

}
