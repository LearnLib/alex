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

package de.learnlib.alex.testsuites.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.alex.data.entities.Project;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.util.UUID;

/**
 * The entity for a test.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"projectId"},
                        name = "Unique Test Case ID per Project"
                )
        }
)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "case", value = TestCase.class),
        @JsonSubTypes.Type(name = "suite", value = TestSuite.class),
})
public class Test {

    public static class TestRepresentation {
        private Long id;
        private String name;
        private String type;

        public TestRepresentation() {
        }

        public TestRepresentation(Test test) {
            this.id = test.id;
            this.name = test.getName();
            this.type = test instanceof TestSuite ? "suite" : "case";
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

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    /** The ID of the Test Case in the DB. */
    protected UUID uuid;

    /** The Project the Test Case belongs to. */
    private Project project;

    /** The ID of the Project to be used in the JSON. */
    private Long projectId;

    /**  The parent test suite. */
    private Test parent;

    /** The id of the parent test suite. */
    private Long parentId;

    /** The id of the Test Case in the Project. */
    protected Long id;

    /** The name of the Test Case. */
    protected String name;

    /**
     * Get the ID of Test Case used in the DB.
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
     * Set the ID the Test Case has in the DB new.
     *
     * @param uuid The new internal ID.
     */
    @JsonIgnore
    public void setUUID(UUID uuid) {
        this.uuid = uuid;
    }

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
        if (project == null) {
            this.projectId = null;
        } else {
            this.projectId = project.getId();
        }
    }

    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project   = null;
        this.projectId = projectId;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parentId")
    @JsonIgnore
    public Test getParent() {
        return parent;
    }

    @JsonIgnore
    public void setParent(Test parent) {
        this.parent = parent;
        if (parent == null) {
            this.parentId = null;
        } else {
            this.parentId = parent.getId();
        }
    }

    @Transient
    @JsonProperty("parent")
    public Long getParentId() {
        return parentId;
    }

    @JsonProperty("parent")
    public void setParentId(Long parentId) {
        this.parent   = null;
        this.parentId = parentId;
    }

    /**
     * Get the ID of the Test Case (within the project).
     *
     * @return The ID.
     * @requiredField
     */
    @JsonProperty
    public Long getId() {
        return this.id;
    }

    /**
     * Set the ID of this Test Case (within the project).
     *
     * @param id The new ID.
     */
    @JsonProperty
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the name of the Test Case.
     *
     * @return The name.
     */
    @NotBlank
    @JsonProperty
    public String getName() {
        return name;
    }

    /**
     * Set the name of the Test Case.
     *
     * @param name The new name.
     */
    @JsonProperty
    public void setName(String name) {
        this.name = name;
    }

}
