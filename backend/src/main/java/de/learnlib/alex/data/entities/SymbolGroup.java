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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Entity to organize symbols.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"projectId", "name"})
        }
)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SymbolGroup implements Serializable {

    private static final long serialVersionUID = 4986838799404559274L;

    /** The related project. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;

    /** The ID of the group in the db. */
    @Id
    @GeneratedValue
    private Long id;

    /** The name of the group. */
    @NotBlank
    private String name;

    /** The parent group. Is null if the group is on the top level. */
    @ManyToOne
    @JoinColumn(name = "parentId")
    private SymbolGroup parent;

    /** The Symbols manged by this group. */
    @OneToMany(
            mappedBy = "group",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    private Set<Symbol> symbols;

    /** The child groups. */
    @OneToMany(
            mappedBy = "parent",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    private List<SymbolGroup> groups;

    /** Constructor. */
    public SymbolGroup() {
        this.symbols = new HashSet<>();
        this.groups = new ArrayList<>();
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the ID of the related project.
     *
     * @return The ID of the project the group belongs to or 0.
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return project == null ? null : project.getId();
    }

    /**
     * Create and set a new project by a new project ID.
     *
     * @param projectId
     *         The new project ID.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Symbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(Set<Symbol> symbols) {
        this.symbols = symbols == null ? new HashSet<>() : symbols;
    }

    public SymbolGroup getParent() {
        return parent;
    }

    public void setParent(SymbolGroup parent) {
        this.parent = parent;
    }

    /**
     * Get the id of the parent group.
     *
     * @return The id of the parent group.
     */
    @Transient
    @JsonProperty("parent")
    public Long getParentId() {
        return this.parent == null ? null : this.parent.getId();
    }

    /**
     * Set the parent by its id.
     *
     * @param parentId
     *         The id of the parent group or null.
     */
    @JsonProperty("parent")
    public void setParentId(Long parentId) {
        if (parentId != null) {
            this.parent = new SymbolGroup();
            this.parent.setId(parentId);
        }
    }

    public List<SymbolGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<SymbolGroup> groups) {
        this.groups = groups;
    }

    /**
     * Add one symbol to the group.
     *
     * @param symbol
     *         The symbol to add.
     */
    @JsonIgnore
    public void addSymbol(Symbol symbol) {
        this.symbols.add(symbol);
        symbol.setGroup(this);
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SymbolGroup group = (SymbolGroup) o;
        return Objects.equals(id, group.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "SymbolGroup[" + id + "]: " + project + ", " + name;
    }
}
