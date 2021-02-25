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

package de.learnlib.alex.data.entities.export;

import com.fasterxml.jackson.databind.JsonNode;

public class ProjectExportableEntity extends ExportableEntity {

    private JsonNode project;

    private JsonNode groups;

    private JsonNode tests;

    private JsonNode formulaSuites;

    private JsonNode learnerSetups;

    public ProjectExportableEntity() {
        super("-1", "project");
    }

    public ProjectExportableEntity(String version, JsonNode project) {
        super(version, "project");
        this.project = project;
    }

    public JsonNode getProject() {
        return project;
    }

    public void setProject(JsonNode project) {
        this.project = project;
    }

    public JsonNode getGroups() {
        return groups;
    }

    public void setGroups(JsonNode groups) {
        this.groups = groups;
    }

    public JsonNode getTests() {
        return tests;
    }

    public void setTests(JsonNode tests) {
        this.tests = tests;
    }

    public JsonNode getFormulaSuites() {
        return formulaSuites;
    }

    public void setFormulaSuites(JsonNode formulaSuites) {
        this.formulaSuites = formulaSuites;
    }

    public JsonNode getLearnerSetups() {
        return learnerSetups;
    }

    public void setLearnerSetups(JsonNode learnerSetups) {
        this.learnerSetups = learnerSetups;
    }
}
