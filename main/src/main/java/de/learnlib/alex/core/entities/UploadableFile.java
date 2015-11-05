package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotBlank;

/**
 * Entity to describe an file which was uploaded.
 */
public class UploadableFile {
    @JsonProperty("project")
    private Long projectId;

    @NotBlank
    private String name;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
