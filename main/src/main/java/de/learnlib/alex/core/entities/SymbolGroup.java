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
import de.learnlib.alex.core.entities.validators.UniqueSymbolGroupName;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.NaturalId;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity to organize symbols.
 */
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@UniqueSymbolGroupName
public class SymbolGroup implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = 4986838799404559274L;

    /** The ID of the SymbolGroup in the DB. */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    private Long groupId;

    /** The User that owns this SymbolGroup. */
    @NaturalId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "userId")
    @JsonIgnore
    private User user;

    /** The related project. */
    @NaturalId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;

    /** The ID of the group within the project. */
    @NaturalId
    @Column(nullable = false)
    private Long id;

    /**
     * The name of the group.
     * @requiredField
     */
    @NotBlank
    private String name;

    /** The Symbols manged by this group. */
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.DELETE })
    private List<Symbol> symbols;

    /**
     * Default constructor.
     */
    public SymbolGroup() {
        this.groupId = 0L;
        this.id = 0L;
        this.symbols = new ArrayList<>();
    }

    /**
     * Set the user.
     * @param user The user.
     */
    @JsonIgnore
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Get the user.
     * @return The user.
     */
    @JsonIgnore
    public User getUser() {
        return user;
    }

    /**
     * Get the id of the user.
     * @return The id of the user.
     */
    @JsonProperty("user")
    public Long getUserId() {
        if (user == null) {
            return 0L;
        } else {
            return user.getId();
        }
    }

    /**
     * Set the id of the user.
     * @param userId The id of the user.
     */
    @JsonProperty("user")
    public void setUserId(Long userId) {
        user = new User(userId);
    }

    /**
     * Get the related/ 'parent' project of the group.
     *
     * @return The project the group is a part of.
     */
    public Project getProject() {
        return project;
    }

    /**
     * Set a new project for the group.
     *
     * @param project
     *         The new project.
     */
    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the ID of the related project.
     *
     * @return The ID of the project the group belongs to or 0.
     */
    @JsonProperty("project")
    public long getProjectId() {
        if (project == null) {
            return 0L;
        }
        return project.getId();
    }

    /**
     * Create and set a new project by a new project ID.
     *
     * @param projectId
     *         The new project ID.
     */
    @JsonProperty("project")
    public void setProjectId(long projectId) {
        this.project = new Project(projectId);
    }

    /**
     * Get the ID of the group within the project.
     *
     * @return THe group id.
     */
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
    public List<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * Get the amount of symbols that are organized in the group.
     *
     * @return The amount of related symbols.
     */
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
    public void setSymbols(List<Symbol> symbols) {
        this.symbols = symbols;
    }

    /**
     * Add one symbol to the group.
     *
     * @param symbol
     *         The symbol to add.
     */
    public void addSymbol(Symbol symbol) {
        this.symbols.add(symbol);
        symbol.setGroup(this);
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by Intellij IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SymbolGroup)) return false;

        SymbolGroup that = (SymbolGroup) o;

        // new project created from json with multiple groups
        if (project == null && that.getProject() == null
                && id.equals(0L) && that.getId().equals(0L)
                && !name.equals(that.getName())
        ) {
            return false;
        }
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (project != null ? !project.equals(that.project) : that.project != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = project != null ? project.hashCode() : 0;
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }
    // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces

    @Override
    public String toString() {
        return "SymbolGroup[" + groupId + "]: " + user + ", " + project + ", " + id + ", " + name;
    }
}
