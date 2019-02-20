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

package de.learnlib.alex.modelchecking.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.data.entities.Project;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

/**
 * Entity for a LtsMin LTL formula.
 */
@Entity
public class LtsFormula implements Serializable {

    private static final long serialVersionUID = -5978527026208231972L;

    /** The ID of the formula in the database. */
    @Id
    @GeneratedValue
    private Long id;

    /** The project. */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    private Project project;

    /** The formula. */
    @Column(columnDefinition = "MEDIUMTEXT")
    private String name;

    /** The formula. */
    @NotBlank
    @Column(columnDefinition = "MEDIUMTEXT")
    private String formula;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @JsonProperty("projectId")
    public Long getProjectId() {
        return this.project == null ? null : this.project.getId();
    }

    @JsonProperty("projectId")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }

    @Override
    public String toString() {
        return "LtsFormula{"
                + "name='" + name + '\''
                + ", formula='" + formula + '\''
                + '}';
    }

}
