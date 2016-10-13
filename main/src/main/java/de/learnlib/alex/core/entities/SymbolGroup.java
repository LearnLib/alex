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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entity to organize symbols.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "projectId", "id"}),
                @UniqueConstraint(columnNames = {"userId", "projectId", "name"})
        }
)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SymbolGroup implements Serializable {

    private static final long serialVersionUID = 4986838799404559274L;

    /** The ID of the SymbolGroup in the DB. */
    private Long groupId;

    /** The User that owns this SymbolGroup. */
    private User user;

    /** The plain ID of the User to be used in the JSON. */
    private Long userId;

    /** The related project. */
    private Project project;

    /** The plain ID of the Project to be used in the JSON. */
    private Long projectId;

    /** The ID of the group within the project. */
    private Long id;

    /**
     * The name of the group.
     * @requiredField
     */
    private String name;

    /** The Symbols manged by this group. */
    private Set<Symbol> symbols;

    /**
     * Default constructor.
     */
    public SymbolGroup() {
        this.symbols = new HashSet<>();

        this.userId    = 0L;
        this.projectId = 0L;
    }

    /**
     * @return The internal ID of the SymbolGroup used by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    public Long getGroupId() {
        return groupId;
    }

    /**
     * @param groupId The new internal ID of the SymbolGroup used by the database.
     */
    @JsonIgnore
    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    /**
     * Get the user.
     * @return The user.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "userId")
    @JsonIgnore
    public User getUser() {
        return user;
    }

    /**
     * Set the user.
     * @param user The user.
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
     * Get the id of the user.
     * @return The id of the user.
     */
    @Transient
    @JsonProperty("user")
    public Long getUserId() {
        return userId;
    }

    /**
     * Set the id of the user.
     * @param userId The id of the user.
     */
    @JsonProperty("user")
    public void setUserId(Long userId) {
        this.user = null;
        this.userId = userId;
    }

    /**
     * Get the related/ 'parent' project of the group.
     *
     * @return The project the group is a part of.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    /**
     * Set a new project for the group.
     *
     * @param project
     *         The new project.
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
     * Get the ID of the related project.
     *
     * @return The ID of the project the group belongs to or 0.
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * Create and set a new project by a new project ID.
     *
     * @param projectId
     *         The new project ID.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = null;
        this.projectId = projectId;
    }

    /**
     * Get the ID of the group within the project.
     *
     * @return THe group id.
     */
    @Column(nullable = false)
    public Long getId() {
        return id;
    }

    /**
     * Set a new ID for the group within the project.
     *
     * @param id
     *         The new group ID.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the name of the group.
     *
     * @return The group name.
     */
    @NotBlank
    public String getName() {
        return name;
    }

    /**
     * Set a new group name.
     *
     * @param name
     *         The new name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get all symbols that are organized in the group.
     *
     * @return The related symbols.
     */
    @OneToMany(
            mappedBy = "group",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}
    )
    @JsonProperty
    public Set<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * Get the amount of symbols that are organized in the group.
     *
     * @return The amount of related symbols.
     */
    @Transient
    @JsonProperty("symbolAmount")
    public int getSymbolSize() {
        if (symbols == null) {
            return 0;
        }
        return this.symbols.size();
    }

    /**
     * Set a new set of related symbols.
     *
     * @param symbols
     *         The new set of related symbols.
     */
    @JsonProperty
    public void setSymbols(Set<Symbol> symbols) {
        if (symbols == null) {
            this.symbols = new HashSet<>();
        } else {
            this.symbols = symbols;
        }
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
        return Objects.equals(groupId, group.groupId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId);
    }

    @Override
    public String toString() {
        return "SymbolGroup[" + groupId + "]: " + user + ", " + project + ", " + id + ", " + name;
    }
}
