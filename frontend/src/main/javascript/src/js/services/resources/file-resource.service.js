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

import {apiUrl} from '../../../../environments';

/**
 * The resource that handles API calls concerning the management of files.
 */
export class FileResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Fetches all available files from the server that belong to a project.
     *
     * @param {number} projectId - The id of the project.
     */
    getAll(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/files`)
            .then(response => response.data);
    }

    /**
     * Deletes a single file from the server.
     *
     * @param {number} projectId - The id of the project.
     * @param {File} file - The file object to be deleted.
     */
    remove(projectId, file) {
        const encodedFileName = encodeURI(file.name);
        return this.$http.delete(`${apiUrl}/projects/${projectId}/files/${encodedFileName}`);
    }
}
