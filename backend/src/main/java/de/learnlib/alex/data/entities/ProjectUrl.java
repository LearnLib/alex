/*
 * Copyright 2015 - 2020 TU Dortmund
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
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.util.Objects;

/** The class for the URL of a target system. */
@Entity
public class ProjectUrl {

    /** The id in the db. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The project the URL belongs to. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "environment_id")
    @JsonIgnore
    private ProjectEnvironment environment;

    /** An optional name for the URL. */
    private String name;

    /** The URL where the system is accessible. */
    @NotBlank
    @Pattern(regexp = "^https?://.*?")
    private String url;

    private boolean isDefault;

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public ProjectEnvironment getEnvironment() {
        return environment;
    }

    public void setEnvironment(ProjectEnvironment environment) {
        this.environment = environment;
    }

    @JsonProperty("environment")
    public Long getEnvironmentId() {
        return environment == null ? null : environment.getId();
    }

    @JsonProperty("environment")
    public void setEnvironmentId(Long environmentId) {
        this.environment = new ProjectEnvironment();
        this.environment.setId(environmentId);
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    @Override
    @SuppressWarnings("checkstyle:needbraces")
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectUrl)) return false;
        ProjectUrl that = (ProjectUrl) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public String toString() {
        return "ProjectUrl{"
                + "id=" + id
                + ", name='" + name + '\''
                + ", url='" + url + '\''
                + '}';
    }
}
