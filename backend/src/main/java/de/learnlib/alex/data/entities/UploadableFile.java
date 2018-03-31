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

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.NotBlank;

/**
 * Entity to describe an file which was uploaded.
 */
public class UploadableFile {

    /**
     * The ID of the project the File belongs to.
     */
    @JsonProperty("project")
    private Long projectId;

    /**
     * The name of the file.
     */
    @NotBlank
    private String name;

    /**
     * Get the id of the project of the file.
     *
     * @return The id of the project.
     */
    public Long getProjectId() {
        return projectId;
    }

    /**
     * Set the project id of the file.
     *
     * @param projectId The id of the project.
     */
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    /**
     * Get the name of the file.
     *
     * @return The name of the file.
     */
    public String getName() {
        return name;
    }

    /**
     * Set the name of the file.
     *
     * @param name The name of the file.
     */
    public void setName(String name) {
        this.name = name;
    }
}
