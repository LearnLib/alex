/*
 * Copyright 2015 - 2021 TU Dortmund
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

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
public class LtsFormulaSuite implements Serializable {

    private static final long serialVersionUID = -7231689556807426040L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    private String name;

    @OneToMany(
            cascade = CascadeType.REMOVE,
            mappedBy = "suite"
    )
    private List<LtsFormula> formulas;

    @ManyToOne(
            optional = false
    )
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;

    public LtsFormulaSuite() {
        this.formulas = new ArrayList<>();
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

    public List<LtsFormula> getFormulas() {
        return formulas;
    }

    public void setFormulas(List<LtsFormula> formulas) {
        this.formulas = formulas;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @JsonProperty("project")
    public Long getProjectId() {
        return project == null ? null : project.getId();
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }
}
