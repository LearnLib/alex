package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.NaturalId;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Counter {

    @Id
    @GeneratedValue
    @JsonIgnore
    private Long counterId;

    @ManyToOne
    @NaturalId
    @JsonIgnore
    private Project project;

    @NaturalId
    private String name;

    private Integer value;

    public Long getCounterId() {
        return counterId;
    }

    public void setCounterId(Long counterId) {
        this.counterId = counterId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the {@link Project} the Symbol belongs to.
     *
     * @return The parent Project.
     * @requiredField
     */
    @JsonProperty("project")
    public Long getProjectId() {
        if (project == null) {
            return 0L;
        } else {
            return this.project.getId();
        }
    }

    /**
     * Set the {@link Project} the Symbol belongs to.
     *
     * @param projectId
     *            The new parent Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Counter)) return false;

        Counter counter = (Counter) o;

        if (project != null ? !project.equals(counter.project) : counter.project != null) return false;
        return !(name != null ? !name.equals(counter.name) : counter.name != null);
    }

    @Override
    public int hashCode() {
        int result = project != null ? project.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }
}
