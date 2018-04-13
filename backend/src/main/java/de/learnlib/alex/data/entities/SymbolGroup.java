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
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * Entity to organize symbols.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"projectId", "id"}),
                @UniqueConstraint(columnNames = {"projectId", "name"})
        }
)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SymbolGroup implements Serializable {

    private static final long serialVersionUID = 4986838799404559274L;

    /** The ID of the SymbolGroup in the DB. */
    private UUID uuid;

    /** The related project. */
    private Project project;

    /** The plain ID of the Project to be used in the JSON. */
    private Long projectId;

    /** The ID of the group within the project. */
    private Long id;

    /**
     * The name of the group.
     */
    @NotBlank
    private String name;

    /** The Symbols manged by this group. */
    private Set<Symbol> symbols;

    /**
     * Default constructor.
     */
    public SymbolGroup() {
        this.symbols = new HashSet<>();
        this.projectId = 0L;
    }

    /**
     * @return The internal ID of the SymbolGroup used by the database.
     */
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @JsonIgnore
    public UUID getUUID() {
        return uuid;
    }

    /**
     * @param uuid The new internal ID of the SymbolGroup used by the database.
     */
    @JsonIgnore
    public void setUUID(UUID uuid) {
        this.uuid = uuid;
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
            this.projectId = null;
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

    /**
     * If the group is the default group.
     *
     * @return If the group is the default group.
     */
    @JsonIgnore
    @Transient
    public boolean isDefaultGroup() {
        return id == 0L;
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces") // Auto generated by IntelliJ
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SymbolGroup group = (SymbolGroup) o;
        return Objects.equals(uuid, group.uuid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uuid);
    }

    @Override
    public String toString() {
        return "SymbolGroup[" + uuid + "]: " + project + ", " + id + ", " + name;
    }
}
