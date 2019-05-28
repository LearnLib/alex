package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
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
    @GeneratedValue
    private Long id;

    /** The project the URL belongs to. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;

    /** An optional name for the URL. */
    private String name;

    /** The URL where the system is accessible. */
    @NotBlank
    @Pattern(regexp = "^https?://.+?")
    private String url;

    /** If the URL should be used by default. */
    private boolean defaultUrl;

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

    public boolean isDefault() {
        return defaultUrl;
    }

    public void setDefault(boolean isDefault) {
        this.defaultUrl = isDefault;
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
                + ", project=" + project.getId()
                + ", name='" + name + '\''
                + ", url='" + url + '\''
                + ", defaultUrl=" + defaultUrl
                + '}';
    }
}
