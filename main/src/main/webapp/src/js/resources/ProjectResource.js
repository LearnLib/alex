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

import {Project} from '../entities/Project';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects
 */
// @ngInject
class ProjectResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Get all projects of a user
     * @returns {*}
     */
    getAll() {
        return this.$http.get('rest/projects')
            .then(response => response.data.map(p => new Project(p)));
    }

    /**
     * Creates a new project
     * @param {ProjectFormModel} project - The project to create
     * @returns {*}
     */
    create(project) {
        return this.$http.post('rest/projects', project)
            .then(response => new Project(response.data));
    }

    /**
     * Updates a single project
     * @param {Project} project - The updated project
     * @returns {*}
     */
    update(project) {
        return this.$http.put(`rest/projects/${project.id}`, project)
            .then(response => new Project(response.data));
    }

    /**
     * Deletes a single project from the server
     * @param {Project} project - The project to delete
     * @returns {*}
     */
    remove(project) {
        return this.$http.delete(`rest/projects/${project.id}`);
    }
}

export default ProjectResource;