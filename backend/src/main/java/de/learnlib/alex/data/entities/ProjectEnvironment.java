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

import com.fasterxml.jackson.annotation.JsonProperty;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "name"})
)
public class ProjectEnvironment implements Serializable {

    private static final long serialVersionUID = -1700444925209588234L;

    @Id
    @GeneratedValue
    private Long id;

    @NotEmpty
    private String name;

    @ManyToOne(optional = false)
    @JsonIgnore
    private Project project;

    @OneToMany(
            mappedBy = "environment",
            cascade = CascadeType.ALL
    )
    private List<ProjectUrl> urls;

    private boolean isDefault;

    public ProjectEnvironment() {
        this.urls = new ArrayList<>();
    }

    @Transient
    @JsonIgnore
    public ProjectUrl getDefaultUrl() {
        return this.urls.stream()
                .filter(ProjectUrl::isDefault)
                .findFirst()
                .orElse(null);
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    @JsonProperty("project")
    public Long getProjectId() {
        return project.getId();
    }

    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public List<ProjectUrl> getUrls() {
        return urls;
    }

    public void setUrls(List<ProjectUrl> urls) {
        this.urls = urls;
    }
}
